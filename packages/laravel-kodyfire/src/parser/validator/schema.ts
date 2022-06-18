export const action = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    type: { type: 'string' },
    midleware: { type: 'string' },
  },
};
export const model = {
  anyOf: [
    {
      type: 'string',
    },
    {
      type: 'array',
    },
  ],
};
export const controller = {
  type: 'object',
  properties: {
    model: model,
    namespace: { type: 'string' },
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
export const baseModel = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    namespace: { type: 'string', default: 'App\\Models' },
    isMorph: { type: 'boolean', default: false },
    template: {
      enum: ['model.php.template'],
      default: 'model.php.template',
    },
    softDelete: { type: 'boolean', default: false },
    relationships: {
      type: 'array',
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
          model: model,
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
            description: 'Checkout https://phpfaker.com/ for reference',
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
          model: model,
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
        type: 'string',
      },
    },
  },
  required: ['template', 'namespace', 'name'],
};
export const controllerArray = {
  type: 'array',
  items: controller,
};

export const request = {
  type: 'object',
  properties: {
    model: model,
    namespace: { type: 'string' },
    template: { enum: ['request.php.template'] },
    prefix: { type: 'string', default: 'Create' },
  },
  required: ['template', 'namespace', 'model'],
};
export const requestArray = {
  type: 'array',
  items: request,
};

export const item = {
  type: 'string',
};

export const dependency = {
  type: 'object',
  properties: {
    install: item,
    template: { type: 'string' },
    commands: {
      type: 'array',
      items: item,
    },
    middleware: {
      type: 'array',
      items: item,
    },
  },
  required: ['template'],
};

export const kernel = {
  type: 'object',
  properties: {
    template: { enum: ['kernel.php.template'] },
  },
  required: ['template'],
};

export const kernelArray = {
  type: 'array',
  items: kernel,
};

export const repository = {
  type: 'object',
  properties: {
    model: model,
    namespace: { type: 'string' },
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

export const migration = {
  type: 'object',
  properties: {
    model: model,
    template: {
      enum: ['migration.php.template', 'blank_migration.php.template'],
    },
  },
  required: ['model'],
};

export const api = {
  type: 'object',
  properties: {
    template: { enum: ['api.php.template'] },
  },
  required: ['template'],
};

export const web = {
  type: 'object',
  properties: {
    template: { enum: ['web.php.template'] },
  },
  required: ['template'],
};

export const factory = {
  type: 'object',
  properties: {
    namespace: { type: 'string' },
    model: { type: 'string' },
    template: { enum: ['factory.php.template'] },
  },
  required: ['model', 'namespace', 'template'],
};

export const seed = {
  type: 'object',
  properties: {
    namespace: { type: 'string' },
    model: { type: ['boolean', 'string'] },
    template: {
      enum: [
        'seed.php.template',
        'database/seeders/UsersTableSeeder.php.template',
        'database/seeders/RolesTableSeeder.php.template',
      ],
    },
  },
  required: ['model', 'namespace', 'template'],
};

export const databaseSeed = {
  type: 'object',
  properties: {
    template: { enum: ['databaseSeed.php.template'] },
  },
  required: ['template'],
};

export const databag = {
  type: 'object',
  properties: {
    template: { enum: ['databag.php.template'] },
  },
  required: ['template'],
};

export const auth = {
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

export const repositoryArray = {
  type: 'array',
  items: repository,
};

export const migrationArray = {
  type: 'array',
  items: migration,
};

export const apiArray = {
  type: 'array',
  items: api,
};

export const webArray = {
  type: 'array',
  items: web,
};

export const modelArray = {
  type: 'array',
  items: baseModel,
};

export const factoryArray = {
  type: 'array',
  items: factory,
};

export const seedArray = {
  type: 'array',
  items: seed,
};

export const databaseSeedArray = {
  type: 'array',
  items: databaseSeed,
};

export const authArray = {
  type: 'array',
  items: auth,
};

export const dependencyArray = {
  type: 'array',
  items: dependency,
};

export const databagArray = {
  type: 'array',
  items: databag,
};

export const schema = {
  type: 'object',
  properties: {
    project: { type: 'string' },
    model: modelArray,
    controller: controllerArray,
    request: requestArray,
    kernel: kernelArray,
    repository: repositoryArray,
    migration: migrationArray,
    api: apiArray,
    web: webArray,
    factory: factoryArray,
    seed: seedArray,
    databaseSeed: databaseSeedArray,
    auth: authArray,
    dependency: dependencyArray,
    databag: databagArray,
  },
};
