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
const { Command } = require('commander');
const action_1 = require("./action");
module.exports = (program) => {
    program
        .command('install')
        .alias('i')
        .argument('[kody]', 'The kody package name you want to install. You can pas the package name without the `-kodyfire` suffix.')
        .description('Prompt user to choose to install')
        .action((kody, _opt) => __awaiter(void 0, void 0, void 0, function* () {
        return yield action_1.Action.execute(kody);
    }));
};
//# sourceMappingURL=index.js.map