const { Command } = require('commander');
import { Action } from './action';

module.exports = (program: typeof Command) => {
  program
    .command('init')
    .description('Initialize a new kodyfire project')
    .action(async (_opt: any) => {
      return await Action.execute();
    });
};
