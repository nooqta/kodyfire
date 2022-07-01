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
exports.Dependency = void 0;
const concept_1 = require("./concept");
const engine_1 = require("./engine");
class Dependency extends concept_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
    }
    initEngine(_data) {
        this.engine = new engine_1.Engine();
        this.engine.builder.registerHelper('commands', () => {
            return this.getCommands(_data);
        });
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.initEngine(_data);
            const template = yield this.engine.read(this.template.path, _data.template);
            const compiled = this.engine.compile(template, this.model);
            this.engine.createOrOverwrite(this.technology.rootDir, '', this.getFileName(), compiled);
        });
    }
    getFileName() {
        return 'bash.sh';
    }
    getCommands(dependency) {
        dependency.commands.unshift(`composer require ${dependency.install}`);
        return dependency.commands.map((cmd) => cmd).join('\n');
    }
}
exports.Dependency = Dependency;
//# sourceMappingURL=dependency.js.map