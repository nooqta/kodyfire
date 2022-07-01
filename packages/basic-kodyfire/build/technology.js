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
exports.Technology = void 0;
const kodyfire_core_1 = require("kodyfire-core");
const assets = __importStar(require("./assets.json"));
/* @ts-ignore */
const classes = __importStar(require("."));
const path_1 = require("path");
const fs = require('fs');
class Technology {
    constructor(params) {
        try {
            this.id = params.id;
            this.name = params.name;
            this.version = params.version;
            this.actions = new kodyfire_core_1.ActionList();
            this.concepts = new Map();
            this.rootDir = assets.rootDir;
            this.assets = assets;
            this.params = params;
            if (params.templatesPath) {
                // user requested to use custom templates. We need to set the path to the templates
                const templatesPath = (0, path_1.join)(process.cwd(), '.kody', params.name);
                // we check if the path exists
                if (!fs.existsSync(templatesPath)) {
                    throw new Error(`The path ${templatesPath} does not exist.\nRun the command "kodyfire publish ${params.name}" to publish the templates.`);
                }
                params.templatesPath = (0, path_1.join)(process.cwd(), '.kody', params.name);
            }
            // add dynamic property for technology
            for (const concept of this.assets.concepts) {
                this.concepts.set(concept.name, new classes[(0, kodyfire_core_1.capitalize)(concept.name)](concept, this));
            }
        }
        catch (error) {
            console.log(error, 'error');
        }
    }
    //@todo: refactor. exists in kodyfire-core technology.ts
    prepareConcept(dependency, conceptName, preparedConcept) {
        return __awaiter(this, void 0, void 0, function* () {
            const { schema } = yield Promise.resolve().then(() => __importStar(require((0, path_1.join)(process.cwd(), 'node_modules', dependency))));
            const conceptSchema = schema.properties[conceptName];
            const requirements = schema.required;
            for (const requirement of requirements) {
                if (!Object.prototype.hasOwnProperty.call(conceptSchema, requirement)) {
                    throw new Error(`${conceptName} requires ${requirement}`);
                }
                preparedConcept = Object.assign(Object.assign({}, preparedConcept), { [requirement]: conceptSchema[requirement].default || '' });
            }
            console.log(preparedConcept);
            return preparedConcept;
        });
    }
}
exports.Technology = Technology;
//# sourceMappingURL=technology.js.map