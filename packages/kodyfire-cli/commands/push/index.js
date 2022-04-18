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
const node_fetch_1 = __importDefault(require('node-fetch'));
const kodyfire_core_1 = require('kodyfire-core');
const dotenv_1 = __importDefault(require('dotenv'));
dotenv_1.default.config();
const action = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    // Get current package info
    const packageInfo = yield kodyfire_core_1.Package.getPackageJson();
    console.log(packageInfo);
    const response = yield node_fetch_1.default(
      'https://api.github.com/repos/nooqta/kodyfire/labels'
    );
    const labels = yield response.json();
    const requestLabel = labels.find(
      label => label.name === 'request: listing'
    );
    const resp = yield node_fetch_1.default(
      `https://api.github.com/repos/nooqta/kodyfire/issues`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
        body: JSON.stringify({
          title: `Request to publish ${packageInfo.name}`,
          owner: 'nooqta',
          repo: 'kodyfire',
          body: `I would like to publish the following package: ${packageInfo.name} to the kody's repo.
               The repository url is [${packageInfo.repository.url}](${packageInfo.repository.url}) @anis-marrouchi.`,
          labels: [requestLabel.name],
        }),
      }
    );
    const issue = yield resp.json();
    console.log(issue);
  });
module.exports = program => {
  program
    .command('push')
    .description(
      'Push your own package to the registry. This will open an issue on Github with a request to include your package to the repository.'
    )
    .action(_opt =>
      __awaiter(void 0, void 0, void 0, function* () {
        return action();
      })
    );
};
//# sourceMappingURL=index.js.map
