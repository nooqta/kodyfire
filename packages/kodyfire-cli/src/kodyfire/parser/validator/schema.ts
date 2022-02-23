export const schema = {
  type: 'object',
  properties: {
    pages: { elements: { ref: 'page' } },
  },
  definitions: {
    page: {
      type: 'object',
      properties: {
        title: { type: 'string', required: true },
        content: { type: 'string', required: true },
        template: {
          required: true,
          enum: ['page1.html.template', 'page2.html.template'],
        },
      },
    },
  },
  required: ['pages'],
  additionalProperties: false,
};
