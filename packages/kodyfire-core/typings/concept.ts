import { Technology } from '..';
export enum Source {
  Template,
}
export interface TemplateSchema {
  path: string;
  options: string[];
}
export interface IConcept {
  name: string;
  templatesPath?: string;
  defaultAction: string;
  source?: Source;
  template: TemplateSchema;
  outputDir?: string;
  technology: Technology;
  generate(data: any): any;
}
