import { BaseController } from "../../../core/access/base-controller";
import { ResponseModel } from "../../../core/domain/models/response.model";
import { SchemaModel } from "../../../core/domain/models/schema.model";
import { buildResponseCode } from "../../../core/helpers/response-codes.helpers";
import { MongoDBDatasource } from "../../../core/repository/datasource/mongodb.datasource";
import { EnterpriseMasterRepository } from "../../../core/repository/master/enterprise/enterprise.master.repository";
import { GetSchemasTypeEntityUsecase } from "./get-schemas-type-entity.usecase";
import { BASE_CODE, RESPONSE_CODES_MAPPER } from "../response.constants";
import { SchemaEnterpriseRepository } from "../../../core/repository/enterprise/schemas/schema-repository";
import { SchemaMapper } from "../../../core/repository/enterprise/schemas/schema.mapper";
import { method} from "../../../core/helpers/decorators";
import jwt_decode from "jwt-decode";

let masterDatabaseConnection = null;
let enterpriseDatabaseConnection = null;
/**
 * This function is encharged of creating a new entity in a specified collection.
 */
export class Controller extends BaseController<SchemaModel[]> {
   @method('get')
  async handler(event: any, context: any, callback: any) {


    const params = event.queryStringParameters || {};
    const headers = event.headers || {};
    
    if (!headers.token) {
      return {
        statusCode: 304,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: {
            status: 304,
            message: "Token is not present in the header",
          },
          data: {},
        } as ResponseModel<any>),
      };
    }

    const decodedToken = jwt_decode(headers.token);




    const MASTER_DATABASE_NAME = process.env["MASTER_DATABASE_NAME"];
    const CLUSTER_URI = process.env["MONGODB_ATLAS_CLUSTER_URI"];
    const dataSource = new MongoDBDatasource();
    masterDatabaseConnection = await dataSource.getConnection(
      CLUSTER_URI,
      MASTER_DATABASE_NAME,
      masterDatabaseConnection
    );
    const enterpriseMasterRepository = new EnterpriseMasterRepository(
      masterDatabaseConnection
    );
    const enterpriseObj = await enterpriseMasterRepository.getEnterpriseById(
      decodedToken["enterpriseId"]
    );
    if (enterpriseObj && enterpriseObj.database_name) {
      enterpriseDatabaseConnection = await dataSource.getConnection(
        CLUSTER_URI,
        enterpriseObj.database_name,
        enterpriseDatabaseConnection
      );
    }

    const schemaMapper = new SchemaMapper();
    const schemaEnterpriseRepository = new SchemaEnterpriseRepository(
      enterpriseDatabaseConnection,
      schemaMapper
    );
    const usecase = new GetSchemasTypeEntityUsecase(schemaEnterpriseRepository);
    const response = await usecase.call();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: buildResponseCode(
          BASE_CODE,
          RESPONSE_CODES_MAPPER.SCHEMAS_TYPE_ENTITY_SUCCESSFULLY_FOUNDED,
          enterpriseObj
        ),
        data: response,
      } as ResponseModel<SchemaModel[]>),
    };
  }
}

const entityController = new Controller();
export const handler = entityController.handler;
