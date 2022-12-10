import { ActionList } from './actionList';
import { IConcept } from './concept';

export interface ITechnology {
  id: string;
  name: string;
  version: string;
  rootDir: string;
  input?: any;
  concepts: Map<string, IConcept>;
  assets: any;
  actions: ActionList;
  params: any;
  prepareConcept(dependency: string, conceptName: string, data: any): any;
}

export class Technology implements ITechnology {
  id: string;
  name: string;
  version: string;
  rootDir: string;
  input?: any;
  concepts: Map<string, IConcept>;
  assets: any;
  actions: ActionList;
  params: any;
  constructor() {
    this.actions = new ActionList();
    this.concepts = new Map();
  }
  async prepareConcept(
    dependency: string,
    conceptName: string,
    preparedConcept: any
  ) {
    const { schema } = await import(`${dependency}`);
    const conceptSchema = schema.properties[conceptName];
    const requirements: string[] = schema.required;
    for (const requirement of requirements) {
      // if(!Object.prototype.hasOwnProperty.call(conceptSchema, requirement)) {
      //   throw new Error(`${conceptName} requires ${requirement}`);
      // }
      preparedConcept = {
        ...preparedConcept,
        [requirement]: conceptSchema[requirement].default || '',
      };
    }

    return preparedConcept;
  }
}
