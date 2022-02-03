import { strings } from "@angular-devkit/core";
import * as builder from "handlebars";
import { join, relative } from "path";
const fs = require('fs');
const fsPromises = fs.promises;
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
        this.builder.registerHelper('ifEquals', function(arg1: any, arg2: any, options: { fn: (arg0: any) => any; inverse: (arg0: any) => any; }) {
            /* @ts-ignore */
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        });
        for (const key in strings) {
            this.builder.registerHelper(key, (value: any) => {
                /* @ts-ignore */
                return strings[key](value)
            });
        }
    }
    async read(path: string, templateName: any) {
        const template = await fsPromises.readFile(
            join(
              relative(process.cwd(), __dirname),
              path,
              templateName
            )
          );
          return template?.toString();
    }
    
    compile(template: any, data: any) {
        let tpl = this.builder.compile(template);
        return tpl(data);
    }
    async create(rootDir: string, outputDir: string, filename: any, content: string | Buffer) {
        await fsPromises.writeFile(
            join(
              rootDir,
              outputDir,
              filename
            ),
            content
          );
    }
    async overwrite(rootDir: string, outputDir: string, filename: any, content: string | Buffer) {
        await fsPromises.writeFile(
            join(
              rootDir,
              outputDir,
              filename
            ),
            content
          );
    }

    createOrOverwrite(rootDir: string, outputDir: string, filename: any, content: string | Buffer) {
        fsPromises.writeFile(
                join(
                  rootDir,
                  outputDir,
                  filename
                ),
                content
            );
    }
}