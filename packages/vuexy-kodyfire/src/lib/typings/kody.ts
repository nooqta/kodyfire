/**
 * The IKody interface
 * @alpha
 */
import { IGenerator } from "..";
import { IParser } from "../parser";

export interface IKody {
    parser: IParser;
    generator: IGenerator;
    parse(content: any): any;
    read(source: string): any;
    generate(content: any): any;
}