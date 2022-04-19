'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Concept = void 0;
const kodyfire_core_1 = require('kodyfire-core');
class Concept {
  constructor(concept, technology) {
    var _a, _b, _c;
    this.source =
      (_a = concept.source) !== null && _a !== void 0
        ? _a
        : kodyfire_core_1.Source.Template;
    this.outputDir =
      (_b = concept.outputDir) !== null && _b !== void 0 ? _b : '';
    this.name = (_c = concept.name) !== null && _c !== void 0 ? _c : '';
    this.template = concept.template;
    this.technology = technology;
  }
  generate(_data) {
    throw new Error('Method should be implemented in child.');
  }
  underscorize(word) {
    return word.replace(/[A-Z]/g, function (char, index) {
      return (index !== 0 ? '_' : '') + char.toLowerCase();
    });
  }
}
exports.Concept = Concept;
//# sourceMappingURL=concept.js.map
