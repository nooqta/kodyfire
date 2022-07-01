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
exports.Request = void 0;
const strings_1 = require("@angular-devkit/core/src/utils/strings");
const kodyfire_core_1 = require("kodyfire-core");
// import pluralize from 'pluralize';
const engine_1 = require("./engine");
class Request {
    constructor(concept, technology) {
        var _a, _b, _c;
        this.source = (_a = concept.source) !== null && _a !== void 0 ? _a : kodyfire_core_1.Source.Template;
        this.outputDir = (_b = concept.outputDir) !== null && _b !== void 0 ? _b : '';
        this.name = (_c = concept.name) !== null && _c !== void 0 ? _c : '';
        this.template = concept.template;
        this.technology = technology;
        this.models = technology.input;
    }
    setModel(_data) {
        this.model = this.technology.input.model.find((m) => m.name.toLowerCase() == _data.model.toLowerCase());
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setModel(_data);
            this.engine = new engine_1.Engine();
            _data.relationships = this.model.relationships;
            _data.controller = this.model.controller;
            _data.fields = this.model.fields.filter((f) => typeof f.rules != 'undefined');
            const template = yield this.engine.read(this.template.path, _data.template);
            this.engine.builder.registerHelper('getRequestValidation', () => {
                return this.getRequestValidation(_data, _data.relationships, _data.prefix === 'Create' ? 'store' : 'update');
            });
            _data.rules = this.getRequestValidation(_data, _data.relationships, _data.prefix === 'Create' ? 'store' : 'update');
            _data.relationRules = this.getRelationValidation();
            const compiled = this.engine.compile(template, _data);
            this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename(_data.prefix + _data.model), compiled);
        });
    }
    getFilename(name) {
        return `${(0, strings_1.classify)(name)}Request.php`;
    }
    getValidation(prefix = '', _relatedModel = null) {
        let validation = '';
        this.model.fields.forEach((f) => {
            if (f.rules) {
                validation += `'${prefix}${this.underscorize(f.name)}' => '${f.rules}',\n`;
            }
        });
        return validation;
    }
    underscorize(word) {
        return word.replace(/[A-Z]/g, function (char, index) {
            return (index !== 0 ? '_' : '') + char.toLowerCase();
        });
    }
    getRequestValidation(_model, _relationships, _prefix = '') {
        let validation = '';
        validation = this.getValidation();
        return validation;
    }
    getRelationValidation() {
        let content = '';
        this.model.foreign_keys.forEach((r) => {
            if (r.required) {
                content += `'${this.underscorize(r.column)}' => 'required|exists:${r.on},${r.references}',\n`;
            }
        });
        this.model.relationships.forEach((r) => {
            const relatedModel = this.technology.input.model.find((m) => m.name.toLowerCase() == r.model.toLowerCase());
            if (r.type == 'hasMany' && relatedModel) {
                content += `'${this.underscorize(r.name)}' => 'array',\n`;
                relatedModel.fields.forEach((f) => {
                    if (f.rules) {
                        content += `'${this.underscorize(r.name)}.*.${this.underscorize(f.name)}' => '${f.rules}',\n`;
                    }
                });
            }
        });
        return content;
    }
    isEmail(name) {
        if (name == 'email') {
            return 'email|';
        }
        else {
            return '';
        }
    }
}
exports.Request = Request;
//# sourceMappingURL=request.js.map