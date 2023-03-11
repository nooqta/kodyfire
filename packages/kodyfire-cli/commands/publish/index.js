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
// @ts-nocheck
const fs_1 = require("fs");
const kodyfire_core_1 = require("kodyfire-core");
const chalk = require('chalk');
const boxen = require('boxen');
const { Command } = require('commander');
const { promises: fs } = require('fs');
const path = require('path');
const action = (args) => __awaiter(void 0, void 0, void 0, function* () {
    const { template } = args;
    const kodies = yield kodyfire_core_1.Package.getInstalledKodies();
    if (kodies.length == 0) {
        const kody = chalk.greenBright(chalk.bold('kody'));
        const message = `😞 No ${kody} installed yet.\nInstall a ${kody} to become a Ninja 🚀🚀🚀`;
        console.log(boxen(message, {
            padding: 1,
            margin: 1,
            align: 'center',
            borderColor: 'yellow',
            borderStyle: 'round',
        }));
    }
    else {
        const name = !args.name.includes('-kodyfire')
            ? `${args.name}-kodyfire`
            : args.name;
        if (kodies.find(kody => kody.name == name)) {
            // @todo: allow specifing target template path
            const target = `./.kody/${name}/templates`;
            // @todo: allow specifing source template paths
            const sources = [
                `./node_modules/${name}/src/concepts/templates`,
                `./node_modules/${name}/src/templates`,
            ];
            let templateFound = false;
            //for each source folder if it exists copy it to the target folder
            for (const source of sources) {
                if (template) {
                    if ((0, fs_1.existsSync)(`${source}/${template}`)) {
                        yield copyFileOrDir(`${source}/${template}`, `${target}`, `${template}`);
                        templateFound = true;
                        continue;
                    }
                }
                else {
                    if ((0, fs_1.existsSync)(source)) {
                        yield copyDir(source, target);
                    }
                }
            }
            if (template && !templateFound) {
                console.log(boxen(`😞 Template ${chalk.yellow(chalk.bold(template))} not found`, {
                    padding: 1,
                    margin: 1,
                    align: 'center',
                    borderColor: 'yellow',
                    borderStyle: 'round',
                }));
                process.exit(1);
            }
            //copy the assets.(json|js) file
            if ((0, fs_1.existsSync)(`./node_modules/${name}/src/assets.js`)) {
                yield fs.copyFile(`./node_modules/${name}/src/assets.js`, `./.kody/${name}/assets.js`);
            }
            else if ((0, fs_1.existsSync)(`./node_modules/${name}/src/assets.json`)) {
                yield fs.copyFile(`./node_modules/${name}/src/assets.json`, `./.kody/${name}/assets.json`);
            }
            //copy the schema.js file
            if ((0, fs_1.existsSync)(`./node_modules/${name}/build/schema.js`)) {
                yield fs.copyFile(`./node_modules/${name}/build/schema.js`, `./.kody/${name}/schema.js`);
            }
        }
        else {
            console.log('😞 Kody not found');
        }
    }
});
function copyFileOrDir(src, dest, template) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs.mkdir(dest, { recursive: true });
        const destPath = path.join(dest, template);
        const stats = yield fs.lstat(src);
        if (stats.isDirectory()) {
            yield copyDir(src, destPath);
        }
        else {
            yield fs.copyFile(src, destPath);
        }
    });
}
function copyDir(src, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs.mkdir(dest, { recursive: true });
        const entries = yield fs.readdir(src, { withFileTypes: true });
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            entry.isDirectory()
                ? yield copyDir(srcPath, destPath)
                : yield fs.copyFile(srcPath, destPath);
        }
    });
}
module.exports = (program) => {
    program
        .command('publish')
        .argument('<kody>', 'kody name to publish')
        .argument('[template]', 'The abreviated or full template name', false)
        .description('Publish the templates of the kody along with the assets.json and schema.ts files')
        .action((name, template, _opt) => __awaiter(void 0, void 0, void 0, function* () {
        action(Object.assign({ name, template }, _opt));
    }));
};
//# sourceMappingURL=index.js.map