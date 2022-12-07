const { Command } = require('commander');
import { Argument, Option } from 'commander';
import { Action, supportedTypes } from './action';

module.exports = (program: typeof Command) => {
  program
    .command('import')
    .alias('in')
    .addArgument(new Argument('<kody>', 'The kody to use for the import'))
    .addArgument(
      new Argument(
        '<concepts>',
        'A comma seperated list of concepts to generate from the source'
      )
    )
    .description('Mass create artifacts from a source.')
    .addOption(
      new Option('-t, --type <type>', 'The type of the artifacts to import')
        .default('yaml')
        .makeOptionMandatory()
        .choices(supportedTypes)
    )
    .addOption(
      new Option(
        '-s, --source <source>',
        'The source of the artifacts to import'
      ).makeOptionMandatory()
    )
    .action(async (kody: string, concepts: string, _opt: any) => {
      _opt.concepts = concepts.split(',').map((c: string) => c.trim());
      return await Action.execute({ kody, ..._opt });
    });
};
