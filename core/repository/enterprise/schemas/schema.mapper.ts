import { SchemaModel } from "../../../domain/models/schema.model";

export class SchemaMapper {
  fromJson(json: any): SchemaModel {
    return {
      id: json["_id"],
      collection: json["collection"],
      definition: json["definition"],
      display: json["display"],
      presentation: json["presentation"],
      repr: json["repr"],
      type: json["type"],
    };
  }
}
