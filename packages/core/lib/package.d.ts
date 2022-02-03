import { IKody } from "../typings/kody";
import { IPackage } from "../typings/package";
export declare class Package {
    registery: string[];
    kody: IKody;
    registeredKodies: Map<string, IKody>;
    constructor(kody: IKody);
    registerPackages(): Promise<void>;
    getInstalledKodiesName(): any;
    static getInstalledKodies(): Promise<any[]>;
    getRegistredPackages(): string[];
    static getPackageJson(dirname?: string): any;
    registerKodyPackage(_package: any): Promise<any>;
    private static getPackageInfo;
    registerPackage(_package: any): Promise<void>;
    registerListeners(_package: IPackage): void;
}
//# sourceMappingURL=package.d.ts.map