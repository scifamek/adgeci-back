import { Observable } from "rxjs";
export abstract class BaseDatasource<T> {
  abstract setConnection(
    databaseClusterUri: string,
    databaseName: string,
    cachedDB?: any
  );
  abstract save<T>(entity: string, data: any): Observable<T>;
  abstract getById<T>(entity: string, id: string): Observable<T>;
  abstract getByFilters<T>(entity: string, filters: any): Observable<T[]>;
  collection(data: string) {}
}
