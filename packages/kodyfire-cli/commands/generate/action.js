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
exports.Action = void 0;
// import { $ } from "zx";
const kodyfire_core_1 = require("kodyfire-core");
const path_1 = require("path");
const zx_1 = require("zx");
const action_1 = require("../init/action");
const prompts = require('prompts');
const boxen = require('boxen');
const dotenv = require('envfile');
class Action {
    static onCancel(_prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            Action.isCanceled = true;
            process.exit(1);
            return true;
        });
    }
    static getDependencyConcepts(dependency) {
        return __awaiter(this, void 0, void 0, function* () {
            const dep = yield action_1.Action.getDependencyConcepts(dependency);
            return dep === null || dep === void 0 ? void 0 : dep.concepts;
        });
    }
    // @todo: refactor into a Base Action class. used by init/action.ts
    static getPackageDependencies(rootDir = process.cwd()) {
        return __awaiter(this, void 0, void 0, function* () {
            const packageJsonFile = yield zx_1.fs.readFile((0, path_1.join)(rootDir, 'package.json'), 'utf8');
            const packageJson = JSON.parse(packageJsonFile);
            const name = packageJson.name;
            let dependencies = [];
            if (packageJson.dependencies &&
                Object.keys(packageJson.dependencies).length > 0) {
                dependencies = Object.keys(packageJson.dependencies);
            }
            if (packageJson.devDependencies &&
                Object.keys(packageJson.devDependencies).length > 0) {
                dependencies = dependencies.concat(Object.keys(packageJson.devDependencies));
            }
            dependencies = dependencies.filter(dep => dep.includes('-kodyfire'));
            return { name, dependencies };
        });
    }
    static prompter(_args) {
        return __awaiter(this, void 0, void 0, function* () {
            let { addMore } = _args;
            const { persist, kody: kodyName, concept: conceptName } = _args;
            (() => __awaiter(this, void 0, void 0, function* () {
                do {
                    if (kodyName)
                        this.kody = `${kodyName}-kodyfire`;
                    if (!this.kody) {
                        const kodyQuestion = yield this.getKodyQuestion();
                        if (!kodyQuestion) {
                            this.displayMessage('No kodies installed. Please install at least a kody package first.');
                            process.exit(1);
                        }
                        const { kody } = yield prompts(kodyQuestion, {
                            onCancel: Action.onCancel,
                        });
                        this.kody = kody;
                    }
                    if (conceptName)
                        this.concept = conceptName;
                    let currentConcept = yield this.getCurrentConcept();
                    if (!this.concept || !currentConcept) {
                        // set concept
                        yield Action.setConcept();
                        currentConcept = yield this.getCurrentConcept();
                    }
                    if (!this.properties) {
                        // set properties
                        const answers = yield this.getPropertiesAnswers(currentConcept);
                        if (answers) {
                            // @todo validate answers
                            yield this.generateConcept(this.kody, this.concept, answers);
                            // if persist is true we save the data
                            if (persist) {
                                yield this.addConcept(this.kody, this.concept, answers);
                            }
                        }
                        if (addMore) {
                            const question = {
                                type: 'confirm',
                                name: 'value',
                                message: `Would you like to add more?`,
                                initial: true,
                            };
                            const { value } = yield prompts(question, {
                                onCancel: Action.onCancel,
                            });
                            if (!value) {
                                addMore = false;
                            }
                        }
                        this.concept = null;
                    }
                } while (addMore);
            }))();
        });
    }
    static setConcept() {
        return __awaiter(this, void 0, void 0, function* () {
            const conceptQuestion = yield this.getConceptQuestion();
            if (!conceptQuestion) {
                this.displayMessage(`No concept specified. Please provide a concept to proceed. \`kody g ${this.kody.replace('-kodyfire', '')} <your-concept>\`. \n to see available concepts, run \`kody ls ${this.kody.replace('-kodyfire', '')}\``);
                process.exit(1);
            }
            const { concept } = yield prompts(conceptQuestion, {
                onCancel: Action.onCancel,
            });
            this.concept = concept;
        });
    }
    static getCurrentConcept() {
        return __awaiter(this, void 0, void 0, function* () {
            const concepts = yield this.getDependencyConcepts(this.kody);
            return concepts[this.concept];
        });
    }
    static getPropertiesAnswers(concept) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const schemaDefinition = this.getSchemaDefinition(this.kody);
            const conceptNames = Object.keys(concept || {});
            if (conceptNames.length == 0) {
                return [];
            }
            const answers = {};
            for (let i = 0; i < conceptNames.length; i++) {
                const currentConcept = concept[conceptNames[i]];
                if (currentConcept.type !== 'array' &&
                    ((_a = currentConcept.items) === null || _a === void 0 ? void 0 : _a.type) !== 'object') {
                    const question = yield this.conceptToQuestion(conceptNames[i], concept[conceptNames[i]], schemaDefinition, false, false, `${conceptNames[i]}`, true);
                    if (typeof question.value != 'undefined') {
                        answers[conceptNames[i]] = question.value;
                    }
                    else if (question) {
                        const answer = yield prompts(question, { onCancel: Action.onCancel });
                        answers[conceptNames[i]] = answer.value;
                    }
                }
                if (currentConcept.type === 'array'
                // && currentConcept.items?.type === 'object'
                ) {
                    const question = {
                        type: 'confirm',
                        name: 'value',
                        message: `Would you like to add ${conceptNames[i]}?`,
                        initial: true,
                    };
                    const { value } = yield prompts(question);
                    if (value) {
                        let addMore = true;
                        while (addMore) {
                            let childConcept;
                            if (((_b = currentConcept.items) === null || _b === void 0 ? void 0 : _b.type) !== 'string') {
                                childConcept = yield this.getPropertiesAnswers(currentConcept.items.properties);
                            }
                            else {
                                const conceptQuestion = yield this.conceptToQuestion(conceptNames[i], currentConcept.items);
                                const currentAnswer = yield prompts(conceptQuestion, {
                                    onCancel: Action.onCancel,
                                });
                                childConcept = currentAnswer[conceptNames[i]];
                            }
                            if (answers[conceptNames[i]]) {
                                answers[conceptNames[i]].push(childConcept);
                            }
                            else {
                                answers[conceptNames[i]] = [childConcept];
                            }
                            const question = {
                                type: 'confirm',
                                name: 'value',
                                message: `Would you like to add more ${conceptNames[i]}?`,
                                initial: true,
                            };
                            const { value } = yield prompts(question);
                            if (!value) {
                                addMore = false;
                            }
                        }
                    }
                }
            }
            return answers;
        });
    }
    static getConceptQuestion() {
        return __awaiter(this, void 0, void 0, function* () {
            const concepts = yield this.getDependencyConcepts(this.kody);
            const conceptNames = Object.keys(concepts || {});
            if (conceptNames.length == 0) {
                return false;
            }
            const question = {
                type: conceptNames.length < 4 ? 'select' : 'autocomplete',
                name: 'concept',
                message: `Select the concept you want to add?`,
                choices: conceptNames.map((concept) => ({
                    title: (0, kodyfire_core_1.capitalize)(concept),
                    value: concept,
                })),
            };
            return question;
        });
    }
    static getKodyQuestion() {
        return __awaiter(this, void 0, void 0, function* () {
            const { dependencies } = yield this.getPackageDependencies();
            if (dependencies.length == 0) {
                return false;
            }
            const question = {
                type: 'select',
                name: 'kody',
                message: `Select the kody package?`,
                choices: dependencies.map((dep) => ({
                    title: (0, kodyfire_core_1.capitalize)(dep.replace('-kodyfire', '')),
                    value: dep,
                })),
            };
            return question;
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
    static execute(args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                args.addMore = args.multiple || false;
                args.persist = args.persist || false;
                yield this.prompter(args);
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
    static addConcept(dependency, concept, data, rootDir = process.cwd()) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let content = this.getSchemaDefinition(dependency, rootDir);
                if (!content) {
                    content = yield action_1.Action.getEntries(rootDir, dependency);
                }
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
    static readEnvFile(rootDir = process.cwd()) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const envFile = (0, path_1.join)(rootDir, '.env');
                if (zx_1.fs.existsSync(envFile)) {
                    const envContent = zx_1.fs.readFileSync(envFile, 'utf8');
                    const env = dotenv.parse(envContent);
                    return env;
                }
            }
            catch (error) {
                this.displayMessage(error.message);
            }
            return false;
        });
    }
    static createEnvFile(rootDir = process.cwd()) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const envFile = (0, path_1.join)(rootDir, '.env');
                if (!zx_1.fs.existsSync(envFile)) {
                    zx_1.fs.writeFileSync(envFile, '');
                }
            }
            catch (error) {
                this.displayMessage(error.message);
            }
        });
    }
    static addEnvVariable(key, value, rootDir = process.cwd()) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const envFile = (0, path_1.join)(rootDir, '.env');
                if (!zx_1.fs.existsSync(envFile)) {
                    yield Action.createEnvFile(rootDir);
                }
                const envContent = zx_1.fs.readFileSync(envFile, 'utf8');
                const env = dotenv.parse(envContent);
                env[key] = value;
                const newEnvContent = Object.keys(env)
                    .map((key) => `${key}=${env[key]}`)
                    .join('\n');
                zx_1.fs.writeFileSync(envFile, newEnvContent);
            }
            catch (error) {
                this.displayMessage(error.message);
            }
        });
    }
    static getEnvVariable(key, rootDir = process.cwd()) {
        try {
            const envFile = (0, path_1.join)(rootDir, '.env');
            if (zx_1.fs.existsSync(envFile)) {
                const envContent = zx_1.fs.readFileSync(envFile, 'utf8');
                const env = dotenv.parse(envContent);
                return env[key];
            }
        }
        catch (error) {
            this.displayMessage(error.message);
        }
        return false;
    }
    static generateConcept(dependency, concept, data, rootDir = process.cwd()) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let path, currentKody;
                const kodyName = dependency.replace('-kodyfire', '');
                let content = yield this.getSchemaDefinition(dependency, rootDir);
                if (!content) {
                    content = yield this.getDependencyConcepts(this.kody);
                    Object.keys(content).forEach(key => {
                        content[key] = [];
                    });
                }
                content[concept] = [data];
                const rootDirEnvVar = this.getEnvVariable(`${kodyName.toUpperCase()}_ROOT_DIR`);
                if (rootDirEnvVar) {
                    content.rootDir = rootDirEnvVar;
                }
                else {
                    // Ask if the user want to overwrite rootDir
                    const question = {
                        type: 'autocomplete',
                        name: 'value',
                        description: 'Enter the root directory',
                        message: `What is the root directory?`,
                        initial: rootDir,
                        choices: [{ title: rootDir }],
                    };
                    const { value } = yield prompts(question, {
                        onCancel: Action.onCancel,
                    });
                    Action.addEnvVariable(`${kodyName.toUpperCase()}_ROOT_DIR`, value);
                    content.rootDir = value;
                }
                if (zx_1.fs.existsSync((0, path_1.join)(process.cwd(), 'node_modules', dependency))) {
                    path = (0, path_1.join)(process.cwd(), 'node_modules', dependency);
                    const packages = yield kodyfire_core_1.Package.getInstalledKodies();
                    currentKody = packages.find((kody) => kody.id === kodyName);
                }
                else {
                    this.displayMessage(`${dependency} does not exist. Install it first.`);
                    process.exit(1);
                    // @todo: try a globally installed kody
                    path = (0, path_1.join)(action_1.Action.getNpmGlobalPrefix(), 'lib', 'node_modules', dependency);
                    currentKody = { id: kodyName };
                }
                const m = yield Promise.resolve().then(() => __importStar(require(path)));
                const kody = new m.Kody(currentKody);
                // generate artifacts | execute actions
                // @ts-ignore
                const output = kody.generate(content);
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
    static getSchemaDefinition(dependency, rootDir = process.cwd()) {
        const path = (0, path_1.join)(rootDir, `kody-${dependency.replace('-kodyfire', '')}.json`);
        if (!zx_1.fs.existsSync(path)) {
            return false;
        }
        return JSON.parse(zx_1.fs.readFileSync(path, 'utf8'));
    }
    static conceptToQuestion(name, concept, _concepts = {}, message = false, _useIndex = false, label = '', useValueAsName = false) {
        return __awaiter(this, void 0, void 0, function* () {
            message = concept.description || message;
            label = label || name;
            if (typeof concept.enum !== 'undefined') {
                if (concept.enum.length == 1)
                    return { value: concept.enum[0] }; // if only one option, return it as default answer
                const choices = concept.enum.map((c) => ({ title: c, value: c }));
                return Object.assign(Object.assign({ type: choices.length < 5 ? 'select' : 'autocomplete', name: useValueAsName ? 'value' : name, message: message || `Select the value for ${label}?` }, (concept.description && { description: concept.description })), { choices: choices });
            }
            if (concept.type === 'boolean') {
                return Object.assign(Object.assign(Object.assign(Object.assign({ type: 'toggle', name: useValueAsName ? 'value' : name }, (concept.default && { initial: concept.default })), { initial: concept.default }), (concept.description && { description: concept.description })), { message: message || `What is the value for ${label}?`, active: 'Yes', inactive: 'No' });
            }
            if (concept.type === 'string') {
                return Object.assign(Object.assign(Object.assign({ type: 'text', name: useValueAsName ? 'value' : name }, (concept.default && { initial: concept.default })), (concept.description && { description: concept.description })), { message: message || `What is the value for ${label}?` });
            }
            if (concept.type === 'number') {
                return Object.assign(Object.assign(Object.assign({ type: 'number', name: useValueAsName ? 'value' : name }, (concept.default && { initial: concept.default })), (concept.description && { description: concept.description })), { message: message || `What is the value for ${label}?` });
            }
            if (concept.type === 'array') {
                if (concept.items.type == 'string') {
                    return Object.assign(Object.assign({ type: 'text', name: useValueAsName ? 'value' : name }, (concept.description && { description: concept.description })), { message: message || `What is the value for ${label}?` });
                }
            }
            if (concept.type === 'boolean') {
                return Object.assign(Object.assign(Object.assign(Object.assign({ type: 'select', name: useValueAsName ? 'value' : name }, (concept.description && { description: concept.description })), { message: message || `What is the value for ${label}?` }), (concept.default && { initial: concept.default })), { choices: [
                        { title: 'true', value: true },
                        { title: 'false', value: false },
                    ] });
            }
            return false;
        });
    }
}
exports.Action = Action;
Action.isCanceled = false;
//# sourceMappingURL=action.js.map