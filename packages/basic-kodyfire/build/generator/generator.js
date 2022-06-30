"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
const core_1 = require("@angular-devkit/core");
const node_1 = require("@angular-devkit/core/node");
const schematics_1 = require("@angular-devkit/schematics");
const technology_1 = require("../technology");
class Generator {
    constructor(params) {
        this.technology = new technology_1.Technology(params);
        const _backend = new core_1.virtualFs.ScopedHost(new node_1.NodeJsSyncHost(), (0, core_1.normalize)(process.cwd()));
        this.tree = new schematics_1.HostTree(_backend);
    }
    async generate(content) {
        this.input = content;
        this.technology.input = content;
        this.technology.rootDir = content.rootDir || this.technology.rootDir;
        // for every concept in concepts list
        for (const [key] of this.technology.concepts) {
            for (const data of content[key]) {
                // do apropriate action
                this.tree = await this.technology.concepts.get(key)?.generate(data);
            }
        }
        // return result
        return this.tree;
    }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map