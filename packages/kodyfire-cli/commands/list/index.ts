import { Option } from 'commander';
import { action } from './action';
const { Command } = require('commander');

module.exports = (program: typeof Command) => {
  program
    .command('list')
    .alias('ls')
    .description('list installed kodies within your current project.')
    .argument(
      '[kodyName]',
      'List details of a kody by passing the kody name as an argument'
    )
    .addOption(new Option('-s, --summary <details>', 'List kody details such as `template` names and `concepts`.').choices(['concepts', 'templates', 'overwrites']).default('concepts'))
    .action(async (kodyName: any, opts: any) => {
      return action({ technology: kodyName, ...opts });
    });
};
