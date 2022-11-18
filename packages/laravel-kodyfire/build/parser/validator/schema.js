"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.customConceptArray = exports.customConcept = exports.databagArray = exports.dependencyArray = exports.authArray = exports.databaseSeedArray = exports.seedArray = exports.langArray = exports.testArray = exports.factoryArray = exports.modelArray = exports.webArray = exports.apiArray = exports.migrationArray = exports.repositoryArray = exports.auth = exports.databag = exports.databaseSeed = exports.seed = exports.lang = exports.test = exports.factory = exports.web = exports.api = exports.migration = exports.repository = exports.kernelArray = exports.kernel = exports.dependency = exports.item = exports.requestArray = exports.request = exports.controllerArray = exports.baseModel = exports.controller = exports.model = exports.action = void 0;
exports.action = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        type: { type: 'string' },
        midleware: { type: 'string' },
    },
};
exports.model = { type: 'string' };
exports.controller = {
    type: 'object',
    properties: {
        model: exports.model,
        namespace: { type: 'string', default: 'App\\Http\\Controllers' },
        template: { enum: ['controller.php.template'] },
        routeType: {
            type: 'string',
            enum: ['detailed', 'resource', 'apiResource'],
        },
        middleware: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        actions: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    type: {
                        type: 'string',
                        enum: [
                            'index',
                            'store',
                            'show',
                            'update',
                            'destroy',
                            'deleteMany',
                            'getByUser',
                            'getUserRelation',
                            'storeWithManyRelation',
                            'updateWithManyRelation',
                            'downloadPDF',
                            'generate',
                        ],
                    },
                    options: {
                        type: 'object',
                        properties: {
                            template: { type: 'string' },
                            data: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        placeholder: { type: 'string' },
                                        value: { type: 'string' },
                                        convert_to_pdf: { type: 'boolean', default: false },
                                        save_on_disc: { type: 'boolean', default: true },
                                    },
                                },
                            },
                        },
                    },
                    routeName: { type: 'string' },
                    relation: { type: 'string' },
                    middleware: { type: 'string' },
                    searchBy: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                type: { type: 'string' },
                            },
                        },
                    },
                    filterBy: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                relation: { type: 'string' },
                                relationName: { type: 'string' },
                                field: { type: 'string' },
                                type: { type: 'string' },
                            },
                        },
                    },
                },
            },
        },
    },
    required: ['template', 'model'],
};
exports.baseModel = {
    type: 'object',
    properties: {
        name: { type: 'string', description: 'The model name' },
        namespace: { type: 'string', default: 'App\\Models' },
        isMorph: { type: 'boolean', default: false },
        template: {
            enum: ['model.php.template'],
            default: 'model.php.template',
        },
        softDelete: { type: 'boolean', default: false },
        relationships: {
            type: 'array',
            description: 'The model relationships. Example: [{name: "users", type: "hasMany"}]',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    type: {
                        type: 'string',
                        enum: [
                            'hasOne',
                            'hasMany',
                            'belongsTo',
                            'belongsToMany',
                            'morphTo',
                        ],
                    },
                    model: { type: 'string' },
                },
            },
        },
        fields: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    type: {
                        type: 'string',
                        enum: [
                            'string',
                            'integer',
                            'boolean',
                            'enum',
                            'decimal',
                            'dateTime',
                            'date',
                            'time',
                            'json',
                            'text',
                        ],
                    },
                    faker_type: {
                        type: 'string',
                        description: 'This used by the factory. Checkout https://phpfaker.com/ for reference',
                        enum: [
                            'word',
                            'name',
                            'email',
                            'boolean',
                            'phoneNumber',
                            'dateTime',
                            'address',
                            'randomDigit',
                            'randomNumber',
                            'randomFloat',
                            'sentence',
                            'text',
                            'company',
                            'buildingNumber',
                            'streetAddress',
                            'secondaryAddress',
                            'subdivision',
                            'city',
                            'governorate',
                            'country',
                            'postcode',
                        ],
                    },
                    arguments: {
                        type: 'array',
                        items: {
                            description: 'The argument list (Ex:$table->decimal(10,2))',
                            type: 'string',
                        },
                    },
                    options: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                key: { type: 'string' },
                                value: { type: 'string' },
                            },
                        },
                    },
                },
            },
        },
        foreign_keys: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    model: exports.model,
                    column: { type: 'string' },
                    reference: { type: 'string', default: 'id' },
                    on: { type: 'string' },
                    onUpdate: { type: 'string', default: 'cascade' },
                    onDelete: { type: 'string', default: 'cascade' },
                },
            },
        },
        fillable: {
            type: 'array',
            items: {
                description: 'The fillable fields. Example: ["name", "email"]',
                type: 'string',
            },
        },
    },
    required: ['template', 'namespace', 'name'],
};
exports.controllerArray = {
    type: 'array',
    items: exports.controller,
};
exports.request = {
    type: 'object',
    properties: {
        model: exports.model,
        namespace: { type: 'string', default: 'App\\Requests' },
        template: { enum: ['request.php.template'] },
        prefix: { type: 'string', default: 'Create' },
    },
    required: ['template', 'namespace', 'model'],
};
exports.requestArray = {
    type: 'array',
    items: exports.request,
};
exports.item = {
    type: 'string',
};
exports.dependency = {
    type: 'object',
    properties: {
        install: exports.item,
        template: { type: 'string' },
        commands: {
            type: 'array',
            items: exports.item,
        },
        middleware: {
            type: 'array',
            items: exports.item,
        },
    },
    required: ['template'],
};
exports.kernel = {
    type: 'object',
    properties: {
        template: { enum: ['kernel.php.template'] },
    },
    required: ['template'],
};
exports.kernelArray = {
    type: 'array',
    items: exports.kernel,
};
exports.repository = {
    type: 'object',
    properties: {
        model: exports.model,
        namespace: { type: 'string', default: 'App\\Repositories' },
        template: {
            enum: [
                'repository.php.template',
                'repositoryParent.php.template',
                'repositories.php.template',
            ],
        },
    },
    required: ['model'],
};
exports.migration = {
    type: 'object',
    properties: {
        model: exports.model,
        template: {
            enum: ['migration.php.template', 'blank_migration.php.template'],
            default: 'migration.php.template',
        },
    },
    required: ['model', 'template'],
};
exports.api = {
    type: 'object',
    properties: {
        template: { enum: ['api.php.template'] },
    },
    required: ['template'],
};
exports.web = {
    type: 'object',
    properties: {
        template: { enum: ['web.php.template'] },
    },
    required: ['template'],
};
exports.factory = {
    type: 'object',
    properties: {
        namespace: { type: 'string', default: 'Database\\Factories' },
        model: { type: 'string' },
        template: {
            enum: ['factory.php.template'],
            default: 'factory.php.template',
        },
    },
    required: ['model', 'namespace', 'template'],
};
exports.test = {
    type: 'object',
    properties: {
        model: { type: 'string' },
        template: { enum: ['test.php.template'] },
    },
    required: ['model', 'template'],
};
exports.lang = {
    type: 'object',
    properties: {
        model: { type: 'string' },
        template: { enum: ['lang.php.template'] },
        language: {
            type: 'string',
            enum: [
                'ar',
                'en',
                'es',
                'fr',
                'de',
                'it',
                'pt',
                'nl',
                'ru',
                'pl',
                'ja',
                'zh',
                'ko',
                'tr',
                'uk',
                'vi',
                'id',
                'fa',
                'he',
                'cs',
                'sv',
                'fi',
                'ro',
                'hu',
                'ca',
                'hr',
                'el',
                'sk',
                'sl',
                'sr',
                'bg',
                'da',
                'lt',
                'eo',
                'et',
                'gl',
                'hi',
                'is',
                'kk',
                'lv',
                'mk',
                'no',
                'pa',
                'pt_BR',
                'pt_PT',
                'ro_RO',
                'sq',
                'sv_SE',
                'th',
                'uk_UA',
                'zh_CN',
                'zh_TW',
            ],
            default: 'ar',
        },
        texts: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    key: { type: 'string' },
                    value: { type: 'string' },
                },
            },
        },
    },
    required: ['model', 'template'],
};
exports.seed = {
    type: 'object',
    properties: {
        namespace: { type: 'string', default: 'Database\\Seeds' },
        model: {
            anyOf: [
                {
                    type: 'string',
                },
                {
                    type: 'boolean',
                },
            ],
        },
        template: {
            enum: [
                'seed.php.template',
                'database/seeders/UsersTableSeeder.php.template',
                'database/seeders/RolesTableSeeder.php.template',
            ],
            default: 'seed.php.template',
        },
    },
    required: ['model', 'namespace', 'template'],
};
exports.databaseSeed = {
    type: 'object',
    properties: {
        template: { enum: ['databaseSeed.php.template'] },
    },
    required: ['template'],
};
exports.databag = {
    type: 'object',
    properties: {
        template: { enum: ['databag.php.template'] },
    },
    required: ['template'],
};
exports.auth = {
    type: 'object',
    properties: {
        template: {
            enum: [
                'fortify.php.template',
                'sanctum.php.template',
                'cors.php.template',
                'auth.php.template',
                'repositoryParent.php.template',
                'repositories.php.template',
                'config.php.template',
                'reset.php.template',
                'provider.php.template',
                'redirectifauthenticated.php.template',
                'app.php.template',
            ],
        },
    },
    required: ['template'],
};
exports.repositoryArray = {
    type: 'array',
    items: exports.repository,
};
exports.migrationArray = {
    type: 'array',
    items: exports.migration,
};
exports.apiArray = {
    type: 'array',
    items: exports.api,
};
exports.webArray = {
    type: 'array',
    items: exports.web,
};
exports.modelArray = {
    type: 'array',
    items: exports.baseModel,
};
exports.factoryArray = {
    type: 'array',
    items: exports.factory,
};
exports.testArray = {
    type: 'array',
    items: exports.test,
};
exports.langArray = {
    type: 'array',
    items: exports.lang,
};
exports.seedArray = {
    type: 'array',
    items: exports.seed,
};
exports.databaseSeedArray = {
    type: 'array',
    items: exports.databaseSeed,
};
exports.authArray = {
    type: 'array',
    items: exports.auth,
};
exports.dependencyArray = {
    type: 'array',
    items: exports.dependency,
};
exports.databagArray = {
    type: 'array',
    items: exports.databag,
};
exports.customConcept = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        model: {
            anyOf: [
                {
                    type: 'string',
                },
                {
                    type: 'boolean',
                },
            ],
        },
        template: {
            type: 'string',
            enum: [
                'app/Http/kernel.php.template',
                'app/Repositories/Repositories.php.template',
                'app/Repositories/Repository.php.template',
                'app/Storage/DataBag.php.template',
                'config/auth.php.template',
                'resources/lang/lang.php.template',
            ],
        },
        outputDir: { type: 'string' },
    },
};
exports.customConceptArray = {
    type: 'array',
    items: exports.customConcept,
};
exports.schema = {
    type: 'object',
    properties: {
        project: { type: 'string' },
        model: exports.modelArray,
        controller: exports.controllerArray,
        test: exports.testArray,
        lang: exports.langArray,
        request: exports.requestArray,
        kernel: exports.kernelArray,
        repository: exports.repositoryArray,
        migration: exports.migrationArray,
        api: exports.apiArray,
        web: exports.webArray,
        factory: exports.factoryArray,
        seed: exports.seedArray,
        databaseSeed: exports.databaseSeedArray,
        auth: exports.authArray,
        dependency: exports.dependencyArray,
        databag: exports.databagArray,
        customConcept: exports.customConceptArray,
    },
};
//# sourceMappingURL=schema.js.map