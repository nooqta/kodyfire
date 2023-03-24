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
// @ts-nocheck
const { Command } = require('commander');
const action_1 = require("./action");
module.exports = (program) => {
    program
        .command('prompt')
        .alias('ai')
        .description('AI powered prompt assistant to quickly generate an artifact')
        .argument('[prompt...]', 'This prompt to be used to generate the artifact. You can use the prompt command to create a prompt')
        // use audio recorder speech to text to create a prompt
        .option('-r, --record', 'Record a prompt using your microphone')
        .action((prompt, opts) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(opts);
        return yield action_1.Action.execute(prompt.join(' ') || '', opts);
    }));
};
//# sourceMappingURL=index.js.map