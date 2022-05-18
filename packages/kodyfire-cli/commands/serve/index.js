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
exports.isPackageInstalled = void 0;
const boxen_1 = __importDefault(require('boxen'));
const zx_1 = require('zx');
const isPackageInstalled = _name => {
  try {
    return true;
  } catch (_a) {
    return false;
  }
};
exports.isPackageInstalled = isPackageInstalled;
const action = () => {
  const isInstalled = (0, exports.isPackageInstalled)('kodyfire-builder');
  let message = 'Starting web server...';
  if (!isInstalled) {
    message = `😞 Kodyfire server not installed yet.\nInstall the web builder to quickly generate your schema 🚀🚀🚀\n
      npm install -g kodyfire-builder`;
  }
  // const kody = chalk.greenBright(chalk.bold("kody"));
  console.log(
    (0, boxen_1.default)(message, {
      padding: 1,
      margin: 1,
      align: 'center',
      borderColor: 'yellow',
      borderStyle: 'round',
    })
  );
  (0, zx_1.$)`npm run start:builder`;
};
module.exports = program => {
  program
    .command('serve')
    .description('Build your schema on the fly using web interface')
    .action(_opt =>
      __awaiter(void 0, void 0, void 0, function* () {
        return action();
      })
    );
};
//# sourceMappingURL=index.js.map
