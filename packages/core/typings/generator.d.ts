import { Tree } from "@angular-devkit/schematics";
import { ITechnology } from "..";
export interface IGenerator {
    technology: ITechnology;
    generate(content: any, tree?: Tree): any;
}
//# sourceMappingURL=generator.d.ts.map