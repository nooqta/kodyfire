"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const itemObject = (name) => ({
    type: 'object',
    properties: {
        name: { type: 'string' },
        template: { enum: [`${name}.vue.template`, `${name}.js.template`] },
    },
    // required: ['template'],
});
const route = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            description: 'The name of the route file',
            enum: ['auth', 'modules', 'pages'],
        },
        template: {
            type: 'string',
            description: 'The template of the route file. This is the corrresponding file for the name property',
            enum: ['auth.js.template', 'modules.js.template', 'pages.js.template'],
        },
        routes: {
            type: 'array',
            description: 'The routes of the route file',
            items: {
                type: 'object',
                properties: {
                    path: { type: 'string', description: 'The path of the route' },
                    name: { type: 'string', description: 'The name of the route' },
                    component: {
                        type: 'string',
                        description: 'The Vue component of the route',
                    },
                    meta: {
                        description: 'The meta data of the route such as ACL, etc.',
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                key: {
                                    type: 'string',
                                    description: 'The key of the meta data',
                                },
                                value: {
                                    type: 'string',
                                    description: 'The value of the meta data',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
const navigation = {
    type: 'object',
    properties: {
        layout: {
            type: 'string',
            description: 'The layout of the navigation. Vuexy uses the layout to render the navigation',
            enum: ['vertical', 'horizontal'],
        },
        template: { enum: ['index.js.template'], default: 'index.js.template' },
        routes: {
            description: 'The routes link of the navigation',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    header: {
                        type: 'string',
                        description: 'The header if its a routes group',
                    },
                    icon: {
                        type: 'string',
                        description: 'The icon of the route. This is used to render the icon of the route',
                        enum: ['Clock', 'Home', 'User', 'Users', 'Settings', 'Logout'],
                    },
                    routeName: { type: 'string', description: 'The name of the route' },
                    resource: {
                        type: 'string',
                        description: 'The resource of the route. Used as guard along action',
                    },
                    action: {
                        type: 'string',
                        description: 'The action of the route. Used as guard along resource',
                        enum: ['read', 'create', 'update', 'delete', 'manage'],
                        default: 'read',
                    },
                    children: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                title: { type: 'string' },
                                routeName: { type: 'string' },
                                resource: { type: 'string' },
                                action: {
                                    type: 'string',
                                    enum: ['read', 'create', 'update', 'delete', 'manage'],
                                    default: 'read',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
const baseModule = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            description: 'The name of the module. Used for file naming, etc',
        },
        label: {
            type: 'string',
            description: 'The label of the module. The label to use for UI',
        },
        templateFolder: {
            type: 'string',
            enum: ['module', 'user', 'role', 'account-setting', 'invoice'],
            description: 'The template folder of the module. These are the available boilerplates for module',
            default: 'module',
        },
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
                            type: {
                                type: 'string',
                                enum: [
                                    'text',
                                    'radio',
                                    'checkbox',
                                    'textarea',
                                    'select',
                                    'dateTime',
                                ],
                            },
                            rules: { type: 'string' },
                        },
                    },
                },
                form_groups: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            icon: {
                                type: 'string',
                                enum: ['User', 'Group', 'Permission'],
                            },
                            fields: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        label: { type: 'string' },
                                        type: {
                                            type: 'string',
                                            enum: ['text', 'textarea', 'select', 'dateTime'],
                                        },
                                        rules: { type: 'string' },
                                    },
                                },
                            },
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
                            type: {
                                type: 'string',
                                enum: ['text', 'textarea', 'select', 'dateTime'],
                            },
                        },
                    },
                },
            },
        },
    },
    // required: ['template'],
};
const itemArray = (name) => ({
    type: 'array',
    items: itemObject(name),
});
const pageArray = {
    type: 'array',
    items: itemArray('page'),
};
const authPageArray = {
    type: 'array',
    items: itemArray('authPage'),
};
const routerArray = {
    type: 'array',
    items: itemArray('router'),
};
const routeArray = {
    type: 'array',
    items: route,
};
const navigationArray = {
    type: 'array',
    items: navigation,
};
const assetArray = {
    type: 'array',
    items: itemArray('asset'),
};
const moduleArray = {
    type: 'array',
    items: baseModule,
};
exports.schema = {
    type: 'object',
    properties: {
        project: { type: 'string' },
        name: { type: 'string' },
        rootDir: { type: 'string' },
        page: pageArray,
        authPage: authPageArray,
        router: routerArray,
        route: routeArray,
        navigation: navigationArray,
        asset: assetArray,
        module: moduleArray,
    },
};
//# sourceMappingURL=schema.js.map