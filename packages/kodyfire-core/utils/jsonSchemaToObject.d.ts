export interface ISchema {
    type: string;
    default?: string;
    properties?: any;
    items?: ISchema;
}
declare const jsonSchemaToObject: (key: string, schema: ISchema, data: any) => any;
export default jsonSchemaToObject;
//# sourceMappingURL=jsonSchemaToObject.d.ts.map