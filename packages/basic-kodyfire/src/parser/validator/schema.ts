export const concept = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    template: {
      type: 'string',
      enum: ['sample.html.template'],
    },
    outputDir: { type: 'string' },
  },
};

export const conceptArray: { type: string; items: any } = {
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
