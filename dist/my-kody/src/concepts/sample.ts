// @ts-nocheck
import { Tree } from "@angular-devkit/schematics";
import { IConcept, ITechnology, Source, Technology, TemplateSchema } from "kodyfire-core";

/* @ts-ignore */
export class Sample implements IConcept {
    source?: Source;
  name: string;
  content: string;
  outputDir: string;
  template: TemplateSchema;
  defaultAction: string;
  technology: ITechnology;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    this.source = concept.source ?? Source.Template;
    this.outputDir = concept.outputDir ?? "";
    this.name = concept.name ?? "";
    this.template = concept.template as TemplateSchema;
    this.technology = technology;
  }
  generate(data: any, tree: Tree) {
    throw new Error("Method not implemented.");
  }

}