import { action } from './action';
const { Command } = require('commander');

module.exports = (program: typeof Command) => {
  program
    .command('list')
    .alias('ls')
    .description('list installed kodies within your current project.')
    .argument(
      '[kodyName]',
      'List all concepts of a kody by passing the kody name as an argument'
    )
    .action(async (kodyName: any) => {
      return action({ technology: kodyName });
    });
};
