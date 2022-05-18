const chalk = require('chalk');
const fs = require('fs');
const { join } = require('path');
import { Runner } from 'kodyfire-core';
import { CliWorkflow } from '../../src/kodyfire/lib/cli/worklfow';
import { Command } from 'commander';
async function action(args: any): Promise<0 | 1> {
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

    args.name = JSON.parse(fs.readFileSync(args.source).toString()).name || '';
    const { source } = args;
    let { condition = false } = args;
    // @todo Check if file exists
    if (condition) {
      condition = await import(join(process.cwd(), condition));
    }
    const workflow = new CliWorkflow(source);
    const runner = new Runner({ ...args, ...workflow });
    let output = await runner.run(args);
    while (await condition) {
      output = await runner.run(args);
    }

    // finish process
    return output;
  } catch (error) {
    console.log(chalk.red(error.stack || error.message));
    process.exit(1);
  }
}
module.exports = (program: Command) => {
  program
    .command('live')
    .alias('∞')
    .description('keeps running a kody based on a condition')
    .option(
      '-s,--source <source>',
      'Source file to be used as the schema for the generator (default: kody.json)',
      'kody.json'
    )
    .option(
      '-c,--condition <condition>',
      'condition file to be used as source to decide when to stop running a kody (default: false)',
      false
    )
    .action(async (_opt: { name: any }) => {
      try {
        action(_opt);
      } catch (error) {
        console.log(error);
      }
    });
};
