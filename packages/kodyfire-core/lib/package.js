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
exports.Package = void 0;
const kody_1 = require("../typings/kody");
const path = require("path");
const _ = require('lodash');
class Package {
    constructor(kody) {
        this.registery = [];
        this.kody = kody;
        this.registeredKodies = new Map();
    }
    registerPackages() {
        return __awaiter(this, void 0, void 0, function* () {
            let packages = this.getInstalledKodiesName();
            for (let _package of packages) {
                yield this.registerPackage(_package);
            }
        });
    }
    getInstalledKodiesName() {
        const packageJson = Package.getPackageJson();
        let packages = Object.keys(packageJson.dependencies).filter((_package) => _package.indexOf('-kodyfire') > -1);
        return _.merge(packages, Object.keys(packageJson.devDependencies).filter((_package) => _package.indexOf('-kodyfire') > -1));
    }
    static getInstalledKodies() {
        return __awaiter(this, void 0, void 0, function* () {
            const packageJson = this.getPackageJson();
            let kodies = [];
            let packages = Object.keys(packageJson.dependencies).filter((_package) => _package.indexOf('-kodyfire') > -1);
            packages = _.merge(packages, Object.keys(packageJson.devDependencies).filter((_package) => _package.indexOf('-kodyfire') > -1));
            for (let _package of packages) {
                const { isValid, packageInfo } = yield this.getPackageInfo(_package);
                if (isValid)
                    kodies.push(packageInfo);
            }
            return kodies;
        });
    }
    getRegistredPackages() {
        return this.registery;
    }
    static getPackageJson(dirname = process.cwd()) {
        return require(path.join(dirname, 'package.json'));
    }
    registerKodyPackage(_package) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { isValid, packageJson, packageInfo } = yield Package.getPackageInfo(_package);
                if (isValid) {
                    const module = yield require(packageJson.name);
                    if (module.hasOwnProperty('Kody')) {
                        const kody = new module.Kody(packageInfo);
                        if (kody instanceof kody_1.BaseKody) {
                            this.registeredKodies.set(packageJson.name, kody);
                            packageInfo.name = packageJson.name;
                            return packageInfo;
                        }
                    }
                }
            }
            catch (_a) {
                return false;
            }
            return false;
        });
    }
    static getPackageInfo(_package) {
        return __awaiter(this, void 0, void 0, function* () {
            const packageJson = yield this.getPackageJson(path.join(process.cwd(), 'node_modules', _package));
            let packageInfo;
            packageInfo = packageJson.kodyfire;
            packageInfo.name = _package;
            let isValid = _.difference(['id', 'type', 'version'], Object.keys(packageInfo)).length === 0;
            return { isValid, packageJson, packageInfo };
        });
    }
    registerPackage(_package) {
        return __awaiter(this, void 0, void 0, function* () {
            const kodyPackage = yield this.registerKodyPackage(_package);
            if (kodyPackage) {
                this.registery.push(kodyPackage);
                this.registerListeners(kodyPackage);
            }
        });
    }
    registerListeners(_package) {
        // @todo: retrieve events from package
        // @todo: register event listeners dynamically
        this.kody.events.on('generate', (_content) => {
            var _a;
            if (_package.name) {
                console.log(`${(_a = this.kody.params) === null || _a === void 0 ? void 0 : _a.name} is generating. Listening from ${_package.name}`);
            }
        });
        this.kody.events.on('parse', (_content) => {
            var _a;
            if (_package.name) {
                console.log(`${(_a = this.kody.params) === null || _a === void 0 ? void 0 : _a.name} is parsing. Listening from ${_package.name}`);
            }
        });
        this.kody.events.on('read', (_content) => {
            var _a;
            if (_package.name) {
                console.log(`${(_a = this.kody.params) === null || _a === void 0 ? void 0 : _a.name} is reading. Listening from ${_package.name}`);
            }
        });
    }
}
exports.Package = Package;
//# sourceMappingURL=package.js.map