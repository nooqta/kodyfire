import { IKody, IKodyWorkflow, Package } from "..";

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
    console.log(currentKody);
    // stop processing if package not found
    if (typeof currentKody == "undefined") {
      this.handleKodyNotFound(name);
    }

    // require package
    const m = await import(currentKody.name);
    let kody: IKody = new m.Kody(currentKody);
    kody.package = new Package(kody);
    await kody.package.registerPackages();
    
    // parse source
    let content = kody.read(this.input);
    const data = kody.parse(content);
    /// check if source is valid
    if (!data) {
      this.handleSourceNotValid(kody.errors);
    }
    // generate artifacts | execute action
    const output = kody.generate(kody.data);
    this.handleKodySuccess();
    return output;
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
