import { ActionList, capitalize } from 'kodyfire-core';
import * as assets from './assets.json';
/* @ts-ignore */
import * as classes from '.';
import { join } from 'path';
const fs = require('fs');
export class Technology {
    constructor(params) {
        try {
            this.id = params.id;
            this.name = params.name;
            this.version = params.version;
            this.actions = new ActionList();
            this.concepts = new Map();
            this.rootDir = assets.rootDir;
            this.assets = assets;
            this.params = params;
            if (params.templatesPath) {
                // user requested to use custom templates. We need to set the path to the templates
                const templatesPath = join(process.cwd(), '.kody', params.name);
                // we check if the path exists
                if (!fs.existsSync(templatesPath)) {
                    throw new Error(`The path ${templatesPath} does not exist.\nRun the command "kodyfire publish ${params.name}" to publish the templates.`);
                }
                params.templatesPath = join(process.cwd(), '.kody', params.name);
            }
            // add dynamic property for technology
            for (const concept of this.assets.concepts) {
                this.concepts.set(concept.name, new classes[capitalize(concept.name)](concept, this));
            }
        }
        catch (error) {
            console.log(error, 'error');
        }
    }
    //@todo: refactor. exists in kodyfire-core technology.ts
    async prepareConcept(dependency, conceptName, preparedConcept) {
        const { schema } = await import(`${dependency}/src/parser/validator/schema`);
        const conceptSchema = schema.properties[conceptName];
        const requirements = conceptSchema.items.required;
        for (const requirement of requirements) {
            // if(!Object.prototype.hasOwnProperty.call(conceptSchema, requirement)) {
            //   throw new Error(`${conceptName} requires ${requirement}`);
            // }
            preparedConcept = {
                ...preparedConcept,
                [requirement]: conceptSchema.items.properties[requirement].default || '',
            };
        }
        return preparedConcept;
    }
}
//# sourceMappingURL=technology.js.map