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
exports.Generator = void 0;
const technology_1 = require("../technology");
class Generator {
    constructor(params, technology = new technology_1.Technology(params)) {
        this.technology = technology;
    }
    generate(content) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.input = content;
            this.technology.input = content;
            this.technology.rootDir = content.rootDir || this.technology.rootDir;
            // for every concept in concepts list
            for (const [key] of this.technology.concepts) {
                // eslint-disable-next-line no-prototype-builtins
                if (content.hasOwnProperty(key)) {
                    for (const data of content[key]) {
                        console.log('content[key]', content[key]);
                        // do apropriate action
                        this.output = yield ((_a = this.technology.concepts.get(key)) === null || _a === void 0 ? void 0 : _a.generate(data));
                    }
                }
                else {
                    // do apropriate action
                }
            }
            // return result
            return this.output;
        });
    }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map