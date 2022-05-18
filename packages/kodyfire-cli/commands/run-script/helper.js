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
const chalk_1 = __importDefault(require('chalk'));
const fs = require('fs');
const { join } = require('path');
const zx_1 = require('zx');
exports.default = args =>
  __awaiter(void 0, void 0, void 0, function* () {
    // @todo: Refactor used by watch command
    if (typeof args.source === 'undefined') {
      args.source = join(process.cwd(), 'kody.json');
    }
    if (!fs.existsSync(args.source)) {
      console.log(
        chalk_1.default.red(
          `${chalk_1.default.bgRed(
            chalk_1.default.white(args.source)
          )} not found. Please provide the source file to be used.`
        )
      );
      process.exit(1);
    }
    const schema = JSON.parse(fs.readFileSync(args.source));
    const { scripts = [] } = schema;
    if (scripts.length === 0) return;
    // We access rootDir if it was specified
    const currentDir = process.cwd();
    const rootDir = schema.rootDir || currentDir;
    (0, zx_1.cd)(rootDir);
    for (const script of scripts) {
      console.log(`running script ${script}`);
      yield (0, zx_1.$)`${script}`;
    }
    (0, zx_1.cd)(currentDir);
  });
//# sourceMappingURL=helper.js.map
