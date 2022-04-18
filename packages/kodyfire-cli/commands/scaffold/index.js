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
const tools_1 = require('@angular-devkit/schematics/tools');
const schematics_1 = require('@angular-devkit/schematics');
const chalk = require('chalk');
const { Command } = require('commander');
const { join } = require('path');
const pack = require(join(process.cwd(), 'package.json'));
function parseSchematicName(_arg) {
  // All schematics are local to kody
  const collectionName = 'kodyfire';
  const currentPath =
    pack.name == collectionName
      ? join(process.cwd(), `packages/${collectionName}-cli`)
      : process.cwd();
  const collection =
    pack.name == collectionName ? `./packages/${collectionName}-cli` : '.';
  const schematic = _arg.schematic;
  return { collection, schematic, currentPath };
}
function action(args) {
  return __awaiter(this, void 0, void 0, function* () {
    const {
      collection: collectionName,
      schematic: schematicName,
      currentPath,
    } = parseSchematicName(args);
    args.currentPath = currentPath;
    const root = process.cwd();
    // const dryRun = args.dryRun as boolean;
    const dryRun = false;
    const workflow = new tools_1.NodeWorkflow(root, {
      resolvePaths: [root, join(root, 'src')],
      dryRun: dryRun,
      schemaValidation: true,
    });
    try {
      yield workflow
        .execute({
          collection: collectionName,
          schematic: schematicName,
          options: args,
        })
        .toPromise();
      return 0;
    } catch (err) {
      if (err instanceof schematics_1.UnsuccessfulWorkflowExecution) {
        console.log(chalk.red('Kody failed. See above.'));
      } else {
        console.log(chalk.red(err.stack || err.message));
      }
      return 1;
    }
  });
}
module.exports = program => {
  program
    .command('scaffold')
    .description('Generate a blank kody project')
    .action(_opt =>
      __awaiter(void 0, void 0, void 0, function* () {
        // await $`schematics @noqta/kodyfire:run --name ${_opt.name} --dry-run`;
        try {
          action(
            Object.assign(Object.assign({}, _opt), {
              schematic: 'scaffold',
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
