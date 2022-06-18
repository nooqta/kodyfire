// import { $ } from "zx";
import { capitalize } from 'kodyfire-core';
import { join } from 'path';
import { fs } from 'zx';

const prompts = require('prompts');
// import { $ } from 'zx';
const boxen = require('boxen');
const { spawn } = require('child_process');
// @todo retrieve from a repository (remote|local)? to centralize all types of projects
const projects = [
  {
    name: 'laravel',
    family: 'laravel',
    language: 'php',
    description: 'A Backend using Laravel (php)',
    command: 'composer',
    args: ['create-project', 'laravel/laravel'],
    requires: ['composer'],
  },
  {
    name: 'vue-cli',
    family: 'vue',
    description: 'A frontend using Vuexy (vue)',
    command: 'vue',
    args: ['create'],
    requires: ['vue'],
  },
  {
    name: 'express',
    family: 'node',
    description: 'A backend using Express (node)',
    command: 'npx',
    args: ['express-generator'],
    requires: ['npx'],
  },
  {
    name: 'react',
    family: 'react',
    description: 'A frontend using React (react)',
    command: 'npx',
    args: ['create-react-app'],
    requires: ['npx'],
  },
  {
    name: 'next-ts',
    family: 'next',
    description: 'A frontend using Next and Typescript (next)',
    command: 'npx',
    args: ['create-next-app@latest', '--template typescript'],
    requires: ['npx'],
  },
  {
    name: 'next-js',
    family: 'next',
    description: 'A frontend using Next (next)',
    command: 'npx create-next-app@latest',
    args: ['create-next-app@latest'],
    requires: ['npx'],
  },
  {
    name: 'flutter',
    family: 'flutter',
    description: 'A mobile app using Flutter (flutter)',
    command: 'flutter',
    args: ['create'],
    requires: ['flutter'],
  },
  {
    name: 'angular',
    family: 'angular',
    description: 'A frontend using Angular (angular)',
    command: 'npx',
    args: ['ng', 'new'],
    requires: ['npx'],
  },
];

export const questions = [
  {
    type: 'text',
    name: 'name',
    message: 'What is the name of your project?',
  },
  {
    type: 'select',
    name: 'technology',
    message: `What are you building today?`,
    choices: projects.map(project => ({
      title: project.description,
      value: project.name,
    })),
  },
];

export class Action {
  static async prompter(): Promise<void | any> {
    // get user choices
    (async () => {
      const response = await prompts(questions);
      const { name, technology } = response;
      // create project
      if (!technology || !name) {
        this.displayMessage('Missing required fields');
        return;
      }
      const project = projects.find(project => project.name === technology);
      if (!project) {
        this.displayMessage(`Project ${technology} not found`);
        return;
      }
      await this.runCommand(project, name);
    })();
  }

  static async runCommand(
    project:
      | {
          name: string;
          family: string;
          language: string;
          description: string;
          command: string;
          args: string[];
          requires: string[];
        }
      | {
          name?: string;
          family?: string;
          description?: string;
          command: string;
          args: string[];
          requires?: string[];
          language?: undefined;
        },
    name: any = null
  ) {
    if (name) {
      project.args = [...project.args, name];
    }
    // @todo: upgrade to latest zx
    // await $`${project.command} ${project.args} ${name}`;
    // or spawn for zx version < 6.0.0
    await spawn(project.command, project.args, { stdio: 'inherit' });
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
