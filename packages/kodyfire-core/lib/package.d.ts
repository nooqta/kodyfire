import { IKody } from '../typings/kody';
import { IPackage } from '../typings/package';
export declare class Package {
  registery: string[];
  kody: IKody;
  registeredKodies: Map<string, IKody>;
  constructor(kody: IKody);
  registerPackages(): Promise<void>;
  static getInstalledKodiesName(dirname?: string): any;
  static getInstalledKodies(): Promise<any[]>;
  static getInstalledKodiesFromPath(dirname: string): Promise<any[]>;
  getRegistredPackages(): string[];
  static getPackageJson(dirname?: string): any;
  registerKodyPackage(_package: any): Promise<any>;
  private static getPackageInfo;
  registerPackage(_package: any): Promise<void>;
  registerListeners(_package: IPackage): void;
}
//# sourceMappingURL=package.d.ts.map
