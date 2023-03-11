const { Command } = require('commander');
import { Action } from './action';

module.exports = (program: typeof Command) => {
  program
    .command('install')
    .alias('i')
    .argument('[kody]', 'The kody package name you want to install. You can pas the package name without the `-kodyfire` suffix.')
    .description('Prompt user to choose to install')
    .action(async (kody: string, _opt: any) => {
      return await Action.execute(kody);
    });
};
