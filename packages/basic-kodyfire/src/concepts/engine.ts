import { strings } from '@angular-devkit/core';
import * as builder from 'handlebars';
import { join, relative, dirname } from 'path';
const fs = require('fs');
const fsPromises = fs.promises;
export interface IBuilder {
  compile(template: string): any;
}
export interface IEngine {
  builder: IBuilder;
}
export class Engine {
  builder: any;
  constructor() {
    this.builder = builder;
    this.registerPartials();
  }
  registerPartials() {
    this.builder.registerHelper('lowercase', (value: any) => {
      return value.toLowerCase();
    });
    this.builder.registerHelper('stringify', (value: any) => {
      return JSON.stringify(value);
    });
    this.builder.registerHelper('join', (value: any) => {
      return value.join(', ');
    });
    this.builder.registerHelper(
      'ifEquals',
      function (
        arg1: any,
        arg2: any,
        options: { fn: (arg0: any) => any; inverse: (arg0: any) => any }
      ) {
        /* @ts-ignore */
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
      }
    );
    this.builder.registerHelper('includes', function (arg1: any) {
      /* @ts-ignore */
      return [
        'integer',
        'string',
        'boolean',
        'date',
        'dateTime',
        'time',
        'timestamp',
        'json',
        'text',
      ].includes(arg1);
    });
    this.builder.registerHelper('equals', function (arg1: any, arg2: any) {
      /* @ts-ignore */
      return arg1 == arg2;
    });
    for (const key in strings) {
      this.builder.registerHelper(key, (value: any) => {
        /* @ts-ignore */
        return strings[key](value);
      });
    }
  }
  async read(path: string, templateName: any) {
    if (fs.existsSync(join(path, templateName))) {
      const template = await fsPromises.readFile(join(path, templateName));
      return template?.toString();
    }
    const template = await fsPromises.readFile(
      join(relative(process.cwd(), __dirname), path, templateName)
    );
    return template?.toString();
  }

  async getPartial(path: string, template: string, data: any) {
    const tpl = await this.read(path, template);

    const compiled = await this.compile(tpl, data);
    return compiled;
  }

  compile(template: any, data: any) {
    const tpl = this.builder.compile(template);
    return tpl(data);
  }
  async create(
    rootDir: string,
    outputDir: string,
    filename: any,
    content: string | Buffer
  ) {
    await fsPromises.writeFile(join(rootDir, outputDir, filename), content);
  }
  async overwrite(
    rootDir: string,
    outputDir: string,
    filename: any,
    content: string | Buffer
  ) {
    await fsPromises.writeFile(join(rootDir, outputDir, filename), content);
  }

  async createOrOverwrite(
    rootDir: string,
    outputDir: string,
    filename: any,
    content: string | Buffer,
    // @todo allow to overwrite
    overwrite = false
  ) {
    filename = join(rootDir, outputDir, filename);
    // @todo allow to overwrite
    if (!overwrite) {
      content = this.setContent(filename, content);
    }
    // We need to create the directory if it doesn't exist
    await fsPromises.mkdir(dirname(filename), { recursive: true });
    await fsPromises.writeFile(filename, content);
  }
  setContent(filename: any, content: string | Buffer): string | Buffer {
    try {
      if (fs.existsSync(filename)) {
        // @todo: use AST to check if the content is the same
        // and update accordingly
      }
    } catch (error) {
      // contine silently
      // @todo: elaborate error handling
      console.log(filename, error.message);
    }
    return content;
  }

  async getFiles(rootDir: string, outputDir: string) {
    const files = await fsPromises.readdir(join(rootDir, outputDir));
    return files;
  }
}
