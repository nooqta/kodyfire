import { join } from 'path';
import { fs } from 'zx';

const boxen = require('boxen');

export class Action {
  static displayMessage(message: string) {
    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        align: 'center',
        borderColor: 'yellow',
        borderStyle: 'round',
      })
    );
  }
  static async execute(_args: any = { rootDir: process.cwd() }) {
    const packageJsonFile = await fs.readFile(
      join(_args.rootDir, 'package.json'),
      'utf8'
    );
    const packageJson = JSON.parse(packageJsonFile);
    const name = packageJson.name;
    let dependencies: string[] = [];
    if (
      packageJson.dependencies &&
      Object.keys(packageJson.dependencies).length > 0
    ) {
      dependencies = Object.keys(packageJson.dependencies);
    }

    if (
      packageJson.devDependencies &&
      Object.keys(packageJson.devDependencies).length > 0
    ) {
      dependencies = dependencies.concat(
        Object.keys(packageJson.devDependencies)
      );
    }

    dependencies = dependencies.filter(dep => dep.includes('-kodyfire'));
    try {
      const kody: any = {
        project: name,
        rootDir: _args.rootDir,
        sources: [],
      };
      if (dependencies.length > 0) {
        for (const dep of dependencies) {
          const entries: any = {};
          kody.sources.push({
            name: dep.replace('-kodyfire', ''),
            filename: `kody-${dep.replace('-kodyfire', '')}.json`,
          });
          // get the deb package schema file
          const { schema } = await import(`${dep}/src/parser/validator/schema`);
          const concepts = await this.getDependencyConcepts(dep);
          console.log(concepts);
          for (const prop of Object.keys(schema.properties)) {
            entries[prop] = [];
          }
          entries.project = 'my-project';
          entries.name = dep.replace('-kodyfire', '');
          entries.rootDir = _args.rootDir;

          const kodyJson = JSON.stringify(entries, null, '\t');
          fs.writeFileSync(
            join(_args.rootDir, `kody-${dep.replace('-kodyfire', '')}.json`),
            kodyJson
          );
        }

        const data = JSON.stringify(kody, null, '\t');
        fs.writeFileSync(join(_args.rootDir, 'kody.json'), data);
      }
    } catch (error) {
      this.displayMessage(error.message);
    }
  }
  static async getDependencyConcepts(dependency: string) {
    try {
      const entries: any = {};
      // get the deb package schema file
      const { schema } = await import(
        `${dependency}/src/parser/validator/schema`
      );
      for (const prop of Object.keys(schema.properties)) {
        const attributes = await this.getConceptAttributes(
          schema.properties[prop]
        );
        if (attributes) {
          entries[prop] = attributes;
        }
      }
      return { name: dependency, concepts: entries };
    } catch (error) {
      this.displayMessage(error.message);
    }
  }

  static async getConceptAttributes(schema: any): Promise<any> {
    try {
      if (Object.prototype.hasOwnProperty.call(schema, 'properties')) {
        return schema.properties;
      }
      if (Object.prototype.hasOwnProperty.call(schema, 'items')) {
        return await this.getConceptAttributes(schema.items);
      }
    } catch (error) {
      this.displayMessage(error.message);
    }
    return false;
  }

  static async addConcept(
    dependency: string,
    concept: string,
    data: any,
    rootDir: string = process.cwd()
  ) {
    try {
      let content = JSON.parse(
        fs.readFileSync(
          join(rootDir, `kody-${dependency.replace('-kodyfire', '')}.json`),
          'utf8'
        )
      );
      content[concept] = [...content[concept], data];
      content = JSON.stringify(content, null, '\t');
      fs.writeFileSync(
        join(rootDir, `kody-${dependency.replace('-kodyfire', '')}.json`),
        content
      );
    } catch (error) {
      this.displayMessage(error.message);
    }
  }
}
