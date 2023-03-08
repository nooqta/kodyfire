"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const path = require('path');
const _ = require('lodash');
class Package {
    constructor(kody) {
        this.registery = [];
        this.kody = kody;
        this.registeredKodies = new Map();
    }
    registerPackages() {
        return __awaiter(this, void 0, void 0, function* () {
            const packages = Package.getInstalledKodiesName();
            for (const _package of packages) {
                yield this.registerPackage(_package);
            }
        });
    }
    static getInstalledKodiesName(dirname = process.cwd()) {
        const packageJson = Package.getPackageJson(dirname);
        const packages = packageJson.dependencies
            ? Object.keys(packageJson.dependencies).filter((_package) => _package.indexOf('-kodyfire') > -1)
            : [];
        return _.merge(packages, packageJson.devDependencies
            ? Object.keys(packageJson.devDependencies).filter((_package) => _package.indexOf('-kodyfire') > -1)
            : []);
    }
    static getInstalledKodies(dirname = process.cwd()) {
        return __awaiter(this, void 0, void 0, function* () {
            const kodies = [];
            const packages = Package.getInstalledKodiesName(dirname);
            for (const _package of packages) {
                const { isValid, packageInfo } = yield this.getPackageInfo(_package);
                if (isValid)
                    kodies.push(packageInfo);
            }
            return kodies;
        });
    }
    static getInstalledKodiesFromPath(dirname) {
        return __awaiter(this, void 0, void 0, function* () {
            const kodies = [];
            const packages = Package.getInstalledKodiesName(dirname);
            for (const _package of packages) {
                const { isValid, packageInfo } = yield this.getPackageInfo(_package, dirname);
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
                    // eslint-disable-next-line no-prototype-builtins
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
    static getPackageInfo(_package, dirname = process.cwd()) {
        return __awaiter(this, void 0, void 0, function* () {
            const packageJson = yield this.getPackageJson(path.join(dirname, 'node_modules', _package));
            const packageInfo = packageJson.kodyfire;
            packageInfo.name = _package;
            const isValid = _.difference(['id', 'type', 'version'], Object.keys(packageInfo))
                .length === 0;
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
            if (_package.name) {
                // console.log(`${this.kody.params?.name} is generating. Listening from ${_package.name}`);
            }
        });
        this.kody.events.on('parse', (_content) => {
            if (_package.name) {
                // console.log(`${this.kody.params?.name} is parsing. Listening from ${_package.name}`);
            }
        });
        this.kody.events.on('read', (_content) => {
            if (_package.name) {
                // console.log(`${this.kody.params?.name} is reading. Listening from ${_package.name}`);
            }
        });
    }
    getRecipeSchema(dependency, dirname = process.cwd()) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipes = yield Promise.resolve().then(() => __importStar(require(path.join(dirname, 'node_modules', dependency, 'src', 'recipes'))));
            return recipes.default;
        });
    }
}
exports.Package = Package;
//# sourceMappingURL=package.js.map