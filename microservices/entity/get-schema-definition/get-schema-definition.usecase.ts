import { SchemaEnterpriseRepository } from "../../../core/repository/enterprise/schemas/schema-repository";

export interface Param {
  collection: string;
  page: number;
  sizePage: number;
}

export class GetSchemaDefinitionUsecase {
  constructor(private schemasRepository: SchemaEnterpriseRepository) {}

  async call(params) {
    console.log(params);
    const schema = await this.schemasRepository.getSchemasByCollection(
      params.collection
    );
    console.log(schema);
    const response = this.extractMetadata(schema);
    return response;
  }

  private extractMetadata(entitiesBySchema) {
    var tags = [];
    var definitions = [];
    var columns = [];
    for (const key in entitiesBySchema.definition) {
      if (
        Object.prototype.hasOwnProperty.call(entitiesBySchema.definition, key)
      ) {
        const element = entitiesBySchema.definition[key];
        if (element["visible"] && element["usable"]) {
          tags.push(element["display"]);
          definitions.push(key);

          columns.push({
            definition: key,
            tag: element["display"],
          });
        }
      }
    }

    return {
      tags: tags,
      definitions: definitions,
      columns: columns,
    };
  }
}
