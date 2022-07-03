"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
const technology_1 = require("../technology");
class Generator {
    constructor(params, technology = new technology_1.Technology(params)) {
        this.technology = technology;
    }
    generate(content) {
        var _a;
        // for every concept in concepts list
        for (const [key] of this.technology.concepts) {
            for (const data of content[key]) {
                // do apropriate action
                this.output = (_a = this.technology.concepts.get(key)) === null || _a === void 0 ? void 0 : _a.generate(data);
            }
        }
        // return result
        return this.output;
    }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map