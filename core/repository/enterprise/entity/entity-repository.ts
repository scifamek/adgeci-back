import { Observable } from "rxjs";
import { IEntityModel } from "../../../../microservices/entity/create-entity/entity.model";
import { BaseDatasource } from "../../datasource/base.datasource";
import { IFilters } from "../../datasource/mongodb.datasource";

export class EntityEnterpriseRepository {
  constructor(private enterpriseDataSource: BaseDatasource<IEntityModel>) {}

   getEntitiesByType(
    collection: string,
    page: number,
    sizePage: number
  ): Observable<IEntityModel[]> {
    const skip = sizePage * page;
    const response = this.enterpriseDataSource.getByFilters<IEntityModel>(
      collection,
      {
        skip,
        limit: sizePage,
        conditions: [
          {
            operator: "equals",
            property: "",
          },
        ],
      } as IFilters
    );
    return response;
  }
  // async getExpandedEntitiesByType(
  //   collection: string,
  //   page: number,
  //   sizePage: number,
  //   relationship: any
  // ) {
  //   const skip = sizePage * page;
  //   const pipeline = [];
  //   for (const rel of relationship) {
  //     pipeline.push({
  //       $lookup: {
  //         from: rel["relationship"],
  //         localField: `properties.${rel["name"]}`,
  //         foreignField: "_id",
  //         as: rel["relationship"],
  //       },
  //     });
  //   }
  //   const response = await this.enterpriseDataSource
  //     .collection(collection)
  //     .aggregate(pipeline)
  //     .skip(skip)
  //     .limit(sizePage)
  //     .toArray();
  //   return response;
  // }
  // async getFormattedEntitiesByType(
  //   collection: string,
  //   page: number,
  //   sizePage: number,
  //   fields: any,
  //   relationship: any
  // ) {
  //   const skip = sizePage * page;

  //   var definition: any = { properties: {} };

  //   for (const df of fields) {
  //     definition["properties"][df] = 1;
  //   }

  //   const pipeline = [];

  //   for (const rel of relationship) {
  //     pipeline.push({
  //       $lookup: {
  //         from: rel["relationship"],
  //         localField: `properties.${rel["local"]}`,
  //         foreignField: "_id",
  //         as: rel["relationship"],
  //       },
  //     });
  //   }

  //   for (const rel of relationship) {
  //     const repr = rel["repr"]
  //       .map((x: any) => `$$xxx.properties.${x}`)
  //       .join(", ,")
  //       .split(",");
  //     console.log(repr);
  //     const obj: any = {};
  //     obj[rel["name"]] = {
  //       $map: {
  //         input: `$${rel["name"]}`,
  //         as: "xxx",
  //         in: { $concat: repr },
  //       },
  //     };

  //     pipeline.push({
  //       $addFields: obj,
  //     });
  //   }

  //   console.log(JSON.stringify(pipeline));
  //   const response = await this.enterpriseDataSource
  //     .collection(collection)
  //     .aggregate(pipeline)
  //     .skip(skip)
  //     .limit(sizePage)
  //     .toArray();
  //   return response;
  // }

  createEntityByType(collection: string, data: any): Observable<IEntityModel> {
    return this.enterpriseDataSource.save<IEntityModel>(collection, data);
  }
}
