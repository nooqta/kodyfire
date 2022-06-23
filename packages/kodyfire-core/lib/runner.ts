import { IKody, IKodyWorkflow, Package } from '..';
import jsonSchemaToObject from '../utils/jsonSchemaToObject';
import { join } from 'path';
import fs from 'fs';
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
    const updatedData = await this.preExecute(
      currentKody.name,
      kody,
      kody.data
    );

    // generate artifacts | execute action
    const output = kody.generate(updatedData);

    // Post-execute
    await this.postExecute(kody);

    this.handleKodySuccess();
    return output;
  }
  async postExecute(kody: IKody) {
    try {
      const recipes = kody.data.recipes;
      if (typeof recipes !== 'undefined') {
        for (const recipe of recipes) {
          const { schema: targetSchema } = await import(
            `${recipe.kody}/src/parser/validator/schema`
          );

          const concept = jsonSchemaToObject(
            recipe.target,
            targetSchema.properties[recipe.target].items ||
              targetSchema.properties[recipe.target],
            recipe.mapping
          );
          console.log(concept);
          const target = this.getSchemaDefinition(recipe.kody);
          target[recipe.target].push(concept);
          const targetFilename = join(
            process.cwd(),
            `kody-${recipe.kody.replace('-kodyfire', '')}.json`
          );
          kody.write(targetFilename, target);
        }
      }
    } catch (error) {
      // @todo: handle error
      console.log(error);
    }
  }

  getSchemaDefinition(dependency: string, rootDir = process.cwd()) {
    return JSON.parse(
      fs.readFileSync(
        join(rootDir, `kody-${dependency.replace('-kodyfire', '')}.json`),
        'utf8'
      )
    );
  }
  async preExecute(dependency: string, kody: IKody, data: any[]) {
    for (const key in data) {
      for (const concept of data[key]) {
        if (typeof concept.domino !== 'undefined') {
          for (const related of concept.domino) {
            const relatedConcept = data[related].find(
              (item: any) => item[key] === concept.name
            );

            if (!relatedConcept) {
              // @todo: no need to pass relatedConcept to prepareConcept
              let relatedData = {};
              relatedData = await kody.technology.prepareConcept(
                dependency,
                related,
                relatedData
              );
              relatedData = {
                ...relatedData,
                [key]: concept.name,
              };
              data[related].push(relatedData);
              // update kody.json file
              kody.write(this.input, data);
            }
          }
        }
      }
    }
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

  handleKodyError(message: any) {
    this.options.handleKodyError(message);
  }
}
