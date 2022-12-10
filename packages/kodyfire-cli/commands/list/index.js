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
const action_1 = require('./action');
const { Command } = require('commander');
module.exports = program => {
  program
    .command('list')
    .alias('ls')
    .description('list installed kodies within your current project.')
    .argument(
      '[kodyName]',
      'List all concepts of a kody by passing the kody name as an argument'
    )
    .action(kodyName =>
      __awaiter(void 0, void 0, void 0, function* () {
        return (0, action_1.action)({ technology: kodyName });
      })
    );
};
//# sourceMappingURL=index.js.map
