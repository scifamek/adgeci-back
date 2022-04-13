export interface SchemaModel {
  id: string;
  collection: string;
  type: string;
  presentation: {
    icon: string;
  };
  display: string;
  repr: string[];
  definition: any;
}
