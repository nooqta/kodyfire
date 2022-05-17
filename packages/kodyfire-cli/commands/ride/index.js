'use strict';
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
const { Command } = require('commander');
const prompts = require('prompts');
const questions = _args => {
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
  return [
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
};
const action = _args =>
  __awaiter(void 0, void 0, void 0, function* () {
    const response = yield prompts(questions);
    console.log(response);
  });
module.exports = program => {
  program
    .command('ride')
    .alias('↻')
    .description('Prompt assistant to help build your kody.json file')
    .action(_opt =>
      __awaiter(void 0, void 0, void 0, function* () {
        return yield action(_opt);
      })
    );
};
exports.default = action;
//# sourceMappingURL=index.js.map
