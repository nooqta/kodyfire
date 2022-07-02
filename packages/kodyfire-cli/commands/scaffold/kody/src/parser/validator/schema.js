'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.schema = exports.conceptArray = exports.concept = void 0;
exports.concept = {
  type: 'object',
  properties: {
    anis: { type: 'string' },
    name: { type: 'string' },
    template: {
      type: 'string',
      enum: ['sample.html.template'],
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
