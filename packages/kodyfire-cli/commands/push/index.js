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
const kodyfire_core_1 = require('kodyfire-core');
const chalk = require('chalk');
const boxen = require('boxen');
const Table = require('cli-table');
const EventEmitter = require('events');
const ee = new EventEmitter();
const { Command } = require('commander');
const action = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const kodies = yield kodyfire_core_1.Package.getInstalledKodies();
    // @todo: use event emitter to listen to the event of the runner
    ee.on('message', text => {
      console.log(text);
    });
    if (kodies.length == 0) {
      const kody = chalk.greenBright(chalk.bold('kody'));
      const message = `😞 No ${kody} installed yet.\nInstall a ${kody} to become a Ninja 🚀🚀🚀`;
      console.log(
        boxen(message, {
          padding: 1,
          margin: 1,
          align: 'center',
          borderColor: 'yellow',
          borderStyle: 'round',
        })
      );
    } else {
      const table = new Table({
        head: ['id', 'name', 'type', 'version'],
        colWidths: [31, 31, 21, 10],
        style: {
          'padding-left': 1,
          'padding-right': 1,
          head: ['yellow'],
        },
      });
      kodies.forEach(template => {
        table.push([
          template.id,
          template.name,
          template.type,
          template.version,
        ]);
      });
      console.log(table.toString());
    }
  });
module.exports = program => {
  program
    .command('list')
    .alias('ls')
    .description('list available technologies')
    .action(_opt =>
      __awaiter(void 0, void 0, void 0, function* () {
        return action();
      })
    );
};
//# sourceMappingURL=index.js.map
