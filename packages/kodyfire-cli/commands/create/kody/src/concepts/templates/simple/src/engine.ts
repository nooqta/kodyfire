import { join, relative, dirname } from 'path';
import { Engine as BaseEngine } from 'basic-kodyfire';
const fs = require('fs');
const fsPromises = fs.promises;

// Wrap your builder in a class that implements the IBuilder interface
import * as builder from 'handlebars';

export class Engine extends BaseEngine {
  builder: any;
  constructor() {
    super();
    this.builder = builder;
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
    // we check the folder exists
    const dir = join(rootDir, outputDir);
    if (!fs.existsSync(dir)) {
      return [];
    }
    const files = await fsPromises.readdir(join(rootDir, outputDir));
    return files;
  }
}
