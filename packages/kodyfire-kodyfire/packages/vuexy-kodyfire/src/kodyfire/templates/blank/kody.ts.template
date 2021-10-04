import { Tree } from "@angular-devkit/schematics";
import { IGenerator, IKody, IParser, ITechnology } from "kodyfire-core"
import { Generator } from ".";

export class Kody implements IKody {
    [x: string]: any;
    parser: IParser
    generator: IGenerator
    technology: ITechnology
    constructor(parser: IParser, params: any, tree: Tree) {
        this.parser = parser;
        this.generator = new Generator(params, tree);
        this.technology = this.generator.technology;
    }
    generate(_content: any) {
        this.generator.generate(_content);
    }
    parse(content:any) {
        return this.parser.parse(content);
    }
    read(source: any) {
        return this.parser.reader(source);
    }
    get errors() {
        return this.parser.validator.errors;
    }
    get data() {
        return this.parser.data;
    }
    whereami(): string {
        return __dirname
    }
    whoami(): string {
        return __filename;
    }
}