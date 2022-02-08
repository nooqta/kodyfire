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
exports.action = void 0;
const chalk = require("chalk");
const fs = require("fs");
const { join } = require("path");
const kodyfire_core_1 = require("kodyfire-core");
const worklfow_1 = require("../../src/kodyfire/lib/cli/worklfow");
const { Command } = require("commander");
function action(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (typeof args.source === 'undefined') {
                args.source = join(process.cwd(), "kody.json");
            }
            if (!fs.existsSync(args.source)) {
                console.log(chalk.red(`${chalk.bgRed(chalk.white(args.source))} not found. Please provide the source file to be used.`));
                process.exit(1);
            }
            args.name = JSON.parse(fs.readFileSync(args.source).toString()).name || '';
            const { source } = args;
            let workflow = new worklfow_1.CliWorkflow(source);
            let runner = new kodyfire_core_1.Runner(Object.assign(Object.assign({}, args), workflow));
            const output = yield runner.run(args);
            // finish process
            return output;
        }
        catch (error) {
            console.log(chalk.red(error.stack || error.message));
            process.exit(1);
        }
    });
}
exports.action = action;
const command = (program) => {
    program
        .command("run")
        .description("Generate a digital artifact based on the selected technology")
        .option("-s,--source <source>", "Source file to be used as the schema for the generator (default: kody.json)", "kody.json")
        .action((_opt) => __awaiter(void 0, void 0, void 0, function* () {
        // await $`schematics @noqta/kodyfire:run --name ${_opt.name} --dry-run`;
        try {
            action(Object.assign(Object.assign({}, _opt), { schematic: "run", dryRun: false }));
        }
        catch (error) {
            console.log(error);
        }
    }));
};
exports.default = command;
//# sourceMappingURL=index.js.map