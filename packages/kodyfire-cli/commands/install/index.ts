const { Command } = require('commander');
import { Action } from './action';

module.exports = (program: typeof Command) => {
  program
    .command('install')
    .alias('i')
    .description('Prompt user to choose project to install')
    .action(async (_opt: any) => {
      return await Action.execute();
    });
};
