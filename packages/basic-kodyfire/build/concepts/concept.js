"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Concept = void 0;
const kodyfire_core_1 = require("kodyfire-core");
const engine_1 = require("./engine");
class Concept {
    constructor(concept, technology) {
        this.source = concept.source ?? kodyfire_core_1.Source.Template;
        this.outputDir = concept.outputDir ?? '';
        this.name = concept.name ?? '';
        this.template = concept.template;
        this.technology = technology;
    }
    async generate(_data) {
        this.engine = new engine_1.Engine();
        const template = await this.engine.read(this.template.path, _data.template);
        const compiled = this.engine.compile(template, _data);
        await this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename(_data), compiled);
    }
    getFilename(data) {
        if (data.filename)
            return data.filename;
        return data.template.replace('.template', '');
    }
    underscorize(word) {
        return word.replace(/[A-Z]/g, function (char, index) {
            return (index !== 0 ? '_' : '') + char.toLowerCase();
        });
    }
}
exports.Concept = Concept;
//# sourceMappingURL=concept.js.map