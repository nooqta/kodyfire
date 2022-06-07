const { Command } = require('commander');
import { Action } from './action';

module.exports = (program: typeof Command) => {
  program
    .command('ride')
    .alias('↻')
    .description('Prompt assistant to help build your kody.json file')
    .action(async (_opt: any) => {
      return await Action.execute();
    });
};
