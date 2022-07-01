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
exports.Seed = void 0;
const core_1 = require("@angular-devkit/core");
const concept_1 = require("./concept");
const engine_1 = require("./engine");
const pluralize = require('pluralize');
class Seed extends concept_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
    }
    initEngine(_data) {
        this.engine = new engine_1.Engine();
        this.engine.builder.registerHelper('data', () => {
            let args = '';
            let count = 3;
            if (_data.data && _data.data.args && _data.data.args.length > 0) {
                count = _data.data.count || 3;
                args = `[`;
                args += _data.data.args
                    .map((d) => `'${d.key}' => '${d.value}'`)
                    .join(', ');
                args += `]`;
                return `${core_1.strings.classify(_data.model)}::factory()->count(${count})->create(${args});`;
            }
            return `${core_1.strings.classify(_data.model)}::factory()->count(${count})->create();`;
        });
        this.engine.builder.registerHelper('class', () => {
            return `${pluralize(core_1.strings.classify(_data.model))}TableSeeder`;
        });
        this.engine.builder.registerHelper('namespace', () => {
            return `App\\Models\\${core_1.strings.classify(_data.model)}`;
        });
    }
    setModel(_data) {
        this.model = this.technology.input.model.find((m) => m.name == _data.model);
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!_data.model) {
                this.model = _data.data;
            }
            else if (_data.data) {
                this.setModel(_data);
                this.model = Object.assign(Object.assign({}, this.model), _data.data);
            }
            else {
                this.setModel(_data);
            }
            this.initEngine(_data);
            const template = yield this.engine.read(this.template.path, _data.template);
            const compiled = this.engine.compile(template, this.model);
            this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, _data.filename || this.getFilename(_data.model), compiled);
        });
    }
    getFilename(name) {
        return `${pluralize(core_1.strings.classify(name))}TableSeeder.php`;
    }
}
exports.Seed = Seed;
//# sourceMappingURL=seed.js.map