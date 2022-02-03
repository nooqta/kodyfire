"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Technology = exports.Kody = void 0;
var kody_1 = require("./kody");
Object.defineProperty(exports, "Kody", { enumerable: true, get: function () { return kody_1.Kody; } });
__exportStar(require("./src/parser"), exports);
__exportStar(require("./src/generator"), exports);
var technology_1 = require("./src/technology");
Object.defineProperty(exports, "Technology", { enumerable: true, get: function () { return technology_1.Technology; } });
//# sourceMappingURL=index.js.map