export class PresentationEnterpriseRepository {
  constructor(private enterpriseDataSource: any) {}

  async getPresentationBySchemaId(schemaId: string) {
    let response = await this.enterpriseDataSource
      .collection("presentations")
      .find({
        schema_id: schemaId,
      })
      .toArray();
    if (response.length > 0) {
      response = response[0];
    }
    return response;
  }
}
