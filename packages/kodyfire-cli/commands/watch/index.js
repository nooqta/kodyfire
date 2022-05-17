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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const fs_1 = __importDefault(require('fs'));
const zx_1 = require('zx');
const chalk = require('chalk');
const watchFile = (source, kodyName, build = false) =>
  __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Watching for file changes on ${source} for kody ${kodyName}`);
    fs_1.default.watchFile(source, (_event, filename) =>
      __awaiter(void 0, void 0, void 0, function* () {
        if (filename) {
          if (build) {
            console.log(`Building ${kodyName}`);
            // build ts files
            yield zx_1.$`npm run build`;
          }
          console.log(`${source} file Changed, running kody ${kodyName}`);
          yield zx_1.$`kody run ${kodyName} -s ${source}`;
        }
      })
    );
  });
const action = args =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (typeof args.source === 'undefined') {
      args.source = join(process.cwd(), 'kody.json');
    }
    if (!fs_1.default.existsSync(args.source)) {
      console.log(
        chalk.red(
          `${chalk.bgRed(
            chalk.white(args.source)
          )} not found. Please provide the source file to be used.`
        )
      );
      process.exit(1);
    }
    const { source, build } = args;
    const schema = JSON.parse(fs_1.default.readFileSync(source).toString());
    if (schema.sources) {
      for (const item of schema.sources) {
        yield watchFile(item.filename, item.name, build);
      }
    } else {
      yield watchFile(source, schema.name, build);
    }
  });
module.exports = program => {
  program
    .command('watch')
    .alias('w')
    .option(
      '-s,--source <source>',
      'Source file to be used as the schema for the generator (default: kody.json)',
      'kody.json'
    )
    .option('-b, --build', 'Build source files (default: false)', false)
    .description(chalk.red('Watch for file changes and run kody'))
    .action(_opt =>
      __awaiter(void 0, void 0, void 0, function* () {
        return yield action(_opt);
      })
    );
};
//# sourceMappingURL=index.js.map
