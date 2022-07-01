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
exports.Migration = void 0;
const concept_1 = require("./concept");
const engine_1 = require("./engine");
const core_1 = require("@angular-devkit/core");
const moment = require('moment');
const pluralize = require('pluralize');
class Migration extends concept_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
    }
    initEngine() {
        this.engine = new engine_1.Engine();
        this.engine.builder.registerHelper('hasId', (value) => {
            return value.includes('_id');
        });
        this.engine.builder.registerHelper('options', (value) => {
            return this.getCommonOptions(value);
        });
    }
    setModel(_data) {
        // @todo find a better way to get the model
        if (!this.technology.input.model.some((m) => m.name == _data.model)) {
            throw new Error(`Make sure the model ${_data.model} exists and is not mispelled.`);
        }
        this.model = this.technology.input.model.find((m) => m.name == _data.model);
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.initEngine();
            const template = yield this.engine.read(this.template.path, _data.template);
            yield this.appendData(_data);
            const compiled = yield this.engine.compile(template, this.model);
            const filename = yield this.getFilename(this.model);
            yield this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, filename, compiled);
        });
    }
    appendData(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof _data.model === 'string') {
                this.setModel(_data);
                if (_data.filename) {
                    this.model.filename = _data.filename;
                }
                this.model.className = this.getClassName(this.model.name);
                this.model.table = this.getMigrationName(this.model.name);
                this.model.attributes = yield this.getMigrationAttributes(this.model);
                this.model._fields = yield this.getFields(this.model);
            }
            else {
                _data.className = this.getClassName(_data.table);
                _data.attributes = this.getForeignKeysAttributes(_data.columns);
                this.model = _data;
            }
        });
    }
    getForeignKeysAttributes(columns) {
        let data = '';
        columns.forEach((el) => {
            data += `$table->foreignId('${el.column}')->references('${el.references}')->on('${el.on}')${this.getCascade(el)};\n`;
        });
        return data;
    }
    wait(ms) {
        const now = moment();
        const afterXms = moment().add(ms, 'ms');
        do {
            now.add(1, 'ms');
        } while (!afterXms.isSame(now));
    }
    getFilename(model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (model.filename)
                return model.filename;
            // Check if a file exists in the migration folder
            const files = yield this.engine.getFiles(this.technology.rootDir, this.outputDir);
            const suffix = `_create_${core_1.strings.dasherize(pluralize(model.name))}_table.php`;
            const file = files.find((f) => f.includes(suffix));
            if (file) {
                return file;
            }
            const date = new Date();
            const m = date.getMonth();
            const d = date.getDate();
            const y = date.getFullYear();
            const s = date.getTime();
            this.wait(1000);
            const ms = moment(date).add(300, 'milliseconds').toDate().getMilliseconds();
            return `${y}_${m}_${d}_${s}${ms}${suffix}`;
        });
    }
    getMigrationName(model) {
        return this.underscorize(pluralize(model));
    }
    getClassName(model) {
        return `Create${core_1.strings.classify(model)}Table`;
    }
    underscorize(word) {
        return word.replace(/[A-Z]/g, function (char, index) {
            return (index !== 0 ? '_' : '') + char.toLowerCase();
        });
    }
    getMigrationAttributes(model) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = '';
            // data += await this.getFields(model);
            if (model.foreign_keys) {
                model.foreign_keys.forEach((el) => {
                    data += `$table->foreignId('${el.column}')->references('${el.references}')->on('${el.on}')${this.getCascade(el)};\n`;
                });
            }
            if (model.isMorph) {
                data += `$table->morphs('${model.name.toLowerCase()}able');\n`;
            }
            if (model.name == 'User') {
                data += `$table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();`;
            }
            return data;
        });
    }
    getFields(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.engine.read(this.template.path, 'migration/fields.template');
            const compiled = yield this.engine.compile(template, model);
            return compiled;
        });
    }
    getCommonOptions(field) {
        let commonOptions = '';
        if (!field.options) {
            return commonOptions;
        }
        field.options.forEach((op) => {
            if (['unique', 'nullable', 'unsigned'].includes(op.key)) {
                commonOptions += `->${op.key}()`;
            }
            if (op.key == 'default') {
                if (['boolean', 'integer', 'decimal'].includes(field.type)) {
                    commonOptions += `->default(${op.value})`;
                }
                else {
                    commonOptions += `->default("${op.value}")`;
                }
            }
        });
        return commonOptions;
    }
    getCascade(element) {
        let cascade = '';
        if (element.onDelete == 'cascade') {
            cascade += `->onDelete('cascade')`;
        }
        if (element.onUpdate == 'cascade') {
            cascade += `->onUpdate('cascade')`;
        }
        return cascade;
    }
}
exports.Migration = Migration;
//# sourceMappingURL=migration.js.map