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
exports.Kernel = void 0;
const kodyfire_core_1 = require("kodyfire-core");
const engine_1 = require("./engine");
class Kernel {
    constructor(concept, technology) {
        var _a, _b, _c;
        this.source = (_a = concept.source) !== null && _a !== void 0 ? _a : kodyfire_core_1.Source.Template;
        this.outputDir = (_b = concept.outputDir) !== null && _b !== void 0 ? _b : '';
        this.name = (_c = concept.name) !== null && _c !== void 0 ? _c : '';
        this.template = concept.template;
        this.technology = technology;
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.engine = new engine_1.Engine();
            const template = yield this.engine.read(this.template.path, _data.template);
            const compiled = this.engine.compile(template, _data);
            this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, 'Kernel.php', compiled);
        });
    }
}
exports.Kernel = Kernel;
//# sourceMappingURL=kernel.js.map