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
exports.Module = void 0;
const path_1 = require("path");
const { promises: fs } = require('fs');
const concept_1 = require("./concept");
const engine_1 = require("./engine");
const core_1 = require("@angular-devkit/core");
class Module extends concept_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
    }
    initEngine() {
        this.engine = new engine_1.Engine();
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.initEngine();
            const filePath = (0, path_1.join)((0, path_1.relative)(process.cwd(), __dirname), this.template.path, _data.templateFolder);
            const folderContent = yield this.readFolder(filePath);
            for (const file of folderContent) {
                const stat = yield fs.lstat((0, path_1.join)(filePath, file));
                if (stat.isFile()) {
                    const template = yield this.engine.read(this.template.path, (0, path_1.join)(_data.templateFolder, file));
                    const compiled = yield this.engine.compile(template, _data);
                    yield this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename(_data.templateFolder, file, _data.name), compiled);
                }
                else if (stat.isDirectory()) {
                    yield this.generate(Object.assign(Object.assign({}, _data), { templateFolder: (0, path_1.join)(_data.templateFolder, file) }));
                }
            }
        });
    }
    readFolder(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            // Read directory
            let names;
            try {
                names = yield fs.readdir(folder);
            }
            catch (e) {
                console.log('e', e);
            }
            return names;
        });
    }
    getFilename(path, name, moduleName) {
        return (0, path_1.join)(path.replaceAll('module', moduleName), `${name
            .replace('Module', core_1.strings.classify(moduleName))
            .replace('module', moduleName)
            .replace('.template', '')}`);
    }
}
exports.Module = Module;
//# sourceMappingURL=module.js.map