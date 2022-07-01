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
exports.CustomConcept = void 0;
const concept_1 = require("./concept");
const engine_1 = require("./engine");
class CustomConcept extends concept_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
    }
    setModel(_data) {
        if (_data.model) {
            this.model = this.technology.input.model.find((m) => m.name.toLowerCase() == _data.model.toLowerCase());
            const controller = this.technology.input.controller.find((c) => c.model == _data.model);
            this.model.controller = controller;
        }
    }
    initEngine(_data) {
        this.engine = new engine_1.Engine();
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setModel(_data);
            this.initEngine(_data);
            const template = yield this.engine.read(this.template.path, _data.template);
            const compiled = this.engine.compile(template, _data);
            this.engine.createOrOverwrite(this.technology.rootDir, _data.outputDir, this.getFileName(_data.name), compiled);
        });
    }
    getFileName(name) {
        return `${name}.php`;
    }
}
exports.CustomConcept = CustomConcept;
//# sourceMappingURL=customConcept.js.map