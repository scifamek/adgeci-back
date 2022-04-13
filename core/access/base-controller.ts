import { ResponseModel } from "../domain/models/response.model";

import jwt_decode from "jwt-decode";
import { MongoDBDatasource } from "../repository/datasource/mongodb.datasource";
import { EnterpriseMasterRepository } from "../repository/master/enterprise/enterprise.master.repository";

import {
  DATABASE_NAME_HEADER,
  ENTERPRISE_ID_HEADER,
} from "../access/constants/enterprise-identifiers.constants";
import { BaseDatasource } from "../repository/datasource/base.datasource";
export const MASTER_DATABASE_NAME_ENVIRONMENT_VARIABLE = "MASTER_DATABASE_NAME";
export const MONGODB_ATLAS_CLUSTER_URI_ENVIRONMENT_VARIABLE =
  "MONGODB_ATLAS_CLUSTER_URI";

export class BaseController<T> {
  constructor() {}

  async getInfrastructureComponents(event: any) {

    const CLUSTER_URI =
      process.env[MONGODB_ATLAS_CLUSTER_URI_ENVIRONMENT_VARIABLE];

    const MASTER_DATABASE_NAME =
      process.env[MASTER_DATABASE_NAME_ENVIRONMENT_VARIABLE];

    const headers = event.headers;

    const decodedToken = jwt_decode(headers.token);
    const databaseName = decodedToken[DATABASE_NAME_HEADER];
    const enterpriseId = decodedToken[ENTERPRISE_ID_HEADER];

    const enterpriseDataSource = new MongoDBDatasource();
    const masterDataSource = new MongoDBDatasource();

    if (databaseName) {
      try {
        await enterpriseDataSource.setConnection(CLUSTER_URI, databaseName);
      } catch (error) {
        if (enterpriseId) {
          await this.getConnectionsByEnterpiseId(
            masterDataSource,
            enterpriseDataSource,
            CLUSTER_URI,
            MASTER_DATABASE_NAME,
            enterpriseId
          );
        }
      }
    } else if (enterpriseId) {
      await this.getConnectionsByEnterpiseId(
        masterDataSource,
        enterpriseDataSource,
        CLUSTER_URI,
        MASTER_DATABASE_NAME,
        enterpriseId
      );
    }

    return {
      enterpriseDataSource,
      masterDataSource,
    };
  }

  private async getConnectionsByEnterpiseId(
    masterDataSource: BaseDatasource<T>,
    enterpriseDataSource: BaseDatasource<T>,
    CLUSTER_URI: string,
    MASTER_DATABASE_NAME: string,
    enterpriseId: any
  ) {
    await masterDataSource.setConnection(CLUSTER_URI, MASTER_DATABASE_NAME);

    const enterpriseMasterRepository = new EnterpriseMasterRepository(
      masterDataSource
    );

    const enterpriseObj = await enterpriseMasterRepository
      .getEnterpriseById(enterpriseId)
      .toPromise();

    if (enterpriseObj && enterpriseObj.databaseName) {
      await enterpriseDataSource.setConnection(CLUSTER_URI, enterpriseObj.databaseName);
    }
  }
}
