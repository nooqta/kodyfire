import { ActionList, capitalize, IConcept, ITechnology } from 'kodyfire-core';
import * as assets from './assets.json';
/* @ts-ignore */
import * as classes from '.';

export class Technology implements ITechnology {
  id: string;
  name: string;
  version: string;
  rootDir: string;
  concepts: Map<string, IConcept>;
  assets: any;
  actions: ActionList;
  input?: any;
  params: any;
  constructor(params: any, _assets = assets) {
    try {
      this.id = params.id;
      this.name = params.name;
      this.version = params.version;
      this.actions = new ActionList();
      this.concepts = new Map<string, IConcept>();
      this.rootDir = _assets.rootDir;
      this.assets = _assets;
      this.params = params;
      // add dynamic property for technology
      for (const concept of this.assets.concepts) {
        const className = capitalize(concept.name);
        this.concepts.set(
          concept.name,
          new (<any>classes)[className](concept, this)
        );
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  //@todo: refactor. exists in kodyfire-core technology.ts
  async prepareConcept(
    dependency: string,
    conceptName: string,
    preparedConcept: any
  ) {
    const { schema } = await import(
      `${process.cwd()}/node_modules/${dependency}`
    );
    const conceptSchema = schema.properties[conceptName];
    const requirements: string[] = conceptSchema.items.required;
    for (const requirement of requirements) {
      // if(!Object.prototype.hasOwnProperty.call(conceptSchema, requirement)) {
      //   throw new Error(`${conceptName} requires ${requirement}`);
      // }
      preparedConcept = {
        ...preparedConcept,
        [requirement]:
          conceptSchema.items.properties[requirement].default || '',
      };
    }
    return preparedConcept;
  }
}
