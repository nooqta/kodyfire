'use strict';
import { NodeWorkflow } from '@angular-devkit/schematics/tools';
import { UnsuccessfulWorkflowExecution } from '@angular-devkit/schematics';
const chalk = require('chalk');
const { Command } = require('commander');
const { join } = require('path');
const pack = require(join(process.cwd(), 'package.json'));

function parseSchematicName(_arg: any): {
  collection: string;
  schematic: string;
} {
  // All schematics are local to kody
  const collectionName = 'kodyfire-cli';
  const collection = pack.name == collectionName ? collectionName : '.';

  const schematic = _arg.schematic;

  return { collection, schematic };
}

async function action(args: any): Promise<0 | 1> {
  const { collection: collectionName, schematic: schematicName } =
    parseSchematicName(args);
  args.input = join(process.cwd(), 'data-html.json');
  const root = process.cwd();
  // const dryRun = args.dryRun as boolean;
  const dryRun = false;
  const workflow = new NodeWorkflow(root, {
    resolvePaths: [root, join(root, 'src')],
    dryRun: dryRun,
    schemaValidation: true,
  });

  try {
    await workflow
      .execute({
        collection: collectionName,
        schematic: schematicName,
        options: args,
      })
      .toPromise();

    return 0;
  } catch (err) {
    if (err instanceof UnsuccessfulWorkflowExecution) {
      console.log(chalk.red('Kody failed. See above.'));
    } else {
      console.log(chalk.red(err.stack || err.message));
    }

    return 1;
  }
}
module.exports = (program: typeof Command) => {
  program
    .command('scaffold')
    .description('Generate a blank kody project')

    .action(async (_opt: { name: any }) => {
      // await $`schematics @noqta/kodyfire:run --name ${_opt.name} --dry-run`;
      try {
        action({ ..._opt, schematic: 'scaffold', dryRun: false });
      } catch (error) {
        console.log(error);
      }
    });
};
