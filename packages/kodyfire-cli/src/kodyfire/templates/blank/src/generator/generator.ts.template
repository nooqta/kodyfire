import { Tree } from "@angular-devkit/schematics";
import { IGenerator, ITechnology } from "kodyfire-core";
import { Technology } from "../technology";
 
export class Generator implements IGenerator {
    technology: ITechnology;
    input: any;
    tree: Tree;
    constructor(params: any, tree: Tree) {
        this.technology = new Technology(params);
        this.tree = tree;
    }
    generate(content: any) {
       // for every concept in concepts list
       for (let [key] of this.technology.concepts) { 
           for (let data of content[key]) {
               // do apropriate action
                   this.tree = this.technology.concepts.get(key)?.generate(data, this.tree);
          }
       }
       // return result
       return this.tree;

    }
    
}