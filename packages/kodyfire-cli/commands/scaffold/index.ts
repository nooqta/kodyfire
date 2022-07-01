'use strict';
import { Kody } from './kody/src';
import * as input from './data.json';

const { Command } = require('commander');

async function action(args: any): Promise<void> {
  const kody = new Kody(args);

  // parse source
  let data = kody.parse(input);
  data = { ...data, ...args };
  data.outputDir = `${data.name}-kodyfire`;
  const output = await kody.generate(data);
  return output;
}

module.exports = (program: typeof Command) => {
  program
    .command('scaffold')
    .description('Generate a new blank kody project')
    .option('-n,--name <name>', 'Project name')
    .option('-t, --technology <technology>', 'Project technology')
    .action(async (_opt: { name: any }) => {
      // await $`schematics @noqta/kodyfire:run --name ${_opt.name} --dry-run`;
      try {
        action({ ..._opt, schematic: 'scaffold', dryRun: false });
      } catch (error: any) {
        console.log(error);
      }
    });
};
