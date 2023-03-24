import * as defaultConfig from './config/default';
declare class Config {
    config: any;
    initialConfig: typeof defaultConfig;
    constructor();
    private init;
    get(key?: string): any;
    has(key?: string): any;
    getTechnology(alias: string): any;
}
export { Config };
//# sourceMappingURL=index.d.ts.map