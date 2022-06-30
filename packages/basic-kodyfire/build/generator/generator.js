import { normalize, virtualFs } from '@angular-devkit/core';
import { NodeJsSyncHost } from '@angular-devkit/core/node';
import { HostTree } from '@angular-devkit/schematics';
import { Technology } from '../technology';
export class Generator {
    constructor(params) {
        this.technology = new Technology(params);
        const _backend = new virtualFs.ScopedHost(new NodeJsSyncHost(), normalize(process.cwd()));
        this.tree = new HostTree(_backend);
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
//# sourceMappingURL=generator.js.map