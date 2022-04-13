import glob
import os
import time
bucket = 'adgeci-lambda-zip-bucket'
base_command = 'aws lambda update-function-code --function-name  {} --s3-bucket {}  --s3-key {}.zip'

execution_files = list(map(lambda x: x.replace('\\', '/'),list(glob.iglob(f'../output/**/*.zip', recursive=True))))
print(execution_files)
def upload_lambda(path):
    name = path.split('/')[2]
    real_name = f'{name}-lambda-function'
    command = base_command.format(f'{real_name}',bucket, name)
    print(command)
    
    print()
    os.system(command)
    time.sleep(5)
    os.system(f'aws lambda update-function-configuration --function-name  { real_name } --environment "Variables={{MASTER_DATABASE_NAME=master,MONGODB_ATLAS_CLUSTER_URI=mongodb+srv://pochecho:sifamek666@information.ekarf.mongodb.net}}" ')

for file in execution_files:
    upload_lambda(file)