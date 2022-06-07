// import { $ } from "zx";
import { capitalize } from 'kodyfire-core';
import { join } from 'path';
import { fs } from 'zx';

const prompts = require('prompts');
const boxen = require('boxen');

const questions =
  // Does kody.json file exist
  // Are there any kodies installed
  // If no list kodies the user can install
  // If yes, list the kodies
  // Choose kody
  // If done selecting kodies, save the kody.json file
  // Ask the user if she/he wants to watch the build process
  // For every selected kody
  // Install project from scratch if applicable
  // Select destination
  //  Define concepts
  [
    {
      type: 'select',
      name: 'technology',
      message: `What are you building today?`,
      choices: [
        // Installed kodies list
        { title: 'A Backend using Laravel (php)', value: 'laravel' },
        { title: 'A frontend using Vuexy (vue)', value: 'vuexy' },
        { title: 'Both', value: ['laravel', 'vuexy'] },
      ],
    },
    {
      type: 'multiselect',
      name: 'color',
      message: 'Pick colors',
      choices: [
        { title: 'Red', value: '#ff0000' },
        { title: 'Green', value: '#00ff00' },
        { title: 'Blue', value: '#0000ff' },
      ],
    },
  ];

export class Action {
  static kody: any;
  static concept: any;
  static property: any;
  // @todo: refactor into a Base Action class. used by init/action.ts
  static async getPackageDependencies(rootDir = process.cwd()): Promise<any> {
    const packageJsonFile = await fs.readFile(
      join(rootDir, 'package.json'),
      'utf8'
    );
    const packageJson = JSON.parse(packageJsonFile);
    const name = packageJson.name;
    let dependencies: string[] = [];
    if (
      packageJson.dependencies &&
      Object.keys(packageJson.dependencies).length > 0
    ) {
      dependencies = Object.keys(packageJson.dependencies);
    }

    if (
      packageJson.devDependencies &&
      Object.keys(packageJson.devDependencies).length > 0
    ) {
      dependencies = dependencies.concat(
        Object.keys(packageJson.devDependencies)
      );
    }

    dependencies = dependencies.filter(dep => dep.includes('-kodyfire'));
    return { name, dependencies };
  }
  static async prompter(): Promise<void | any> {
    (async () => {
      if (!this.kody) {
        const kodyQuestion = await this.getKodyQuestion();
        if (!kodyQuestion) {
          this.displayMessage(
            'No kodies installed. Please install at least a kody package first.'
          );
          process.exit(1);
        }
        this.kody = await prompts(kodyQuestion);
      }
      const response = await prompts(questions);
      console.log(response);
    })();
  }

  static async getKodyQuestion() {
    const { dependencies } = await this.getPackageDependencies();
    if (dependencies.length == 0) {
      return false;
    }
    const question = {
      type: 'select',
      name: 'kody',
      message: `Select the kody package?`,
      choices: dependencies,
    };
    return question;
  }
  static displayMessage(message: string) {
    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        align: 'center',
        borderColor: 'yellow',
        borderStyle: 'round',
      })
    );
  }
  static async execute() {
    try {
      await this.prompter();
    } catch (error) {
      this.displayMessage(error.message);
    }
  }

  static async addConcept(
    dependency: string,
    concept: string,
    data: any,
    rootDir: string = process.cwd()
  ) {
    try {
      let content = this.getSchemaDefinition(dependency, rootDir);
      if (content[concept]) {
        content[concept] = [...content[concept], data];
      } else {
        content[concept] = [data];
      }
      content = JSON.stringify(content, null, '\t');
      fs.writeFileSync(
        join(rootDir, `kody-${dependency.replace('-kodyfire', '')}.json`),
        content
      );
    } catch (error) {
      this.displayMessage(error.message);
    }
  }
  static async addConceptProperty(
    dependency: string,
    concept: string,
    property: string,
    data: any,
    rootDir: string = process.cwd()
  ) {
    try {
      let content = this.getSchemaDefinition(dependency, rootDir);
      const currentConcept = data['concept'];
      // tweak the data for array for now
      delete data['concept'];
      data = data[property] ? data[property] : data;
      if (typeof content[concept][currentConcept][property] !== 'undefined') {
        content[concept][currentConcept][property] = [
          ...content[concept][currentConcept][property],
          data,
        ];
      } else {
        content[concept][currentConcept][property] = [data];
      }
      content = JSON.stringify(content, null, '\t');
      fs.writeFileSync(
        join(rootDir, `kody-${dependency.replace('-kodyfire', '')}.json`),
        content
      );
    } catch (error) {
      this.displayMessage(error.message);
    }
  }
  static getSchemaDefinition(dependency: string, rootDir: string) {
    return JSON.parse(
      fs.readFileSync(
        join(rootDir, `kody-${dependency.replace('-kodyfire', '')}.json`),
        'utf8'
      )
    );
  }
  static async conceptToQuestion(
    name: string,
    concept: { type?: string; enum?: any },
    concepts: any = {},
    message: boolean | string = false,
    useIndex = false
  ): Promise<any | void> {
    if (concepts[name] && typeof concepts[name] != 'string') {
      const choices = concepts[name].map((c: any, index: any) => ({
        title: c.name || `${capitalize(name)} ${index}`,
        value: useIndex ? index : c.name,
      }));
      return {
        type: 'select',
        name: name,
        message: message || `Select the value for ${name}?`,
        choices: choices,
      };
    }
    if (typeof concept.enum !== 'undefined') {
      return {
        type: 'select',
        name: name,
        message: message || `Select the value for ${name}?`,
        choices: concept.enum.map((c: any) => ({ title: c, value: c })),
      };
    }
    if (concept.type === 'string') {
      return {
        type: 'text',
        name: name,
        message: message || `What is the value for ${name}?`,
      };
    }
    if (concept.type === 'array') {
      return {
        type: 'array',
        name: name,
        message: message || `What is the value for ${name}?`,
      };
    }
  }
}
