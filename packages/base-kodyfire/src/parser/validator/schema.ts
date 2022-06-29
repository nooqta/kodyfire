import fs from 'fs';
import { join } from 'path';
// get list of files under the templates directory
const getTemplateFiles = (path = join('..', '..', 'concepts', 'templates')) =>
  fs.readdirSync(path);

console.log(getTemplateFiles());
export const concept = {
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

export const conceptArray = {
  type: 'array',
  items: concept,
};
export const schema = {
  type: 'object',
  properties: {
    project: { type: 'string' },
    name: { type: 'string' },
    rootDir: { type: 'string' },
    concept: conceptArray,
  },
  required: ['name'],
};
