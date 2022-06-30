import { strings } from '@angular-devkit/core';
import * as builder from 'handlebars';
import { join, relative, dirname } from 'path';
const fs = require('fs');
const fsPromises = fs.promises;
export class Engine {
    constructor() {
        this.builder = builder;
        this.registerPartials();
    }
    registerPartials() {
        this.builder.registerHelper('lowercase', (value) => {
            return value.toLowerCase();
        });
        this.builder.registerHelper('stringify', (value) => {
            return JSON.stringify(value);
        });
        this.builder.registerHelper('join', (value) => {
            return value.join(', ');
        });
        this.builder.registerHelper('ifEquals', function (arg1, arg2, options) {
            /* @ts-ignore */
            return arg1 == arg2 ? options.fn(this) : options.inverse(this);
        });
        this.builder.registerHelper('includes', function (arg1) {
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
        this.builder.registerHelper('equals', function (arg1, arg2) {
            /* @ts-ignore */
            return arg1 == arg2;
        });
        for (const key in strings) {
            this.builder.registerHelper(key, (value) => {
                /* @ts-ignore */
                return strings[key](value);
            });
        }
    }
    async read(path, templateName) {
        const template = await fsPromises.readFile(join(relative(process.cwd(), __dirname), path, templateName));
        return template?.toString();
    }
    async getPartial(path, template, data) {
        const tpl = await this.read(path, template);
        const compiled = await this.compile(tpl, data);
        return compiled;
    }
    compile(template, data) {
        const tpl = this.builder.compile(template);
        return tpl(data);
    }
    async create(rootDir, outputDir, filename, content) {
        await fsPromises.writeFile(join(rootDir, outputDir, filename), content);
    }
    async overwrite(rootDir, outputDir, filename, content) {
        await fsPromises.writeFile(join(rootDir, outputDir, filename), content);
    }
    async createOrOverwrite(rootDir, outputDir, filename, content, 
    // @todo allow to overwrite
    overwrite = false) {
        filename = join(rootDir, outputDir, filename);
        // @todo allow to overwrite
        if (!overwrite) {
            content = this.setContent(filename, content);
        }
        // We need to create the directory if it doesn't exist
        await fsPromises.mkdir(dirname(filename), { recursive: true });
        await fsPromises.writeFile(filename, content);
    }
    setContent(filename, content) {
        try {
            if (fs.existsSync(filename)) {
                // @todo: use AST to check if the content is the same
                // and update accordingly
            }
        }
        catch (error) {
            // contine silently
            // @todo: elaborate error handling
            console.log(filename, error.message);
        }
        return content;
    }
    async getFiles(rootDir, outputDir) {
        const files = await fsPromises.readdir(join(rootDir, outputDir));
        return files;
    }
}
//# sourceMappingURL=engine.js.map