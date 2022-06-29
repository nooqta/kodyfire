'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.schema = exports.conceptArray = exports.concept = void 0;
const fs_1 = __importDefault(require('fs'));
const path_1 = require('path');
// get list of files under the templates directory
const getTemplateFiles = (
  path = (0, path_1.join)('..', '..', 'concepts', 'templates')
) => fs_1.default.readdirSync(path);
console.log(getTemplateFiles());
exports.concept = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    template: {
      type: 'string',
      enum: getTemplateFiles(),
    },
    outputDir: { type: 'string' },
  },
};
exports.conceptArray = {
  type: 'array',
  items: exports.concept,
};
exports.schema = {
  type: 'object',
  properties: {
    project: { type: 'string' },
    name: { type: 'string' },
    rootDir: { type: 'string' },
    concept: exports.conceptArray,
  },
  required: ['name'],
};
//# sourceMappingURL=schema.js.map
