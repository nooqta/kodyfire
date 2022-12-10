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
    .command('create')
    .description('Generate a new blank kody project')
    .argument('<name>', 'Project name')
    .argument('<technology>', 'Project technology')
    .option(
      '-tpl, --templateFolder <templateFolder>',
      'Template folder to use. Available templates: simple, basic. Default: simple',
      'simple'
    )
    .action(async (name: string, technology: string, _opt: any) => {
      // await $`schematics @noqta/kodyfire:run --name ${_opt.name} --dry-run`;
      try {
        action({ name, technology, ..._opt });
      } catch (error: any) {
        console.log(error);
      }
    });
};
