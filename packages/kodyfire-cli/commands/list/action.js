"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.action = exports.Action = void 0;
const kodyfire_core_1 = require("kodyfire-core");
const fs_1 = __importStar(require("fs"));
const path_1 = require("path");
const chalk = require('chalk');
const boxen = require('boxen');
const Table = require('cli-table');
const EventEmitter = require('events');
const ee = new EventEmitter();
const { glob } = require('glob');
class Action {
    static displayMessage(message) {
        console.log(boxen(message, {
            padding: 1,
            margin: 1,
            align: 'center',
            borderColor: 'yellow',
            borderStyle: 'round',
        }));
    }
    static displayKodies(kodies) {
        const table = new Table({
            head: ['id', 'name', 'type', 'version'],
            colWidths: [31, 31, 21, 10],
            style: {
                'padding-left': 1,
                'padding-right': 1,
                head: ['yellow'],
            },
        });
        kodies.forEach((template) => {
            table.push([template.id, template.name, template.type, template.version]);
        });
        console.log(table.toString());
    }
    static execute(args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // We check if package.json exists
                const kodies = yield Action.getInstalledKodies();
                // @todo: use event emitter to listen to the event of the runner
                ee.on('message', (text) => {
                    console.log(text);
                });
                if (kodies.length == 0) {
                    const kody = chalk.greenBright(chalk.bold('kody'));
                    const message = `😞 No ${kody} installed yet.\nInstall a ${kody} to become a Ninja 🚀🚀🚀`;
                    this.displayMessage(message);
                }
                else {
                    // if the technology is specified, we display all concepts of the technology
                    if (args.technology) {
                        const packageName = `${args.technology}-kodyfire`;
                        const { summary } = args;
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
                    }
                    else {
                        this.displayKodies(kodies);
                    }
                }
            }
            catch (error) {
                this.displayMessage(error.message);
            }
        });
    }
    static getInstalledKodies() {
        return __awaiter(this, void 0, void 0, function* () {
            return fs_1.default.existsSync('package.json')
                ? yield kodyfire_core_1.Package.getInstalledKodies()
                : [];
        });
    }
    static displayTemplates(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            const templates = yield this.getDependencyTemplates(packageName);
            const table = new Table({
                head: ['concept', 'templates'],
                colWidths: [31, 61],
                style: {
                    'padding-left': 1,
                    'padding-right': 1,
                    head: ['yellow'],
                },
            });
            templates.forEach((template) => {
                // add a description to the concept
                table.push([template.concept, template.options.join('\n')]);
            });
            console.log(table.toString());
        });
    }
    static displayOverwrites(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            const dependency = yield this.getDependencyConcepts(packageName);
            const concepts = dependency === null || dependency === void 0 ? void 0 : dependency.concepts;
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
        });
    }
    static displayConcepts(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            const dependency = yield this.getDependencyConcepts(packageName);
            const concepts = dependency === null || dependency === void 0 ? void 0 : dependency.concepts;
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
        });
    }
    static getDependencyConcepts(dependency, rootDir = process.cwd()) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const entries = {};
                // get the deb package schema file
                const kodyPath = (0, path_1.join)(rootDir, 'node_modules', dependency);
                if (!fs_1.default.existsSync((0, path_1.join)(rootDir, 'node_modules', dependency))) {
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
                const { schema } = yield (_a = kodyPath, Promise.resolve().then(() => __importStar(require(_a))));
                for (const prop of Object.keys(schema.properties)) {
                    const attributes = yield this.getConceptAttributes(schema.properties[prop]);
                    if (attributes) {
                        entries[prop] = attributes;
                    }
                }
                return { name: dependency, concepts: entries };
            }
            catch (error) {
                this.displayMessage(error.message);
            }
        });
    }
    static getDependencyTemplates(dependency, rootDir = process.cwd()) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // get the deb package schema file
                const kodyPath = (0, path_1.join)(rootDir, 'node_modules', dependency);
                if (!fs_1.default.existsSync((0, path_1.join)(rootDir, 'node_modules', dependency))) {
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
                let files = [];
                //for each source folder if it exists copy it to the target folder
                for (const source of sources) {
                    if ((0, fs_1.existsSync)(source)) {
                        const currentFiles = (yield glob(`${source}/*.template`)).map((file) => file.replace(source, ''));
                        files = [...new Set([...files, ...currentFiles])];
                    }
                }
                const assets = yield (_a = (0, path_1.join)(kodyPath, 'src', 'assets.json'), Promise.resolve().then(() => __importStar(require(_a))));
                const filteredTemplates = assets === null || assets === void 0 ? void 0 : assets.concepts.filter((concept) => concept.hasOwnProperty('template')).map((concept) => ({ concept: concept.name, options: files.filter((file) => {
                        const regexp = new RegExp(`^${concept.name}`, 'i');
                        return regexp.test(file);
                    }) }));
                return filteredTemplates;
            }
            catch (error) {
                this.displayMessage(error.message);
            }
        });
    }
    static getConceptAttributes(schema) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (Object.prototype.hasOwnProperty.call(schema, 'properties')) {
                    return schema.properties;
                }
                if (Object.prototype.hasOwnProperty.call(schema, 'items')) {
                    return yield this.getConceptAttributes(schema.items);
                }
            }
            catch (error) {
                this.displayMessage(error.message);
            }
            return false;
        });
    }
}
exports.Action = Action;
const action = (args) => __awaiter(void 0, void 0, void 0, function* () {
    yield Action.execute(args);
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
});
exports.action = action;
//# sourceMappingURL=action.js.map