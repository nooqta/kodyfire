import { Package, Template } from 'kodyfire-core';
import fs, { existsSync } from 'fs';
import { join } from 'path';
const chalk = require('chalk');
const boxen = require('boxen');
const Table = require('cli-table');
const EventEmitter = require('events');
const ee = new EventEmitter();
const {glob} = require('glob');
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
  static displayKodies(kodies: any[]) {
    const table = new Table({
      head: ['id', 'name', 'type', 'version'],
      colWidths: [31, 31, 21, 10],
      style: {
        'padding-left': 1,
        'padding-right': 1,
        head: ['yellow'],
      },
    });

    kodies.forEach((template: Template) => {
      table.push([template.id, template.name, template.type, template.version]);
    });
    console.log(table.toString());
  }
  static async execute(args: { technology: any, summary: any }) {
    try {
      console.log(args);
      // We check if package.json exists
      const kodies = await Action.getInstalledKodies();
      // @todo: use event emitter to listen to the event of the runner
      ee.on('message', (text: string) => {
        console.log(text);
      });

      if (kodies.length == 0) {
        const kody = chalk.greenBright(chalk.bold('kody'));
        const message = `😞 No ${kody} installed yet.\nInstall a ${kody} to become a Ninja 🚀🚀🚀`;
        this.displayMessage(message);
      } else {
        // if the technology is specified, we display all concepts of the technology
        if (args.technology) {
          const packageName = `${args.technology}-kodyfire`;
          const {summary} = args;
          
          switch (summary) {
            case 'concepts':
              this.displayConcepts(packageName);
              break;
              case 'templates':
                this.displayTemplates(packageName);
                break;
              case 'overwrites':
                this.displayOverwrites(packageName);
                break;
            default:
              this.displayConcepts(packageName);
              break;
          }
        } else {
          this.displayKodies(kodies);
        }
      }
    } catch (error: any) {
      this.displayMessage(error.message);
    }
  }
  static async getInstalledKodies(): Promise<string[]> {
    return fs.existsSync('package.json')
      ? await Package.getInstalledKodies()
      : [];
  }

  static async displayTemplates(packageName: string) {
    const templates = await this.getDependencyTemplates(packageName);
    const table = new Table({
      head: ['concept', 'templates'],
      colWidths: [31, 61],
      style: {
        'padding-left': 1,
        'padding-right': 1,
        head: ['yellow'],
      },
    });
    templates.forEach((template: any) => {
      // add a description to the concept
      console.log(template);
      table.push([template.concept, template.options.join('\n')]);
    });

    console.log(table.toString());
  }
  static async displayOverwrites(packageName: string) {
    const dependency = await this.getDependencyConcepts(packageName);
    const concepts = dependency?.concepts;
    const table = new Table({
      head: ['name', 'arguments'],
      colWidths: [31, 61],
      style: {
        'padding-left': 1,
        'padding-right': 1,
        head: ['yellow'],
      },
    });
    Object.keys(concepts).forEach(name => {
      // add a description to the concept
      table.push([name, Object.keys(concepts[name]).join('\n')]);
    });
    console.log(table.toString());
  }
  static async displayConcepts(packageName: string) {
    const dependency = await this.getDependencyConcepts(packageName);
    const concepts = dependency?.concepts;
    const table = new Table({
      head: ['name', 'description'],
      colWidths: [31, 61],
      style: {
        'padding-left': 1,
        'padding-right': 1,
        head: ['yellow'],
      },
    });

    Object.keys(concepts).forEach(name => {
      // add a description to the concept
      table.push([name, `Generate a ${name}`]);
    });
    console.log(table.toString());
  }
  static async getDependencyConcepts(
    dependency: string,
    rootDir = process.cwd()
  ) {
    try {
      const entries: any = {};
      // get the deb package schema file
      const kodyPath = join(rootDir, 'node_modules', dependency);
      if (!fs.existsSync(join(rootDir, 'node_modules', dependency))) {
        this.displayMessage(`${dependency} does not exist. Install it first.`);
        process.exit(1);
        // @todo: try a globally installed kody
        // kodyPath = join(
        //   this.getNpmGlobalPrefix(),
        //   'lib',
        //   'node_modules',
        //   dependency
        // );
      }
      const { schema } = await import(kodyPath);
      for (const prop of Object.keys(schema.properties)) {
        const attributes = await this.getConceptAttributes(
          schema.properties[prop]
        );
        if (attributes) {
          entries[prop] = attributes;
        }
      }

      return { name: dependency, concepts: entries };
    } catch (error: any) {
      this.displayMessage(error.message);
    }
  }
  static async getDependencyTemplates(
    dependency: string,
    rootDir = process.cwd()
  ) {
    try {
      // get the deb package schema file
      const kodyPath = join(rootDir, 'node_modules', dependency);
      if (!fs.existsSync(join(rootDir, 'node_modules', dependency))) {
        this.displayMessage(`${dependency} does not exist. Install it first.`);
        process.exit(1);
        // @todo: try a globally installed kody
        // kodyPath = join(
        //   this.getNpmGlobalPrefix(),
        //   'lib',
        //   'node_modules',
        //   dependency
        // );
      }
      const sources = [
        `.kody/${dependency}/templates/`,
        `node_modules/${dependency}/src/concepts/templates/`,
        `node_modules/${dependency}/src/templates/`,
      ];
      let files: string[] = [];
      //for each source folder if it exists copy it to the target folder
      for (const source of sources) {
        if (existsSync(source)) {
          const currentFiles = (await glob(`${source}/*.template`)).map((file: string) =>  file.replace(source, ''));
          files = [...new Set([...files, ...currentFiles])]
        }
      }

      console.log(files);
      const assets = await import(join(kodyPath, 'src', 'assets.json'));

      const filteredTemplates = assets?.concepts.filter((concept:any) => concept.hasOwnProperty('template')).map((concept:any) => ({concept: concept.name, options: files.filter((file: string) => {
        const regexp = new RegExp(`^${concept.name}`, 'i');
        return regexp.test(file);
      })}));
      
      return filteredTemplates
    } catch (error: any) {
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
    } catch (error: any) {
      this.displayMessage(error.message);
    }
    return false;
  }
}
export const action = async (args: any) => {
  await Action.execute(args);
  // try {
  //   const kodies = await Package.getInstalledKodies();
  //   // @todo: use event emitter to listen to the event of the runner
  //   ee.on('message', (text: string) => {
  //     console.log(text);
  //   });

  //   if (kodies.length == 0) {
  //     const kody = chalk.greenBright(chalk.bold('kody'));
  //     const message = `😞 No ${kody} installed yet.\nInstall a ${kody} to become a Ninja 🚀🚀🚀`;
  //     Action.displayMessage(message);
  //   } else {
  //     Action.displayKodies(kodies);
  //   }
  // } catch (error: any) {
  //   Action.displayMessage(error.message);
  // }
};
