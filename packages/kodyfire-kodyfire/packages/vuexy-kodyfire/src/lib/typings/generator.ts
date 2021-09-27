
import { ITechnology } from "..";

export interface IGenerator {
    technology: ITechnology;
    generate(content: any): any;

}