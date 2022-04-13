import { BaseDatasource } from "../../datasource/base.datasource";
import { IEnterpriseModel } from "../../../domain/models/enterprise.model";
import { Observable } from "rxjs";

export class EnterpriseMasterRepository {
  constructor(private masterDataSource: BaseDatasource<IEnterpriseModel>) {}

   getEnterpriseById(enterpriseId: string): Observable<IEnterpriseModel> {
    const enterpriseObj =  this.masterDataSource.getById<IEnterpriseModel>(
      "enterprises",
      enterpriseId
    );
    return enterpriseObj;

  }
}
