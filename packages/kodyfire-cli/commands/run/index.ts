const chalk = require("chalk");
const fs = require("fs");
const { join } = require("path");
import { Runner } from "kodyfire-core";
import { CliWorkflow } from "../../src/kodyfire/lib/cli/worklfow";
const { Command } = require("commander");

export async function action(args: any): Promise<0 | 1> {
    try {
      if(typeof args.source === 'undefined') {
        args.source = join(process.cwd(), "kody.json");
      }
      if (!fs.existsSync(args.source)) {
        console.log(chalk.red(`${chalk.bgRed(chalk.white(args.source))} not found. Please provide the source file to be used.`));
      process.exit(1);
      }
      args.name = JSON.parse(fs.readFileSync(args.source).toString()).name || '';
      const {source} = args;
      let workflow  = new CliWorkflow(source);
      let runner = new Runner({...args, ...workflow});
      const output = await runner.run(args);
        // finish process
        return output;
    } catch (error) {
      console.log(chalk.red(error.stack || error.message));
      process.exit(1);
    }
  }
const command = (program: typeof Command) => { 
    program
  .command("run")
  .description("Generate a digital artifact based on the selected technology")
  .option(
    "-s,--source <source>",
    "Source file to be used as the schema for the generator (default: kody.json)",
    "kody.json"
  )
  .action(async (_opt: { name: any }) => {
    // await $`schematics @noqta/kodyfire:run --name ${_opt.name} --dry-run`;
    try {
      action({ ..._opt, schematic: "run", dryRun: false });
    } catch (error) {
      console.log(error);
    }
  });
  }
  
  export default command;