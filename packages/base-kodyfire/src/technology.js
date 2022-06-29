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
Object.defineProperty(exports, '__esModule', { value: true });
exports.Technology = void 0;
const kodyfire_core_1 = require('kodyfire-core');
const assets = __importStar(require('./assets.json'));
/* @ts-ignore */
const classes = __importStar(require('.'));
class Technology {
  constructor(params) {
    try {
      this.id = params.id;
      this.name = params.name;
      this.version = params.version;
      this.actions = new kodyfire_core_1.ActionList();
      this.concepts = new Map();
      this.rootDir = assets.rootDir;
      this.assets = assets;
      // add dynamic property for technology
      for (const concept of this.assets.concepts) {
        this.concepts.set(
          concept.name,
          new classes[(0, kodyfire_core_1.capitalize)(concept.name)](
            concept,
            this
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}
exports.Technology = Technology;
//# sourceMappingURL=technology.js.map
