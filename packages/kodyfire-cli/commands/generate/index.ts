const { Command } = require('commander');
import chalk from 'chalk';
import { Action } from './action';
import { fs } from 'zx';

module.exports = (program: typeof Command) => {
  program
    .command('generate')
    .alias('g')
    .description('Prompt assistant to quickly generate an artifact')
    .argument(
      '[kody]',
      'The name of the kody to use or the kody and the concept separated by a colon (e.g. kody:concept)\n'
    )
    .argument('[concept]', 'The concept you want to generate')
    .option('-a, --args <args...>', 'A comman seperated list of concept arguments to generate the artifact(optional).key:value,key2:value2')
    .option(
      '-i,--include <includes>',
      `Comma separated list of concepts to include. (e.g. -i concept1,concept2).\nTo list available concepts use the list command (e.g. ${chalk.dim(
        'kody list kodyname'
      )})`
    )
    .option('-o,--overwrites <overwrites>', 'Overwrite the schema')
    .option('-m,--multiple', 'Generate multiple artifacts')
    .option('-p,--persist', 'Persist the generated artifact')
    .action(async (kody: string, concept: string, _opt: any) => {
      _opt.includes = _opt.include ? _opt.include.split(',') : [];
      // We check if the overwrites is a json file
      _opt.defaults = {};
      if(_opt.args && _opt.args.length > 0){
        _opt.args.map((arg:any) => {
          const [key, value] = arg.split(':');
          if(key && value)
          _opt[key] = value;
        })
      }
      if (_opt.overwrites) {
        // check if the file exists
        if (
          _opt.overwrites.endsWith('.json') &&
          fs.existsSync(_opt.overwrites)
        ) {
          // read the file and convert it to an object
          _opt.defaults = JSON.parse(fs.readFileSync(_opt.overwrites, 'utf8'));
        } else {
          // If not we check if the overwrites is a string of the form 'key1:value1,key2:value2' and convert it to an object
          // converts a string of the form 'key1:value1,key2:value2' to an object if the string is not empty
          _opt.defaults = _opt.overwrites
            .split(',')
            .reduce((acc: any, item: string) => {
              const [key, value] = item.split(':');
              acc[key] = value;
              return acc;
            }, {});
        }
      }
      
      return await Action.execute({ kody, concept, ..._opt });
    });
};
