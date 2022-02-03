import {
  IConcept,
  Source,
  ITechnology,
  TemplateSchema,
  dasherize,
} from "kodyfire-core";
import * as handlebars from "handlebars";
import { join, relative } from "path";
const fs = require('fs');
const fsPromises = fs.promises;

/* @ts-ignore:next-line */
export class Page implements IConcept {
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

  async generate(data: any): Promise<any>  {
    const template = await fsPromises.readFile(
      join(
        relative(process.cwd(), __dirname),
        this.template.path,
        data.template
        )
        );
        
    let tpl = handlebars.compile(template?.toString());
    let compiled = tpl(data);
    const filename = join(
      this.technology.rootDir,
      this.outputDir,
      this.getFilename(data.template)
    )
    
    await fsPromises.writeFile(filename, compiled);
  }

  getFilename(name: any) {
    // const regexp = /(\d+)/;
    return dasherize(
      name
        .replace(".template", "")
        //.replace(regexp, Math.floor(Math.random() * 100))
    );
  }
}
