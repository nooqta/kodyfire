const { Command } = require('commander');
import { Action } from './action';

module.exports = (program: typeof Command) => {
  program
    .command('generate')
    .alias('g')
    .description('Prompt assistant to quickly generate an artifact')
    .option('-m,--multiple', 'Generate multiple artifacts')
    .option('-p,--persist', 'Persist the generated artifact')
    .action(async (_opt: any) => {
      return await Action.execute(_opt);
    });
};
