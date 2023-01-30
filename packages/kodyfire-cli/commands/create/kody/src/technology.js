'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
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
exports.Technology = void 0;
const kodyfire_core_1 = require('kodyfire-core');
const assets = __importStar(require('./assets.json'));
/* @ts-ignore */
const classes = __importStar(require('.'));
class Technology {
  constructor(params, _assets = assets) {
    try {
      this.id = params.id;
      this.name = params.name;
      this.version = params.version;
      this.actions = new kodyfire_core_1.ActionList();
      this.concepts = new Map();
      this.rootDir = _assets.rootDir;
      this.assets = _assets;
      this.params = params;
      // add dynamic property for technology
      for (const concept of this.assets.concepts) {
        const className = (0, kodyfire_core_1.capitalize)(concept.name);
        this.concepts.set(concept.name, new classes[className](concept, this));
      }
    } catch (error) {
      console.log(error);
    }
  }
  //@todo: refactor. exists in kodyfire-core technology.ts
  prepareConcept(dependency, conceptName, preparedConcept) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      const { schema } =
        yield ((_a = `${process.cwd()}/node_modules/${dependency}`),
        Promise.resolve().then(() => __importStar(require(_a))));
      const conceptSchema = schema.properties[conceptName];
      const requirements = conceptSchema.items.required;
      for (const requirement of requirements) {
        // if(!Object.prototype.hasOwnProperty.call(conceptSchema, requirement)) {
        //   throw new Error(`${conceptName} requires ${requirement}`);
        // }
        preparedConcept = Object.assign(Object.assign({}, preparedConcept), {
          [requirement]:
            conceptSchema.items.properties[requirement].default || '',
        });
      }
      return preparedConcept;
    });
  }
}
exports.Technology = Technology;
//# sourceMappingURL=technology.js.map
