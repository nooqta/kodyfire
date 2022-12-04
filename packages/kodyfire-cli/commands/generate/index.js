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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Command } = require('commander');
const chalk_1 = __importDefault(require("chalk"));
const action_1 = require("./action");
module.exports = (program) => {
    program
        .command('generate')
        .alias('g')
        .description('Prompt assistant to quickly generate an artifact')
        .argument('[kody]', 'The name of the kody to use or the kody and the concept separated by a colon (e.g. kody:concept)\n')
        .argument('[concept]', 'The concept you want to generate', 'concept')
        .argument('[name]', 'The name of the artifact to generate (optional)')
        .option('-i,--include <includes>', `Comma separated list of concepts to include. (e.g. -i concept1,concept2).\nTo list available concepts use the list command (e.g. ${chalk_1.default.dim('kody list kodyname')})`)
        .option('-m,--multiple', 'Generate multiple artifacts')
        .option('-p,--persist', 'Persist the generated artifact')
        .action((kody, concept, name, _opt) => __awaiter(void 0, void 0, void 0, function* () {
        _opt.includes = _opt.include ? _opt.include.split(',') : [];
        return yield action_1.Action.execute(Object.assign({ kody, concept, name }, _opt));
    }));
};
//# sourceMappingURL=index.js.map