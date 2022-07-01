const chalk = require('chalk');
const fs = require('fs');
const { join } = require('path');
import { Runner, Yaml } from 'kodyfire-core';
import { CliWorkflow } from '../../src/lib/cli/worklfow';
import { Command } from 'commander';

async function action(args: any): Promise<0 | 1> {
  try {
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
    // if
    const content = JSON.parse(fs.readFileSync(args.source).toString());
    if (!content.sources) {
      console.log(chalk.red('No sources found in kody.json'));
      process.exit(1);
    }
    for (const source of content.sources) {
      args.name = getKodyName(args.source);
      args.source = join(process.cwd(), source.filename);
      const workflow = new CliWorkflow(source.filename);
      const runner = new Runner({ ...args, ...workflow });
      await runner.run(args);
    }
    // finish process
    return 0;
  } catch (error: any) {
    console.log(chalk.red(error.stack || error.message));
    process.exit(1);
  }
}
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
module.exports = (program: Command) => {
  program
    .command('batch')
    .description('Generate multiple digital artifact')
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
