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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
const core_1 = require("@angular-devkit/core");
const builder = __importStar(require("handlebars"));
const path_1 = require("path");
const fs = require('fs');
const fsPromises = fs.promises;
// Load the writer
// const writer = require('php-writer');
const parser = require('php-parser');
const unparse = require('php-unparser');
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
    read(path, templateName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (fs.existsSync((0, path_1.join)(path, templateName))) {
                const template = yield fsPromises.readFile((0, path_1.join)(path, templateName));
                return template === null || template === void 0 ? void 0 : template.toString();
            }
            const template = yield fsPromises.readFile((0, path_1.join)((0, path_1.relative)(process.cwd(), __dirname), path, templateName));
            return template === null || template === void 0 ? void 0 : template.toString();
        });
    }
    getPartial(path, template, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const tpl = yield this.read(path, template);
            const compiled = yield this.compile(tpl, data);
            return compiled;
        });
    }
    compile(template, data) {
        const tpl = this.builder.compile(template);
        return tpl(data);
    }
    create(rootDir, outputDir, filename, content) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fsPromises.writeFile((0, path_1.join)(rootDir, outputDir, filename), content);
        });
    }
    overwrite(rootDir, outputDir, filename, content) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fsPromises.writeFile((0, path_1.join)(rootDir, outputDir, filename), content);
        });
    }
    createOrOverwrite(rootDir, outputDir, filename, content, overwrite = false) {
        return __awaiter(this, void 0, void 0, function* () {
            filename = (0, path_1.join)(rootDir, outputDir, filename);
            // @todo allow to overwrite
            if (!overwrite) {
                content = this.setContent(filename, content);
            }
            // We need to create the directory if it doesn't exist
            yield fsPromises.mkdir((0, path_1.dirname)(filename), { recursive: true });
            yield fsPromises.writeFile(filename, content);
        });
    }
    setContent(filename, content) {
        var _a;
        try {
            // @todo we'll use AST in the future
            // eslint-disable-next-line no-constant-condition
            if (fs.existsSync(filename) && false) {
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
                    const oldMethod = oldMethods.find((m) => {
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
                    const foundMethod = newMethods.find((m) => {
                        if (m.name && m.name === oldMethod.name) {
                            return true;
                        }
                    });
                    if (!foundMethod) {
                        updatedMethods.push(oldMethod);
                    }
                }
                const astClassIndex = (_a = ast.children[0].children) === null || _a === void 0 ? void 0 : _a.findIndex((c) => c.kind === 'class');
                if (astClassIndex) {
                    ast.children[0].children[astClassIndex].body = updatedMethods;
                }
                return unparse(ast, options);
            }
        }
        catch (error) {
            // contine silently
            // @todo: elaborate error handling
            console.log(filename, error.message);
        }
        return content;
    }
    getAstMethods(content) {
        const ast = this.getAst(content);
        const _class = this.getAstClass(ast);
        if (_class) {
            return (_class.body.filter((c) => c.kind === 'method') || []);
        }
        return [];
    }
    getAstClass(ast) {
        var _a;
        return (_a = ast.children[0].children) === null || _a === void 0 ? void 0 : _a.find((c) => c.kind === 'class');
    }
    getAst(content) {
        const phpParser = this.getPhpParser();
        const ast = phpParser.parseCode(content);
        return ast;
    }
    getPhpParser() {
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
    getFiles(rootDir, outputDir) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield fsPromises.readdir((0, path_1.join)(rootDir, outputDir));
            return files;
        });
    }
}
exports.Engine = Engine;
//# sourceMappingURL=engine.js.map