import { strings } from '@angular-devkit/core';
import * as builder from 'handlebars';
import { join, relative, dirname } from 'path';
const fs = require('fs');
const fsPromises = fs.promises;
// Load the writer
// const writer = require('php-writer');
const parser = require('php-parser');
const unparse = require('php-unparser');

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
    overwrite = false
  ) {
    filename = join(rootDir, outputDir, filename);
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
        const oldContent = fs.readFileSync(filename);

        const oldMethods = this.getAstMethods(oldContent);
        const newMethods = this.getAstMethods(content);
        const options = {
          indent: true,
          dontUseWhitespaces: false,
          shortArray: true,
          bracketsNewLine: true,
          forceNamespaceBrackets: false,
          collapseEmptyLines: true,
        };

        const ast = this.getAst(content);
        const updatedMethods = [];
        for (let i = 0; i < newMethods.length; i++) {
          const newMethod = newMethods[i];
          if (!newMethod.name) {
            continue;
          }
          const oldMethod = oldMethods.find((m: any) => {
            if (m.name === newMethod.name) {
              return true;
            }
          });
          if (oldMethod) {
            updatedMethods.push(oldMethod);
          }
        }

        for (let i = 0; i < oldMethods.length; i++) {
          const oldMethod = oldMethods[i];
          if (!oldMethod.name) {
            continue;
          }
          const foundMethod = newMethods.find((m: any) => {
            if (m.name && m.name === oldMethod.name) {
              return true;
            }
          });
          if (!foundMethod) {
            updatedMethods.push(oldMethod);
          }
        }

        const astClassIndex = ast.children[0].children?.findIndex(
          (c: { kind: string }) => c.kind === 'class'
        );
        if (astClassIndex) {
          ast.children[0].children[astClassIndex].body = updatedMethods;
        }

        return unparse(ast, options);
      }
    } catch (error) {
      // contine silently
      // @todo: elaborate error handling
      console.log(filename, error.message);
    }
    return content;
  }

  private getAstMethods(content: any) {
    const ast = this.getAst(content);
    const _class = this.getAstClass(ast);
    if (_class) {
      return (
        _class.body.filter((c: { kind: string }) => c.kind === 'method') || []
      );
    }
    return [];
  }

  private getAstClass(ast: any) {
    return ast.children[0].children?.find(
      (c: { kind: string }) => c.kind === 'class'
    );
  }

  private getAst(content: any) {
    const phpParser = this.getPhpParser();
    const ast = phpParser.parseCode(content);
    return ast;
  }

  private getPhpParser() {
    return new parser({
      writer: {
        indent: true,
        dontUseWhitespaces: false,
        shortArray: true,
        forceNamespaceBrackets: false,
      },
      parser: {
        debug: false,
        locations: false,
        extractDoc: false,
        suppressErrors: false,
      },
      lexer: {
        all_tokens: false,
        comment_tokens: false,
        mode_eval: false,
        asp_tags: false,
        short_tags: false,
      },
      ast: {
        withPositions: true,
      },
    });
  }

  async getFiles(rootDir: string, outputDir: string) {
    const files = await fsPromises.readdir(join(rootDir, outputDir));
    return files;
  }
}
