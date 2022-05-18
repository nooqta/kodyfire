'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
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
      args.name =
        JSON.parse(fs.readFileSync(args.source).toString()).name || '';
      const { source } = args;
      let { condition = false } = args;
      // @todo Check if file exists
      if (condition) {
        condition = yield Promise.resolve().then(() =>
          __importStar(require(join(process.cwd(), condition)))
        );
      }
      const workflow = new worklfow_1.CliWorkflow(source);
      const runner = new kodyfire_core_1.Runner(
        Object.assign(Object.assign({}, args), workflow)
      );
      let output = yield runner.run(args);
      while (yield condition) {
        output = yield runner.run(args);
      }
      // finish process
      return output;
    } catch (error) {
      console.log(chalk.red(error.stack || error.message));
      process.exit(1);
    }
  });
}
module.exports = program => {
  program
    .command('live')
    .alias('∞')
    .description('keeps running a kody based on a condition')
    .option(
      '-s,--source <source>',
      'Source file to be used as the schema for the generator (default: kody.json)',
      'kody.json'
    )
    .option(
      '-c,--condition <condition>',
      'condition file to be used as source to decide when to stop running a kody (default: false)',
      false
    )
    .action(_opt =>
      __awaiter(void 0, void 0, void 0, function* () {
        try {
          action(_opt);
        } catch (error) {
          console.log(error);
        }
      })
    );
};
//# sourceMappingURL=index.js.map
