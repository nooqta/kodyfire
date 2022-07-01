"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    // the target kody
    kody: { type: 'string' },
    recipes: [
        {
            source: { type: 'string' },
            // the target concept
            target: { type: 'string' },
            name: { type: 'string' },
            mapping: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    templateFolder: { type: 'string', default: 'module' },
                    data: {
                        type: 'object',
                        properties: {
                            form_fields: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        label: { type: 'string' },
                                        type: { type: 'string' },
                                        rules: { type: 'string' },
                                    },
                                },
                            },
                            columns: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        label: { type: 'string' },
                                        type: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    ],
};
//# sourceMappingURL=recipes.js.map