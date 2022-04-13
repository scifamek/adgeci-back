import { ObjectId } from "mongodb";

export class ModulesMasterRepository {
  constructor(private masterDataSource: any) {}

  async getModules() {
    const response = await this.masterDataSource
      .collection("modules")
      .find()
      .toArray();
    return response;
  }
  async getModuleById(id: string) {
    let response = await this.masterDataSource
      .collection("modules")
      .find({
        _id: ObjectId(id),
      })
      .toArray();

    if (response.length > 0) {
      response = response[0];
    }

    return response;
  }
}
