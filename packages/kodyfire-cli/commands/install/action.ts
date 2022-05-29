// import { $ } from "zx";

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

  static async conceptToQuestion(
    name: string,
    concept: { type?: string; enum?: any },
    concepts: string[]
  ): Promise<any | void> {
    if (concepts.includes(name)) {
      return {
        type: 'select',
        name: name,
        message: `Select the value for ${name}?`,
        choices: concepts.map(c => ({ title: c, value: c })),
      };
    }
    if (typeof concept.enum !== 'undefined') {
      return {
        type: 'select',
        name: name,
        message: `Select the value for ${name}?`,
        choices: concept.enum.map((c: any) => ({ title: c, value: c })),
      };
    }
    if (concept.type === 'text') {
      return {
        type: 'text',
        name: name,
        message: `What is the value for ${name}?`,
      };
    }
  }
}
