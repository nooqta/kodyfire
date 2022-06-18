import { IKody, IKodyWorkflow, Package } from '..';

export class Runner implements IKodyWorkflow {
  options: any;
  input: any;
  constructor(options: any) {
    this.options = options;
    this.input = options.input;
  }
  async run(_options: any) {
    // get package name
    const { name } = _options;
    const currentKody: any = await this.getKody(name);
    // stop processing if package not found
    if (typeof currentKody == 'undefined') {
      this.handleKodyNotFound(name);
    }

    // require package
    const m = await import(currentKody.name);
    const kody: IKody = new m.Kody({ ..._options, ...currentKody });
    kody.package = new Package(kody);
    await kody.package.registerPackages();

    // parse source
    const content = kody.read(this.input);
    const data = kody.parse(content);
    /// check if source is valid
    if (!data) {
      this.handleSourceNotValid(kody.errors);
    }

    // Pre-execute
    const updatedData = await this.preExecute(kody.data);

    // generate artifacts | execute action
    const output = kody.generate(updatedData);
    this.handleKodySuccess();
    return output;
  }
  async preExecute(data: any[]) {
    for (const key in data) {
      for (const concept of data[key]) {
        if (typeof concept.domino !== 'undefined') {
          for (const related of concept.domino) {
            const relatedConcept = data[related].find(
              (item: any) => item[key] === concept.name
            );
            if (!relatedConcept) {
              const relatedData = {
                [key]: concept.name,
                template: `${related}.php.template`,
              };
              data[related].push(relatedData);
            }
          }
        }
      }
    }
    // @todo: update kody.json file
    return data;
  }

  handleKodyNotFound(name: any) {
    this.options.handleKodyNotFound(name);
  }
  async getKody(name: any): Promise<any> {
    return await this.options.getKody(name);
  }

  handleSourceNotValid(errors: any) {
    this.options.handleSourceNotValid(errors);
  }

  handleKodySuccess() {
    this.options.handleKodySuccess();
  }
}
