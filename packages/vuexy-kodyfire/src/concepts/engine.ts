import { strings } from '@angular-devkit/core';
import * as builder from 'handlebars';
import { join, relative, dirname } from 'path';
const fs = require('fs');
const delimiters = require('handlebars-delimiters');
const pluralize = require('pluralize');
const fsPromises = fs.promises;
export class Engine {
  builder: any;
  constructor() {
    delimiters(builder, ['<%=', '%>']);
    this.builder = builder;
    this.registerPartials();
  }
  registerPartials() {
    this.builder.registerHelper('lowercase', (value: any) => {
      return value.toLowerCase();
    });
    this.builder.registerHelper('uppercase', (value: any) => {
      return value.toUpperCase();
    });
    this.builder.registerHelper('pluralize', (value: any) => {
      return pluralize(value);
    });
    this.builder.registerHelper('stringify', (value: any) => {
      return JSON.stringify(value);
    });
    this.builder.registerHelper('isEmpty', (value: any) => {
      console.log(value);
      console.log(typeof value);
      return typeof value == 'undefined' || value.length == 0;
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
    for (const key in strings) {
      this.builder.registerHelper(key, (value: any) => {
        /* @ts-ignore */
        return strings[key](value);
      });
    }
  }
  async read(path: string, templateName: any) {
    const template = await fsPromises.readFile(
      join(relative(process.cwd(), __dirname), path, templateName)
    );
    return template?.toString();
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
    content: string | Buffer
  ) {
    filename = join(rootDir, outputDir, filename);
    // We need to create the directory if it doesn't exist
    await fsPromises.mkdir(dirname(filename), { recursive: true });
    await fsPromises.writeFile(filename, content);
  }
}
