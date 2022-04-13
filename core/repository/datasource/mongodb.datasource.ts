import { MongoClient, ObjectId } from "mongodb";

import { BaseDatasource } from "../datasource/base.datasource";
import { Observable, from, of } from "rxjs";
import { take, map } from "rxjs/operators";

export interface IFilters {
  skip: number;
  limit: number;
  conditions: {
    operator: "equals" | "contains";
    property: string;
  }[];
}
export class MongoDBDatasource<T> extends BaseDatasource<T> {
  static cachedDB = null;
  enviroment = {
    MASTER_DATABASE_NAME: "master",
    MONGODB_ATLAS_CLUSTER_URI:
      "mongodb+srv://pochecho:sifamek666@information.ekarf.mongodb.net",
  };
  connection: any;

  save<T>(collection: string, data: any): Observable<T> {
    const response = this.connection
      .collection(collection)
      .insertOne({ properties: data });
    return from(response).pipe(
      map((item: any) => {
        return {
          id: item.insertedId,
          ...data,
        } as T;
      })
    );
  }

  getById<T>(collection: string, id: string): Observable<T> {
    const obj = from(
      this.connection
        .collection(collection)
        .find({
          _id: ObjectId(id),
        })
        .toArray()
    )
      .pipe(take(1))
      .pipe(
        map((item) => {
          return item as T;
        })
      );
    return obj;
  }

  getByFilters<T>(collection: string, filters: IFilters): Observable<T[]> {
    let data = this.connection.collection(collection).find();
    if (filters.skip) {
      data = data.skip(filters.skip);
    }

    if (filters.limit) {
      data = data.limit(filters.limit);
    }
    const response = of(data.toArray()).pipe(
      map((item) => {
        console.log(item);
        return item as T[];
      })
    );
    return response;
  }

  async setConnection(databaseClusterUri: string, databaseName: string) {
    if (
      MongoDBDatasource.cachedDB &&
      MongoDBDatasource.cachedDB.serverConfig.isConnected()
    ) {
      console.log("=> using cached database instance");
      this.connection = MongoDBDatasource.cachedDB;
    }
    try {
      const mongoClient: MongoClient = new MongoClient(databaseClusterUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const connection = await mongoClient.connect();
      this.connection = connection.db(databaseName);
    } catch (error) {
      console.log("Error connecting to Mongo ", error);
    }
  }
}
