const { Command } = require('commander');
import { action } from './action';

module.exports = (program: typeof Command) => {
  program
    .command('search')
    .alias('s')
    .description('search kodyfire packages from npm registry')
    .action(async (_opt: any) => {
      return await action(_opt);
    });
};

export default action;
