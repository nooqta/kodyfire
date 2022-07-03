import { Kody as BaseKody, Technology } from 'basic-kodyfire';
import { schema } from './schema';

export class Kody extends BaseKody {
  constructor(
    params: any,
    _schema = schema,
    technology = new Technology(params)
  ) {
    // override the templateDir property to point to our directory
    params.templatesPath = __dirname;
    // override the assets.json to include custom concepts when needed
    super(params, schema, technology);
  }
}
