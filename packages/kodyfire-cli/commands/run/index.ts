const chalk = require('chalk');
const fs = require('fs');
const { join } = require('path');
import { Runner, Yaml } from 'kodyfire-core';
import { CliWorkflow } from '../../src/kodyfire/lib/cli/worklfow';
import { Command } from 'commander';
export async function action(args: any): Promise<0 | 1> {
  try {
    // @todo: Refactor used by watch command
    if (typeof args.source === 'undefined') {
      args.source = join(process.cwd(), 'kody.json');
    }
    if (!fs.existsSync(args.source)) {
      console.log(
        chalk.red(
          `${chalk.bgRed(
            chalk.white(args.source)
          )} not found. Please provide the source file to be used.`
        )
      );
      process.exit(1);
    }

    args.name = getKodyName(args.source);
    const { source } = args;
    const workflow = new CliWorkflow(source);
    const runner = new Runner({ ...args, ...workflow });
    const output = await runner.run(args);
    // finish process
    return output;
  } catch (error: any) {
    console.log(chalk.red(error.stack || error.message));
    process.exit(1);
  }
}
module.exports = (program: Command) => {
  program
    .command('run')
    .description('Generate a digital artifact based on the selected technology')
    .option(
      '-s,--source <source>',
      'Source file to be used as the schema for the generator (default: kody.json)',
      'kody.json'
    )
    .option('--templates-path', 'overrides the templates path')
    .action(async (_opt: { name: any }) => {
      // await $`schematics @noqta/kodyfire:run --name ${_opt.name} --dry-run`;
      try {
        action({ ..._opt, schematic: 'run', dryRun: false });
      } catch (error: any) {
        console.log(error);
      }
    });
};

// @todo: Refactor used by batch|live|? command?
function getKodyName(source: any): any {
  const extension = source.split('.').pop();
  if (extension === 'json') {
    return JSON.parse(fs.readFileSync(source).toString()).name || '';
  } else if (extension === 'yml') {
    return Yaml.resolve(source).name || '';
  }
  return '';
}
