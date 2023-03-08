"use strict";
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
exports.Action = exports.questions = void 0;
// import { $ } from "zx";
const kodyfire_core_1 = require("kodyfire-core");
const path_1 = require("path");
const zx_1 = require("zx");
const prompts = require('prompts');
// import { $ } from 'zx';
const boxen = require('boxen');
const { spawn } = require('child_process');
// @todo retrieve from a repository (remote|local)? to centralize all types of projects
const projects = [
    {
        name: 'laravel',
        family: 'laravel',
        language: 'php',
        description: 'A Backend using Laravel (php)',
        command: 'composer',
        args: ['create-project', 'laravel/laravel'],
        requires: ['composer'],
    },
    {
        name: 'vue-cli',
        family: 'vue',
        description: 'A frontend using Vuexy (vue)',
        command: 'vue',
        args: ['create'],
        requires: ['vue'],
    },
    {
        name: 'express',
        family: 'node',
        description: 'A backend using Express (node)',
        command: 'npx',
        args: ['express-generator'],
        requires: ['npx'],
    },
    {
        name: 'react',
        family: 'react',
        description: 'A frontend using React (react)',
        command: 'npx',
        args: ['create-react-app'],
        requires: ['npx'],
    },
    {
        name: 'next-ts',
        family: 'next',
        description: 'A frontend using Next and Typescript (next)',
        command: 'npx',
        args: ['create-next-app@latest', '--template typescript'],
        requires: ['npx'],
    },
    {
        name: 'next-js',
        family: 'next',
        description: 'A frontend using Next (next)',
        command: 'npx create-next-app@latest',
        args: ['create-next-app@latest'],
        requires: ['npx'],
    },
    {
        name: 'flutter',
        family: 'flutter',
        description: 'A mobile app using Flutter (flutter)',
        command: 'flutter',
        args: ['create'],
        requires: ['flutter'],
    },
    {
        name: 'angular',
        family: 'angular',
        description: 'A frontend using Angular (angular)',
        command: 'npx',
        args: ['ng', 'new'],
        requires: ['npx'],
    },
];
exports.questions = [
    {
        type: 'text',
        name: 'name',
        message: 'What is the name of your project?',
    },
    {
        type: 'select',
        name: 'technology',
        message: `What are you building today?`,
        choices: projects.map(project => ({
            title: project.description,
            value: project.name,
        })),
    },
    {
        type: 'text',
        name: 'path',
        message: `Where do you want to save your project?`,
        initial: './',
    },
];
class Action {
    static prompter() {
        return __awaiter(this, void 0, void 0, function* () {
            // get user choices
            (() => __awaiter(this, void 0, void 0, function* () {
                const response = yield prompts(exports.questions);
                const { name, technology, path } = response;
                // create project
                if (!technology || !name) {
                    this.displayMessage('Missing required fields');
                    return;
                }
                const project = projects.find(project => project.name === technology);
                if (!project) {
                    this.displayMessage(`Project ${technology} not found`);
                    return;
                }
                yield this.runCommand(project, name, path);
            }))();
        });
    }
    static runCommand(project, name = null, path = './') {
        return __awaiter(this, void 0, void 0, function* () {
            if (name) {
                project.args = [...project.args, name];
            }
            const dest = (0, path_1.join)(process.cwd(), path);
            if (!zx_1.fs.existsSync(dest)) {
                zx_1.fs.mkdirSync(dest);
            }
            // @todo: upgrade to latest zx
            // await $`${project.command} ${project.args} ${name}`;
            // or spawn for zx version < 6.0.0
            (0, zx_1.cd)(dest);
            yield spawn(project.command, project.args, { stdio: 'inherit' });
        });
    }
    static displayMessage(message) {
        console.log(boxen(message, {
            padding: 1,
            margin: 1,
            align: 'center',
            borderColor: 'yellow',
            borderStyle: 'round',
        }));
    }
    static execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prompter();
            }
            catch (error) {
                this.displayMessage(error.message);
            }
        });
    }
    static addConcept(dependency, concept, data, rootDir = process.cwd()) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let content = this.getSchemaDefinition(dependency, rootDir);
                if (content[concept]) {
                    content[concept] = [...content[concept], data];
                }
                else {
                    content[concept] = [data];
                }
                content = JSON.stringify(content, null, '\t');
                zx_1.fs.writeFileSync((0, path_1.join)(rootDir, `kody-${dependency.replace('-kodyfire', '')}.json`), content);
            }
            catch (error) {
                this.displayMessage(error.message);
            }
        });
    }
    static addConceptProperty(dependency, concept, property, data, rootDir = process.cwd()) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let content = this.getSchemaDefinition(dependency, rootDir);
                const currentConcept = data['concept'];
                // tweak the data for array for now
                delete data['concept'];
                data = data[property] ? data[property] : data;
                if (typeof content[concept][currentConcept][property] !== 'undefined') {
                    content[concept][currentConcept][property] = [
                        ...content[concept][currentConcept][property],
                        data,
                    ];
                }
                else {
                    content[concept][currentConcept][property] = [data];
                }
                content = JSON.stringify(content, null, '\t');
                zx_1.fs.writeFileSync((0, path_1.join)(rootDir, `kody-${dependency.replace('-kodyfire', '')}.json`), content);
            }
            catch (error) {
                this.displayMessage(error.message);
            }
        });
    }
    static getSchemaDefinition(dependency, rootDir) {
        return JSON.parse(zx_1.fs.readFileSync((0, path_1.join)(rootDir, `kody-${dependency.replace('-kodyfire', '')}.json`), 'utf8'));
    }
    static conceptToQuestion(name, concept, concepts = {}, message = false, useIndex = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (concepts[name] && typeof concepts[name] != 'string') {
                const choices = concepts[name].map((c, index) => ({
                    title: c.name || `${(0, kodyfire_core_1.capitalize)(name)} ${index}`,
                    value: useIndex ? index : c.name,
                }));
                return {
                    type: 'select',
                    name: name,
                    message: message || `Select the value for ${name}?`,
                    choices: choices,
                };
            }
            if (typeof concept.enum !== 'undefined') {
                return {
                    type: 'select',
                    name: name,
                    message: message || `Select the value for ${name}?`,
                    choices: concept.enum.map((c) => ({ title: c, value: c })),
                };
            }
            if (concept.type === 'string') {
                return {
                    type: 'text',
                    name: name,
                    message: message || `What is the value for ${name}?`,
                };
            }
            if (concept.type === 'array') {
                return {
                    type: 'array',
                    name: name,
                    message: message || `What is the value for ${name}?`,
                };
            }
        });
    }
}
exports.Action = Action;
//# sourceMappingURL=action.js.map