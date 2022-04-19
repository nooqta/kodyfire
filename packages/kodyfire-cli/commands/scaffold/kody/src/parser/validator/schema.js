'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.schema =
  exports.databagArray =
  exports.dependencyArray =
  exports.authArray =
  exports.databaseSeedArray =
  exports.seedArray =
  exports.factoryArray =
  exports.webArray =
  exports.apiArray =
  exports.migrationArray =
  exports.repositoryArray =
  exports.auth =
  exports.databag =
  exports.databaseSeed =
  exports.seed =
  exports.factory =
  exports.web =
  exports.api =
  exports.migration =
  exports.repository =
  exports.kernelArray =
  exports.kernel =
  exports.dependency =
  exports.item =
  exports.requestArray =
  exports.request =
  exports.controllerArray =
  exports.controller =
  exports.model =
  exports.action =
    void 0;
exports.action = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    type: { type: 'string' },
    midleware: { type: 'string' },
  },
};
exports.model = {
  type: 'string',
};
exports.controller = {
  type: 'object',
  properties: {
    model: exports.model,
    namespace: { type: 'string' },
    template: { enum: ['controller.php.template'] },
  },
  required: ['template', 'namespace', 'model'],
};
exports.controllerArray = {
  type: 'array',
  items: exports.controller,
};
exports.request = {
  type: 'object',
  properties: {
    model: exports.model,
    namespace: { type: 'string' },
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
exports.migration = {
  type: 'object',
  properties: {
    model: exports.model,
    template: { enum: ['migration.php.template'] },
  },
  required: ['model'],
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
    namespace: { type: 'string' },
    model: { type: 'string' },
    template: { enum: ['factory.php.template'] },
  },
  required: ['model', 'namespace', 'template'],
};
exports.seed = {
  type: 'object',
  properties: {
    namespace: { type: 'string' },
    model: { type: 'string' },
    template: { enum: ['seed.php.template'] },
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
exports.factoryArray = {
  type: 'array',
  items: exports.factory,
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
exports.schema = {
  type: 'object',
  properties: {
    project: { type: 'string' },
    controller: exports.controllerArray,
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
  },
};
//# sourceMappingURL=schema.js.map
