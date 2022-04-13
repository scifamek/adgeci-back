import { SchemaEnterpriseRepository } from "../../../core/repository/enterprise/schemas/schema-repository";
import { EntityEnterpriseRepository } from "../../../core/repository/enterprise/entity/entity-repository";

export interface Param {
  collection: string;
  page: number;
  sizePage: number;
}

export class GetEntitiesByTypeUsecase {
  constructor(
    private schemasRepository: SchemaEnterpriseRepository,
    private entitiesRepository: EntityEnterpriseRepository
  ) {}

  async call(params: Param) {
    const schema = await this.schemasRepository.getSchemasByCollection(
      params.collection
    );
    const relationship = [];
    for (const property in schema["definition"]) {
      const value = schema["definition"][property];
      if ("relationship" in value) {
        const coll = value["relationship"];
        relationship.push({
          relationship: coll,
          name: property,
          local: value["local"],
        });
      }
    }
    const entities = await this.entitiesRepository.getExpandedEntitiesByType(
      params.collection,
      params.page,
      params.sizePage,
      relationship
    );
    return entities;
  }
}
