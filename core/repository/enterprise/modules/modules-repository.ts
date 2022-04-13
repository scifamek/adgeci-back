
export class ModulesEnterpriseRepository {
  constructor(private enterpriseDataSource: any) {}

  async getModules() {
    const response = await this.enterpriseDataSource
      .collection("modules")
      .find()
      .toArray();
    return response;
  }

  
}
