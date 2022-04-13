import sys
import os

args = sys.argv
lambda_name = args[1]

enviroment = {
    'MASTER_DATABASE_NAME': 'master',
    'MONGODB_ATLAS_CLUSTER_URI': 'mongodb+srv://pochecho:sifamek666@information.ekarf.mongodb.net'
}


def add_parameters(enviroment):
    parameters = []
    char = "\\\""
    for key in enviroment:
        piece = f"{char}{key}{char}:{char}{enviroment[key]}{char}"
        parameters.append(piece)
    return ",".join(parameters)

execution_command = f"cd .. && lambda-local -l app/lambdas_output/{lambda_name}/index.js -e app/core_lambdas/{lambda_name}/event.json -t 5 -E {{{add_parameters(enviroment)}}}"


os.system(execution_command)
