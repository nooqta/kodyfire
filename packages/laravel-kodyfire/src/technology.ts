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
  constructor(params: any) {
    try {
      this.id = params.id;
      this.name = params.name;
      this.version = params.version;
      this.actions = new ActionList();
      this.concepts = new Map<string, IConcept>();
      this.rootDir = assets.rootDir;
      this.assets = assets;

      // add dynamic property for technology
      for (const concept of this.assets.concepts) {
        this.concepts.set(
          concept.name,
          new (<any>classes)[capitalize(concept.name)](concept, this)
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}
