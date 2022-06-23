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
exports.action = void 0;
const chalk = require('chalk');
const fs = require('fs');
const { join } = require('path');
const kodyfire_core_1 = require('kodyfire-core');
const worklfow_1 = require('../../src/kodyfire/lib/cli/worklfow');
function action(args) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      // @todo: Refactor used by watch command
      if (typeof args.source === 'undefined') {
        args.source = join(process.cwd(), 'kody.json');
      }
      if (!fs.existsSync(args.source)) {
        console.log(
          chalk.red(
            `${chalk.bgRed(
              chalk.white(args.source)
            )} not found. Please provide the source file to be used.`
          )
        );
        process.exit(1);
      }
      args.name = getKodyName(args.source);
      console.log(args);
      const { source } = args;
      const workflow = new worklfow_1.CliWorkflow(source);
      const runner = new kodyfire_core_1.Runner(
        Object.assign(Object.assign({}, args), workflow)
      );
      const output = yield runner.run(args);
      // finish process
      return output;
    } catch (error) {
      console.log(chalk.red(error.stack || error.message));
      process.exit(1);
    }
  });
}
exports.action = action;
module.exports = program => {
  program
    .command('run')
    .description('Generate a digital artifact based on the selected technology')
    .option(
      '-s,--source <source>',
      'Source file to be used as the schema for the generator (default: kody.json)',
      'kody.json'
    )
    .option('--templates-path', 'overrides the templates path')
    .action(_opt =>
      __awaiter(void 0, void 0, void 0, function* () {
        // await $`schematics @noqta/kodyfire:run --name ${_opt.name} --dry-run`;
        try {
          action(
            Object.assign(Object.assign({}, _opt), {
              schematic: 'run',
              dryRun: false,
            })
          );
        } catch (error) {
          console.log(error);
        }
      })
    );
};
// @todo: Refactor used by batch|live|? command?
function getKodyName(source) {
  const extension = source.split('.').pop();
  if (extension === 'json') {
    return JSON.parse(fs.readFileSync(source).toString()).name || '';
  } else if (extension === 'yml') {
    return kodyfire_core_1.Yaml.resolve(source).name || '';
  }
  return '';
}
//# sourceMappingURL=index.js.map
