import { SchemaEnterpriseRepository } from "../../../core/repository/enterprise/schemas/schema-repository";
import { PresentationEnterpriseRepository } from "../../../core/repository/enterprise/presentation/presentation-repository";

export class GetPresentationSchemaDefinitionUsecase {
  constructor(
    private schemasRepository: SchemaEnterpriseRepository,
    private presentationRepository: PresentationEnterpriseRepository
  ) {}

  async call(body) {
    const schema = await this.schemasRepository.getSchemasByCollection(
      body.collection
    );
    const presentation =
      await this.presentationRepository.getPresentationBySchemaId(
        schema["_id"]
      );

    return presentation["definition"];
  }
}
