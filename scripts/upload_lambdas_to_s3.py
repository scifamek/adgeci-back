import glob
import os
bucket = 'adgeci-lambda-zip-bucket'

execution_files = list(map(lambda x: x.replace('\\', '/'),list(glob.iglob(f'../output/**/*.zip', recursive=True))))

def upload_lambda(path):
    os.system(f'aws s3 --region us-east-1 cp {path} s3://{bucket}')

for file in execution_files:
    upload_lambda(file)