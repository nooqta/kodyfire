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
exports.Factory = void 0;
const core_1 = require("@angular-devkit/core");
const concept_1 = require("./concept");
const engine_1 = require("./engine");
class Factory extends concept_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
    }
    initEngine(_data) {
        this.engine = new engine_1.Engine();
        this.engine.builder.registerHelper('factory', () => {
            return _data.model;
        });
        this.engine.builder.registerHelper('imports', () => {
            return this.getImports();
        });
        this.engine.builder.registerHelper('model', () => {
            return _data.model;
        });
        this.engine.builder.registerHelper('factoryNamespace', () => {
            return _data.namespace;
        });
    }
    getImports() {
        let data = '';
        data += `use Faker\\Generator as Faker;\n`;
        data += `use App\\Models\\${this.model.name};\n`;
        if (this.model.relationships) {
            this.model.relationships.forEach((el) => {
                if (el.type == 'belongsTo') {
                    data += `use App\\Models\\${el.model};\n`;
                }
            });
        }
        return data;
    }
    setModel(_data) {
        // @todo find a better way to get the model
        this.model = this.technology.input.model.find((m) => m.name == _data.model);
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setModel(_data);
            this.initEngine(_data);
            const template = yield this.engine.read(this.template.path, _data.template);
            this.model.definition = this.getData(this.model);
            const compiled = this.engine.compile(template, this.model);
            this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename(_data.model), compiled);
        });
    }
    getFilename(name) {
        return `${core_1.strings.classify(name)}Factory.php`;
    }
    getData(model) {
        let data = '';
        model.fields
            .filter((f) => f.faker_type || ['enum', 'file', 'image'].includes(f.type))
            .forEach((el) => {
            data += `'${el.name}' => ${this.generateFaker(el)},\n`;
        });
        // @todo add relations
        if (model.foreign_keys) {
            model.foreign_keys.forEach((el) => {
                el.name = el.column;
                data += `'${el.column}' => ${this.generateFaker(el)},\n`;
            });
        }
        if (model.isMorph) {
            data += `'${model.name.toLowerCase()}able_id' => 1,
            '${model.name.toLowerCase()}able_type' => 'App\\Models\\${model.name}',\n`;
        }
        return data;
    }
    generateFaker(el, faker = '$this->faker') {
        if (!el.name.includes('_id')) {
            if (el.type == 'enum') {
                return `'${el.arguments[0]}'`;
            }
            if (el.faker_type == 'file' ||
                el.faker_type == 'image' ||
                el.faker_type == 'video') {
                return `${faker}->url()`;
            }
            if (el.faker_type != 'password') {
                if (el.options && el.options.includes('unique')) {
                    return `${faker}->unique()->${el.faker_type}`;
                }
                else {
                    return `${faker}->${el.faker_type}`;
                }
            }
            else {
                return `bcrypt('password')`;
            }
        }
        else {
            return `${el.model}::factory()`;
        }
    }
}
exports.Factory = Factory;
//# sourceMappingURL=factory.js.map