import { SchemaEnterpriseRepository } from "../../../core/repository/enterprise/schemas/schema-repository";

export class GetSchemasTypeEntityUsecase {
  constructor(private schemaEnterpriseRepository: SchemaEnterpriseRepository) {}
  async call() {
    const response =
      await this.schemaEnterpriseRepository.getSchemasTypeEntity();

    return response;
  }
}
