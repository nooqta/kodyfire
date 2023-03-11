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
const commander_1 = require("commander");
const action_1 = require("./action");
const { Command } = require('commander');
module.exports = (program) => {
    program
        .command('list')
        .alias('ls')
        .description('list installed kodies within your current project.')
        .argument('[kodyName]', 'List details of a kody by passing the kody name as an argument')
        .addOption(new commander_1.Option('-s, --summary <details>', 'List kody details such as `template` names and `concepts`.').choices(['concepts', 'templates', 'overwrites']).default('concepts'))
        .action((kodyName, opts) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, action_1.action)(Object.assign({ technology: kodyName }, opts));
    }));
};
//# sourceMappingURL=index.js.map