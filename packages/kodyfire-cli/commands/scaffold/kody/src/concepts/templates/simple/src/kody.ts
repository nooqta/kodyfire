import { Kody as BaseKody } from 'basic-kodyfire';
import { Technology } from './technology';
import { schema } from './schema';
import assets from './assets.json';

export class Kody extends BaseKody {
  constructor(
    params: any,
    _schema = schema,
    technology = new Technology(params, assets)
  ) {
    // override the templateDir property to point to our directory
    params.templatesPath = __dirname;
    // override the assets.json to include custom concepts when needed
    super(params, schema, technology);
  }
}
