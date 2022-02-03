"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KodyWorkflow = void 0;
const __1 = require("..");
class KodyWorkflow {
    constructor() {
        this.getKody = (_name) => __awaiter(this, void 0, void 0, function* () {
            const packages = yield __1.Package.getInstalledKodies();
            console.log(packages);
            return packages.find((kody) => kody.id === _name);
        });
        this.handleKodyNotFound = (name) => {
            console.log(`Kody ${name} not found.`);
        };
        this.handleSourceNotValid = (errors) => {
            console.log(`Kody source not valid.`);
            console.log(errors);
        };
        this.handleKodySuccess = (name) => {
            console.log(`Kody ${name} success.`);
        };
    }
}
exports.KodyWorkflow = KodyWorkflow;
//# sourceMappingURL=workflow.js.map