'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const jsonSchemaToObject = (key, schema, data) => {
  let value = ''; // default empty string
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
        data.forEach(item => {
          var _a;
          const keys = Object.keys(
            ((_a = schema.items) === null || _a === void 0
              ? void 0
              : _a.properties) || []
          );
          const values = item.split('|');
          const entry = {};
          keys.forEach((key, index) => (entry[key] = values[index]));
          value.push(entry);
        });
      }
      break;
    case 'object':
      value = {};
      if (schema.properties) {
        Object.keys(schema.properties).forEach(k => {
          const childSchema = schema.properties[k];
          value[k] = jsonSchemaToObject(key, childSchema, data[k]);
        });
      }
      break;
  }
  return value;
};
exports.default = jsonSchemaToObject;
//# sourceMappingURL=jsonSchemaToObject.js.map
