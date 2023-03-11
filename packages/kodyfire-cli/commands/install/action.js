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
exports.Action = void 0;
// import { $ } from "zx";
const kodyfire_core_1 = require("kodyfire-core");
const path_1 = require("path");
const zx_1 = require("zx");
const prompts = require('prompts');
// import { $ } from 'zx';
const boxen = require('boxen');
// const { spawn } = require('child_process');
const kodies = () => __awaiter(void 0, void 0, void 0, function* () {
    const kodies = JSON.parse((yield (0, zx_1.$) `npm search kodyfire -j -l`).toString());
    return kodies.filter((kody) => kody.name.includes('-kodyfire'));
});
class Action {
    static prompter(kody) {
        return __awaiter(this, void 0, void 0, function* () {
            let path = './';
            const choices = yield kodies();
            const questions = [
                {
                    type: 'autocomplete',
                    name: 'kody',
                    message: `Which kody do want to install?`,
                    choices: choices.map((project) => ({
                        title: project.name,
                        value: project.name,
                    })),
                },
                {
                    type: 'text',
                    name: 'path',
                    message: `Where do you want to save the kody?`,
                    initial: './',
                },
            ];
            if (kody) {
                // we check if the kody exists within the kodies list
                const kodyExists = choices.find((choice) => choice.name.includes(kody));
                if (!kodyExists) {
                    this.displayMessage(`😞 No kody found with the name ${kody}.`);
                    return;
                }
                kody = kodyExists.name;
            }
            else {
                const response = yield prompts(questions);
                kody = response.kody;
                path = response.path;
                // create project
                if (!kody || !path) {
                    this.displayMessage('Missing required fields');
                    return;
                }
            }
            yield this.runCommand(kody, path);
        });
    }
    static runCommand(kody, path = './') {
        return __awaiter(this, void 0, void 0, function* () {
            const dest = (0, path_1.join)(process.cwd(), path);
            if (!zx_1.fs.existsSync(dest)) {
                zx_1.fs.mkdirSync(dest);
            }
            // @todo: upgrade to latest zx
            (0, zx_1.cd)(dest);
            zx_1.$.verbose = true;
            (0, zx_1.$) `npm i ${kody}`;
            // or spawn for zx version < 6.0.0
            // await spawn(project.command, project.args, { stdio: 'inherit' });
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
    static execute(kody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prompter(kody);
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