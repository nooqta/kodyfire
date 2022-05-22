const itemObject = (name: string) => ({
  type: 'object',
  properties: {
    template: { enum: [`${name}.php.template`] },
  },
  required: ['template'],
});

const itemArray = (name: string) => ({
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
  items: itemArray('route'),
};
const navigationArray = {
  type: 'array',
  items: itemArray('navigation'),
};
const assetArray = {
  type: 'array',
  items: itemArray('asset'),
};
const moduleArray = {
  type: 'array',
  items: itemArray('module'),
};

export const schema = {
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
