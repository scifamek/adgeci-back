import { SchemaMapper } from "./schema.mapper";
export class SchemaEnterpriseRepository {
  constructor(
    private enterpriseDataSource: any,
    private schemaMapper: SchemaMapper
  ) {}

  async getSchemasTypeEntity() {
    const response: any[] = await this.enterpriseDataSource
      .collection("schemas")
      .find({
        type: "entity",
      })
      .toArray();
    return response.map((x) => {
      return this.schemaMapper.fromJson(x);
    });
  }
  async getSchemasByCollection(collection) {
    let response = await this.enterpriseDataSource
      .collection("schemas")
      .find({
        type: "entity",
        collection: collection,
      })
      .toArray();

    if (response.length > 0) {
      response = response[0];
    }

    return response;
  }
}
