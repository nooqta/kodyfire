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
const commander_1 = require("commander");
const action_1 = require("./action");
module.exports = (program) => {
    program
        .command('import')
        .alias('in')
        .addArgument(new commander_1.Argument('<kody>', 'The kody to use for the import'))
        .addArgument(new commander_1.Argument('<concepts>', 'A comma seperated list of concepts to generate from the source'))
        .description('Mass create artifacts from a source.')
        .addOption(new commander_1.Option('-t, --type <type>', 'The type of the artifacts to import')
        .default('yaml')
        .makeOptionMandatory()
        .choices(action_1.supportedTypes))
        .addOption(new commander_1.Option('-s, --source <source>', 'The source of the artifacts to import').makeOptionMandatory())
        .action((kody, concepts, _opt) => __awaiter(void 0, void 0, void 0, function* () {
        _opt.concepts = concepts.split(',').map((c) => c.trim());
        return yield action_1.Action.execute(Object.assign({ kody }, _opt));
    }));
};
//# sourceMappingURL=index.js.map