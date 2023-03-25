// @ts-nocheck
const { Command } = require('commander');
import chalk from 'chalk';
import { Action } from './action';
import { fs } from 'zx';

module.exports = (program: typeof Command) => {
  program
    .command('prompt')
    .alias('ai')
    .description('AI powered prompt assistant to quickly generate an artifact')
    .argument(
      '[prompt...]',
      'This prompt to be used to generate the artifact. You can use the prompt command to create a prompt'
    )
    // use audio recorder speech to text to create a prompt
    .option('-r, --record', 'Record a prompt using your microphone')
    .action(async (prompt, opts) => {
      return await Action.execute(prompt.join(' ')|| '', opts);
    });
};
