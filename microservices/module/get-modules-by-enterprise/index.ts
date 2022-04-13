import { BaseController } from "../../../core/access/base-controller";
import { ResponseModel } from "../../../core/domain/models/response.model";
import { buildResponseCode } from "../../../core/helpers/response-codes.helpers";
import { MongoDBDatasource } from "../../../core/repository/datasource/mongodb.datasource";
import { EntityEnterpriseRepository } from "../../../core/repository/enterprise/entity/entity-repository";
import { EnterpriseMasterRepository } from "../../../core/repository/master/enterprise/enterprise.master.repository";
import { ModuleModel } from "./module.model";
import { GetModulesByEnterpriseIdUsecase } from "./get-modules-by-enterprise.usecase";
import { BASE_CODE, RESPONSE_CODES_MAPPER } from "../response.constants";
import { ModulesEnterpriseRepository } from "../../../core/repository/enterprise/modules/modules-repository";
import { ModulesMasterRepository } from "../../../core/repository/master/modules/modules.master.repository";
import { method } from "../../../core/helpers/decorators";

let masterDatabaseConnection = null;
let enterpriseDatabaseConnection = null;
/**
 * This function is encharged of getting all modules configured for a enterprise.
 */
export class ModuleController extends BaseController<ModuleModel> {
  @method('get')
  async handler(body: any, context: any, callback: any) {
    const MASTER_DATABASE_NAME = process.env["MASTER_DATABASE_NAME"];
    const CLUSTER_URI = process.env["MONGODB_ATLAS_CLUSTER_URI"];
    const mongoDataSource = new MongoDBDatasource();
    masterDatabaseConnection = await mongoDataSource.getConnection(
      CLUSTER_URI,
      MASTER_DATABASE_NAME,
      masterDatabaseConnection
    );
    const enterpriseMasterRepository = new EnterpriseMasterRepository(
      masterDatabaseConnection
    );
    const enterpriseObj = await enterpriseMasterRepository.getEnterpriseById(
      body["enterpriseId"]
    );

    if (enterpriseObj && enterpriseObj.database_name) {
      enterpriseDatabaseConnection = await mongoDataSource.getConnection(
        CLUSTER_URI,
        enterpriseObj.database_name,
        enterpriseDatabaseConnection
      );
    }

    const modulesMasterRepository = new ModulesMasterRepository(
      masterDatabaseConnection
    );

    const modulesEnterpriseRepository = new ModulesEnterpriseRepository(
      enterpriseDatabaseConnection
    );

    const usecase = new GetModulesByEnterpriseIdUsecase(
      modulesEnterpriseRepository,
      modulesMasterRepository
    );
    const response = await usecase.call(body);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: buildResponseCode(
          BASE_CODE,
          RESPONSE_CODES_MAPPER.MODULES_SUCCESSFULLY_FOUNDED,
          enterpriseObj
        ),
        data: {
          id: response,
        },
      } as ResponseModel<ModuleModel>),
    };
  }
}

const entityController = new ModuleController();
export const handler = entityController.handler;
