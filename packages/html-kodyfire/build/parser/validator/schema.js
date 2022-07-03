"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.pagesArray = exports.page = void 0;
exports.page = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        template: { enum: ['page1.html.template', 'page2.html.template'] },
    },
    required: ['title'],
};
exports.pagesArray = {
    type: 'array',
    items: exports.page,
};
exports.schema = {
    type: 'object',
    properties: {
        pages: exports.pagesArray,
    },
};
//# sourceMappingURL=schema.js.map