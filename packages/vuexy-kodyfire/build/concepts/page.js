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
exports.Page = void 0;
const concept_1 = require("./concept");
const engine_1 = require("./engine");
const core_1 = require("@angular-devkit/core");
class Page extends concept_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
    }
    initEngine() {
        this.engine = new engine_1.Engine();
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.initEngine();
            const template = yield this.engine.read(this.template.path, _data.template);
            const compiled = yield this.engine.compile(template, this.name);
            yield this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename(_data.name), compiled);
        });
    }
    getFilename(name) {
        return `${core_1.strings.classify(name)}.vue`;
    }
}
exports.Page = Page;
//# sourceMappingURL=page.js.map