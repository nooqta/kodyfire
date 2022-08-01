const { Command } = require('commander');
import { Action } from './action';

module.exports = (program: typeof Command) => {
  program
    .command('generate')
    .alias('g')
    .description('Prompt assistant to quickly generate an artifact')
    .argument('[kody]', 'The name of the kody to use')
    .argument('[concept]', 'The concept you want to generate', 'concept')
    .option('-m,--multiple', 'Generate multiple artifacts')
    .option('-p,--persist', 'Persist the generated artifact')
    .action(async (kody: string, concept: string, _opt: any) => {
      return await Action.execute({ kody, concept, ..._opt });
    });
};
