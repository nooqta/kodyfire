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
exports.Model = void 0;
const strings_1 = require("@angular-devkit/core/src/utils/strings");
const kodyfire_core_1 = require("kodyfire-core");
const path_1 = require("path");
const engine_1 = require("./engine");
class Model {
    constructor(concept, technology) {
        var _a, _b, _c;
        this.source = (_a = concept.source) !== null && _a !== void 0 ? _a : kodyfire_core_1.Source.Template;
        this.outputDir = (_b = concept.outputDir) !== null && _b !== void 0 ? _b : '';
        this.name = (_c = concept.name) !== null && _c !== void 0 ? _c : '';
        this.template = concept.template;
        this.technology = technology;
    }
    getTemplatesPath() {
        return this.technology.params.templatesPath
            ? this.technology.params.templatesPath
            : (0, path_1.relative)(process.cwd(), __dirname);
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.engine = new engine_1.Engine();
            const template = yield this.engine.read((0, path_1.join)(this.getTemplatesPath(), this.template.path), _data.template);
            _data.hidden = this.getHiddenArray(_data);
            _data.fillable = this.getFillable(_data);
            _data.relations = this.getModelRelations(_data);
            const compiled = this.engine.compile(template, _data);
            this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename(_data.name), compiled);
        });
    }
    getFilename(name) {
        return `${(0, strings_1.classify)(name)}.php`;
    }
    getModelRelations(model) {
        let relations = '';
        if (!model.relationships) {
            return relations;
        }
        model.relationships.forEach((rel) => {
            if (rel.type === 'morphTo') {
                relations += `public function ${rel.name}()
        {
            return $this->${rel.type}();
        }\n`;
            }
            else {
                relations += `
    public function ${rel.name}()
    {
        return $this->${rel.type}(${this.getRelationArgs(rel)});
    }\n`;
            }
        });
        return relations;
    }
    getFillable(model) {
        return model.fillable ? model.fillable.map((field) => `'${field}'`).join(", ") : '';
    }
    getRelationArgs(rel) {
        let args = '';
        if (rel.model != '' &&
            rel.arguments != '' &&
            rel.arguments &&
            rel.arguments.length > 0) {
            args = `${rel.model}::class, '${rel.arguments}'`;
        }
        else if (rel.model != '') {
            args = `${rel.model}::class`;
        }
        return args;
    }
    getHiddenArray(data) {
        return data.hidden || [];
    }
}
exports.Model = Model;
//# sourceMappingURL=model.js.map