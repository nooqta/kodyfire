const { Command } = require('commander');
import { action } from './action';

module.exports = (program: typeof Command) => {
  program
    .command('search')
    .alias('s')
    .argument('[keywords...]', 'search kodyfire packages using keywords')
    .description('search kodyfire packages from npm registry')
    .action(async (keywords: string[], _opt: any) => {
      _opt.keywords = keywords;
      return await action(_opt);
    });
};

export default action;
