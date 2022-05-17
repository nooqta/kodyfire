const { Command } = require('commander');
import runScript from './helper';

const action = async (args: any) => {
  await runScript(args);
};

module.exports = (program: typeof Command) => {
  program
    .command('run-script')
    .alias('rs')
    .description('run scripts')
    .action(async (_opt: any) => {
      return await action(_opt);
    });
};

export default action;
