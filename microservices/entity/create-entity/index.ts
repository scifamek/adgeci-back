import { BaseController } from "../../../core/access/base-controller";
import { ResponseModel } from "../../../core/domain/models/response.model";
import { buildResponseCode } from "../../../core/helpers/response-codes.helpers";
import { EntityEnterpriseRepository } from "../../../core/repository/enterprise/entity/entity-repository";
import { method } from "../../../core/helpers/decorators";
import { IEntityModel } from "./entity.model";
import { CreateEntityUsecase, Param } from "./create-entity.usecase";
import { BASE_CODE, RESPONSE_CODES_MAPPER } from "../response.constants";
import { EnterpriseIdentifiersMiddleware } from "../../../core/access/middlewares/enterprise-identifiers/enterprise-identifiers.middleware";
import { JWTStructureMiddleware } from "../../../core/access/middlewares/jwt-structure/jwt-structure.middleware";

/**
 * This function is encharged of creating a new entity in a specified collection.
 */
export class EntityController extends BaseController<IEntityModel> {
  @JWTStructureMiddleware()
  @EnterpriseIdentifiersMiddleware()
  @method("post")
  async handler(event: any, context: any, callback: any) {
    const body = event.body || {};

    const { enterpriseDataSource, masterDataSource } =
      await this.getInfrastructureComponents(event);


    const entityRepository = new EntityEnterpriseRepository(
      enterpriseDataSource
    );
    const usecase = new CreateEntityUsecase(entityRepository);
    const response: IEntityModel = await usecase.call(body as Param).toPromise();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: buildResponseCode(
          BASE_CODE,
          RESPONSE_CODES_MAPPER.ENTITY_SUCCESSFULLY_STORED,
          body
        ),
        data: response,
      } as ResponseModel<IEntityModel>),
    };
  }
}

const entityController = new EntityController();
export const handler = entityController.handler;
