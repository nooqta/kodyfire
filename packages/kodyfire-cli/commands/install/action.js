'use strict';
// import { $ } from "zx";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Action = exports.questions = void 0;
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
exports.questions = [
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
class Action {
  static prompter() {
    return __awaiter(this, void 0, void 0, function* () {
      // get user choices
      (() =>
        __awaiter(this, void 0, void 0, function* () {
          const response = yield prompts(exports.questions);
          const { name, technology } = response;
          // create project
          const project = projects.find(project => project.name === technology);
          if (!project) {
            this.displayMessage(`Project ${technology} not found`);
            return;
          }
          yield this.runCommand(project, name);
        }))();
    });
  }
  static runCommand(project, name = null) {
    return __awaiter(this, void 0, void 0, function* () {
      if (name) {
        project.args = [...project.args, name];
      }
      // @todo: upgrade to latest zx
      // await $`${project.command} ${project.args} ${name}`;
      // or spawn for zx version < 6.0.0
      yield spawn(project.command, project.args, { stdio: 'inherit' });
    });
  }
  static displayMessage(message) {
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
  static execute() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        yield this.prompter();
      } catch (error) {
        this.displayMessage(error.message);
      }
    });
  }
  static conceptToQuestion(name, concept, concepts) {
    return __awaiter(this, void 0, void 0, function* () {
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
          choices: concept.enum.map(c => ({ title: c, value: c })),
        };
      }
      if (concept.type === 'text') {
        return {
          type: 'text',
          name: name,
          message: `What is the value for ${name}?`,
        };
      }
    });
  }
}
exports.Action = Action;
//# sourceMappingURL=action.js.map
