import glob
import os
import sys
from zipfile import ZipFile
import shutil
import re
OUTPUT_FOLDER = '../output'
microservices_folder = '../microservices'
lambdas_folder = 'usecases'
STACK_TEMPLATE = 'stack-template.yml'
OUTPUT_STACK = f'{OUTPUT_FOLDER}/stack.yml'

deploy_template = '''
  ApiDeployment:
    Type: AWS::ApiGateway::Deployment
    DependsOn:
{}
    Properties:
      RestApiId:
        Ref: AdgeciBackApi
      StageName: InitStage
'''
function_template = '''
  {}LambdaFunction:
    Type: AWS::Lambda::Function
    Properties:
      FunctionName: {}-lambda-function
      Runtime: nodejs14.x
      Role: !GetAtt RootRole.Arn
      Handler: index.handler
      Code:
        ZipFile: |
          exports.handler = null;
      Description: {}
      TracingConfig:
        Mode: Active
  
  {}LambdaPermission:
    Type: AWS::Lambda::Permission
    Properties:
      Action: lambda:invokeFunction
      FunctionName:
        Fn::GetAtt:
        - {}LambdaFunction
        - Arn
      Principal: apigateway.amazonaws.com
      SourceArn:
        Fn::Join:
        - ''
        - - 'arn:aws:execute-api:'
          - Ref: AWS::Region
          - ":"
          - Ref: AWS::AccountId
          - ":"
          - Ref: AdgeciBackApi
          - "/*"
  {}Resource:
    Type: AWS::ApiGateway::Resource
    Properties:
      RestApiId:
        Ref: AdgeciBackApi
      ParentId:
        Fn::GetAtt:
        - AdgeciBackApi
        - RootResourceId
      PathPart: {}
  {}Request:
    DependsOn: {}LambdaPermission
    Type: AWS::ApiGateway::Method
    Properties:
      AuthorizationType: NONE
      HttpMethod: {}
      Integration:
        Type: AWS_PROXY
        IntegrationHttpMethod: {}
        Uri:
          Fn::Join:
          - ''
          - - 'arn:aws:apigateway:'
            - Ref: AWS::Region
            - ":lambda:path/2015-03-31/functions/"
            - Fn::GetAtt:
              - {}LambdaFunction
              - Arn
            - "/invocations"
        IntegrationResponses:
        - StatusCode: 200

      ResourceId:
        Ref: {}Resource
      RestApiId:
        Ref: AdgeciBackApi
      MethodResponses:
      - StatusCode: 200
'''


def extract_lambda_description(content):
    pattern = '\/\*\*\n*[ \*]+([a-z \tA-Z0-9\*\.]+)\n[a-z A-Z0-9\*\.]*\*\/'
    found = re.findall(pattern, content)
    return found[0] if len(found) == 1 else ''

def extract_lambda_method(content):
    pattern = '@method\([\"\']{1}([a-z]+)[\"\']{1}\)'
    found = re.findall(pattern, content)
    return found[0].upper() if len(found) == 1 else ''


def extract_lambda_name(route):
    return route.split('/').pop()

def transform_lambda_name(name): 
    return ''.join(list(map(lambda x: x.capitalize(),name.split('-'))))
def normalize(x): return x.replace('\\', '/')


microservices = list(map(normalize, glob.iglob(f"{microservices_folder}/*")))


with open(STACK_TEMPLATE, 'r', encoding='utf-8') as f:
    stack_template = f.read()

try:
    shutil.rmtree(OUTPUT_FOLDER)
except OSError as e:
    print(f"Error: {OUTPUT_FOLDER} {e.strerror}")
deploy_body = ''
for microservice in microservices:
    path = f"{microservice}/*"
    lambdas_path = list(map(normalize, list(glob.iglob(path))))
    for lambda_path in lambdas_path:
      if('create-entity' in lambda_path):
        index_path = f'{lambda_path}/index.ts'
        if(os.path.isfile(index_path)):
            with open(index_path, "r", encoding="utf-8") as t:
                index_content = t.read()
            method = extract_lambda_method(index_content)
            description = extract_lambda_description(index_content)
            name = extract_lambda_name(lambda_path)
            original_name = name.replace("-lambda-function", "")
            name_permissions = original_name + 'LambdaPermission'
            logical_name = transform_lambda_name(name)

            tsconfig_path = f"tsconfig.json"
            if(os.path.isfile(f'{lambda_path}/{tsconfig_path}')):
                command = f'cd {lambda_path} && npx tsc -p {tsconfig_path}'
                print(command)
                os.system(command)
                
                output_lambda_files_path = f'../output/{original_name}'
                with open(f'{output_lambda_files_path}/index.js', 'w', encoding='utf-8') as y:
                  y.write(f'''
                        const handler = require("{lambda_path.replace('../','./')}/index");
                        exports.handler = handler.handler;
                          ''')
                
                function_body = function_template.format(
                  logical_name,
                  name,
                  description,
                  logical_name,
                  logical_name,
                  logical_name,
                  original_name,
                  logical_name,
                  logical_name,
                  method,
                  method,
                  logical_name,
                  logical_name,
                )
                deploy_body += (f'      - {logical_name}Request\n')
                stack_template += function_body
                
                shutil.copytree('../node_modules', f'../output/{original_name}/node_modules')

                
                output_lambda_path = f'../output/{original_name}/{original_name}.zip'
                zipObj = ZipFile(output_lambda_path, 'w')
                files_to_add = os.walk(output_lambda_files_path)
                for folderName, subfolders, filenames in files_to_add:
                  for filename in filenames:
                    file_path = normalize(os.path.join(folderName, filename))
                    zipObj.write(file_path, file_path.replace(f'{output_lambda_files_path}/',''))
                zipObj.close()
stack_template += deploy_template.format(f'{deploy_body}')
with open(OUTPUT_STACK, 'w', encoding='utf-8') as f:
    f.write(stack_template)