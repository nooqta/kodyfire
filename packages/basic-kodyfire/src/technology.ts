import {
  ActionList,
  capitalize,
  IConcept,
  Technology as BaseTechnology,
} from 'kodyfire-core';
import * as assets from './assets.json';
/* @ts-ignore */
import * as classes from '.';
import { join } from 'path';
const fs = require('fs');
export class Technology implements BaseTechnology {
  id: string;
  name: string;
  version: string;
  rootDir: string;
  concepts: Map<string, IConcept>;
  assets: any;
  actions: ActionList;
  input?: any;
  params: any;
  constructor(params: any, _assets: any = assets) {
    try {
      this.id = params.id;
      this.name = params.name;
      this.version = params.version;
      this.actions = new ActionList();
      this.concepts = new Map<string, IConcept>();
      this.rootDir = _assets.rootDir;
      this.assets = _assets;
      this.params = params;
    } catch (error) {
      console.log(error, 'error');
    }
  }
  public initConcepts() {
    // add dynamic property for technology
    for (const concept of this.assets.concepts) {
      this.concepts.set(
        concept.name,
        new (<any>classes)[capitalize(concept.name)](concept, this)
      );
    }
  }

  public updateTemplatesPath(params: any) {
    // Old method: use templates path upon passing templatesPath in params
    // if (params.templatesPath) {
    //   // user requested to use custom templates. We need to set the path to the templates
    //   let templatesPath = join(process.cwd(), '.kody', params.name);
    //   // we check if the path exists
    //   if (fs.existsSync(templatesPath)) {
    //     // if not we check if its a wrapper kody
    //     templatesPath = params.templatesPath;
    //     if (!fs.existsSync(join(templatesPath, 'templates'))) {
    //       throw new Error(`The path ${templatesPath} does not exist.`);
    //     }
    //   }
    //   this.params.templatesPath = templatesPath;
    // }

    // New method: use templates path if .kody exists in the root directory
    const templatesPath = join(process.cwd(), '.kody', params.name);
    // we check if the path exists
    if (fs.existsSync(templatesPath)) {
      this.params.templatesPath = templatesPath;
      // We overwrite the assets property if assets.json exists in the .kody folder
      if (fs.existsSync(join(templatesPath, 'assets.js'))) {
        this.assets = require(join(templatesPath, 'assets.js'));
      } else if (fs.existsSync(join(templatesPath, 'assets.json'))) {
        this.assets = require(join(templatesPath, 'assets.json'));
      }
    }
  }

  //@todo: refactor. exists in kodyfire-core technology.ts
  async prepareConcept(
    dependency: string,
    conceptName: string,
    preparedConcept: any
  ) {
    const { schema } = await import(
      join(process.cwd(), 'node_modules', dependency)
    );
    const conceptSchema = schema.properties[conceptName];
    const requirements: string[] = schema.required;
    for (const requirement of requirements) {
      if (!Object.prototype.hasOwnProperty.call(conceptSchema, requirement)) {
        throw new Error(`${conceptName} requires ${requirement}`);
      }
      preparedConcept = {
        ...preparedConcept,
        [requirement]: conceptSchema[requirement].default || '',
      };
    }

    return preparedConcept;
  }
}
