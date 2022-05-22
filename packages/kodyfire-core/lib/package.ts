import { BaseKody, IKody } from '../typings/kody';
import { IPackage } from '../typings/package';
const path = require('path');
const _ = require('lodash');

export class Package {
  registery: string[] = [];
  kody: IKody;
  registeredKodies: Map<string, IKody>;
  constructor(kody: IKody) {
    this.kody = kody;
    this.registeredKodies = new Map();
  }
  async registerPackages() {
    const packages = Package.getInstalledKodiesName();
    for (const _package of packages) {
      await this.registerPackage(_package);
    }
  }

  static getInstalledKodiesName(dirname = process.cwd()) {
    const packageJson = Package.getPackageJson(dirname);
    const packages = packageJson.dependencies
      ? Object.keys(packageJson.dependencies).filter(
          (_package: any) => _package.indexOf('-kodyfire') > -1
        )
      : [];
    return _.merge(
      packages,
      packageJson.devDependencies
        ? Object.keys(packageJson.devDependencies).filter(
            (_package: any) => _package.indexOf('-kodyfire') > -1
          )
        : []
    );
  }

  static async getInstalledKodies(dirname = process.cwd()) {
    const kodies = [];
    const packages = Package.getInstalledKodiesName(dirname);
    for (const _package of packages) {
      const { isValid, packageInfo } = await this.getPackageInfo(_package);
      if (isValid) kodies.push(packageInfo);
    }
    return kodies;
  }
  static async getInstalledKodiesFromPath(dirname: string) {
    const kodies = [];
    const packages = Package.getInstalledKodiesName(dirname);
    for (const _package of packages) {
      const { isValid, packageInfo } = await this.getPackageInfo(
        _package,
        dirname
      );
      if (isValid) kodies.push(packageInfo);
    }
    return kodies;
  }

  getRegistredPackages() {
    return this.registery;
  }
  static getPackageJson(dirname = process.cwd()) {
    return require(path.join(dirname, 'package.json'));
  }
  async registerKodyPackage(_package: any) {
    try {
      const { isValid, packageJson, packageInfo } =
        await Package.getPackageInfo(_package);
      if (isValid) {
        const module = await require(packageJson.name);
        // eslint-disable-next-line no-prototype-builtins
        if (module.hasOwnProperty('Kody')) {
          const kody = new module.Kody(packageInfo);
          if (kody instanceof BaseKody) {
            this.registeredKodies.set(packageJson.name, kody);
            packageInfo.name = packageJson.name;
            return packageInfo;
          }
        }
      }
    } catch {
      return false;
    }
    return false;
  }

  private static async getPackageInfo(_package: any, dirname = process.cwd()) {
    const packageJson = await this.getPackageJson(
      path.join(dirname, 'node_modules', _package)
    );
    const packageInfo = packageJson.kodyfire;
    packageInfo.name = _package;
    const isValid =
      _.difference(['id', 'type', 'version'], Object.keys(packageInfo))
        .length === 0;
    return { isValid, packageJson, packageInfo };
  }

  async registerPackage(_package: any) {
    const kodyPackage = await this.registerKodyPackage(_package);
    if (kodyPackage) {
      this.registery.push(kodyPackage);
      this.registerListeners(kodyPackage);
    }
  }

  registerListeners(_package: IPackage) {
    // @todo: retrieve events from package
    // @todo: register event listeners dynamically
    this.kody.events.on('generate', (_content: any) => {
      if (_package.name) {
        // console.log(`${this.kody.params?.name} is generating. Listening from ${_package.name}`);
      }
    });
    this.kody.events.on('parse', (_content: any) => {
      if (_package.name) {
        // console.log(`${this.kody.params?.name} is parsing. Listening from ${_package.name}`);
      }
    });
    this.kody.events.on('read', (_content: any) => {
      if (_package.name) {
        // console.log(`${this.kody.params?.name} is reading. Listening from ${_package.name}`);
      }
    });
  }
}
