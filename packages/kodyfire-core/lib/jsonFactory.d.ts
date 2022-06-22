export interface ISchema {
  type: string;
  default?: string;
  properties?: any;
  items?: ISchema;
}
declare const jsonSchemaToObject: (schema: ISchema) => any;
export default jsonSchemaToObject;
//# sourceMappingURL=jsonFactory.d.ts.map
