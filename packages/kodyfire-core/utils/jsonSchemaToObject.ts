export interface ISchema {
  type: string;
  default?: string;
  properties?: any;
  items?: ISchema;
}
const jsonSchemaToObject = (key: string, schema: ISchema, data: any) => {
  let value: any = ''; // default empty string
  if (!schema.type) {
    return;
  }

  switch (schema.type) {
    case 'string':
    case 'number':
    case 'boolean':
      if (data !== undefined) {
        value = data;
      } else if (schema.default !== undefined) {
        value = schema.default;
      }
      break;
    case 'array':
      value = [];
      if (data !== undefined) {
        data.forEach((item: any) => {
          const keys = Object.keys(schema.items?.properties || []);
          const values = item.split('|');
          const entry: any = {};
          keys.forEach(
            (key: string, index: number) => (entry[key] = values[index])
          );
          value.push(entry);
        });
      }
      break;
    case 'object':
      value = {};
      if (schema.properties) {
        Object.keys(schema.properties).forEach((k: string) => {
          const childSchema = schema.properties[k];
          value[k] = jsonSchemaToObject(key, childSchema, data[k]);
        });
      }
      break;
  }

  return value;
};

export default jsonSchemaToObject;
