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
exports.DatabaseSeed = void 0;
const concept_1 = require("./concept");
const engine_1 = require("./engine");
const pluralize = require('pluralize');
class DatabaseSeed extends concept_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
    }
    initEngine(_data) {
        this.engine = new engine_1.Engine();
        this.engine.builder.registerHelper('data', () => {
            return this.getSeedsList(this.technology.input.model, this.technology.input.roles && this.technology.input.roles.length > 0);
        });
    }
    setModel(_data) {
        this.model = this.technology.input.model.find((m) => m.name == _data.model);
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setModel(_data);
            this.initEngine(_data);
            const template = yield this.engine.read(this.template.path, _data.template);
            const compiled = this.engine.compile(template, this.model);
            this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename(), compiled);
        });
    }
    getFilename() {
        return `DatabaseSeeder.php`;
    }
    getSeedsList(models, has_roles) {
        let seeds = has_roles ? `$this->call(RolesTableSeeder::class);\n` : '';
        if (typeof models.find((el) => el.name === 'Country') != 'undefined') {
            seeds += `$this->call(CountriesTableSeeder::class);\n`;
        }
        models.forEach((el) => {
            if (el.name.toLowerCase() != 'country' && !!el.isMorph === false) {
                seeds += `$this->call(${pluralize(el.name)}TableSeeder::class);\n`;
            }
        });
        return seeds;
    }
}
exports.DatabaseSeed = DatabaseSeed;
//# sourceMappingURL=databaseSeed.js.map