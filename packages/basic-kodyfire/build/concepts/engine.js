"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
const core_1 = require("@angular-devkit/core");
const builder = __importStar(require("handlebars"));
const path_1 = require("path");
const fs = require('fs');
const fsPromises = fs.promises;
class Engine {
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
        for (const key in core_1.strings) {
            this.builder.registerHelper(key, (value) => {
                /* @ts-ignore */
                return core_1.strings[key](value);
            });
        }
    }
    async read(path, templateName) {
        const template = await fsPromises.readFile((0, path_1.join)((0, path_1.relative)(process.cwd(), __dirname), path, templateName));
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
        await fsPromises.writeFile((0, path_1.join)(rootDir, outputDir, filename), content);
    }
    async overwrite(rootDir, outputDir, filename, content) {
        await fsPromises.writeFile((0, path_1.join)(rootDir, outputDir, filename), content);
    }
    async createOrOverwrite(rootDir, outputDir, filename, content, 
    // @todo allow to overwrite
    overwrite = false) {
        filename = (0, path_1.join)(rootDir, outputDir, filename);
        // @todo allow to overwrite
        if (!overwrite) {
            content = this.setContent(filename, content);
        }
        // We need to create the directory if it doesn't exist
        await fsPromises.mkdir((0, path_1.dirname)(filename), { recursive: true });
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
        const files = await fsPromises.readdir((0, path_1.join)(rootDir, outputDir));
        return files;
    }
}
exports.Engine = Engine;
//# sourceMappingURL=engine.js.map