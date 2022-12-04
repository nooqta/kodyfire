const { Command } = require('commander');
import chalk from 'chalk';
import { Action } from './action';

module.exports = (program: typeof Command) => {
  program
    .command('generate')
    .alias('g')
    .description('Prompt assistant to quickly generate an artifact')
    .argument(
      '[kody]',
      'The name of the kody to use or the kody and the concept separated by a colon (e.g. kody:concept)\n'
    )
    .argument('[concept]', 'The concept you want to generate', 'concept')
    .argument('[name]', 'The name of the artifact to generate (optional)')
    .option(
      '-i,--include <includes>',
      `Comma separated list of concepts to include. (e.g. -i concept1,concept2).\nTo list available concepts use the list command (e.g. ${chalk.dim(
        'kody list kodyname'
      )})`
    )
    .option('-m,--multiple', 'Generate multiple artifacts')
    .option('-p,--persist', 'Persist the generated artifact')
    .action(async (kody: string, concept: string, name: string, _opt: any) => {
      _opt.includes = _opt.include ? _opt.include.split(',') : [];
      return await Action.execute({ kody, concept, name, ..._opt });
    });
};
