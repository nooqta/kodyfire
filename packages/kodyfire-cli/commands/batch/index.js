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
const chalk = require('chalk');
const fs = require('fs');
const { join } = require('path');
const kodyfire_core_1 = require('kodyfire-core');
const worklfow_1 = require('../../src/lib/cli/worklfow');
function action(args) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
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
      // if
      const content = JSON.parse(fs.readFileSync(args.source).toString());
      if (!content.sources) {
        console.log(chalk.red('No sources found in kody.json'));
        process.exit(1);
      }
      for (const source of content.sources) {
        args.name = getKodyName(args.source);
        args.source = join(process.cwd(), source.filename);
        const workflow = new worklfow_1.CliWorkflow(source.filename);
        const runner = new kodyfire_core_1.Runner(
          Object.assign(Object.assign({}, args), workflow)
        );
        yield runner.run(args);
      }
      // finish process
      return 0;
    } catch (error) {
      console.log(chalk.red(error.stack || error.message));
      process.exit(1);
    }
  });
}
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
module.exports = program => {
  program
    .command('batch')
    .description('Generate multiple digital artifact')
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
//# sourceMappingURL=index.js.map
