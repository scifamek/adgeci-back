import { EntityEnterpriseRepository } from "../../../core/repository/enterprise/entity/entity-repository";
import { IEntityModel } from "./entity.model";
import {Observable} from 'rxjs'
export interface Param {
  collection: string;
  entity: IEntityModel;
}
export class CreateEntityUsecase {
  constructor(private entitiesRepository: EntityEnterpriseRepository) {}
   call(data: Param): Observable<IEntityModel> {
    const response =  this.entitiesRepository.createEntityByType(
      data.collection,
      data.entity
    );
    return response;
  }
}
