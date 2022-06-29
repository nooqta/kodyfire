import {
  IConcept,
  ITechnology,
  Source,
  Technology,
  TemplateSchema,
} from 'kodyfire-core';
import { Engine } from './engine';
export declare class Concept implements IConcept {
  name: string;
  source?: Source | undefined;
  template: TemplateSchema;
  outputDir: string;
  technology: Technology;
  engine: Engine;
  constructor(concept: Partial<IConcept>, technology: ITechnology);
  templatesPath?: string | undefined;
  defaultAction: string;
  generate(_data: any): Promise<void>;
  getFilename(data: any): any;
  underscorize(word: any): any;
}
