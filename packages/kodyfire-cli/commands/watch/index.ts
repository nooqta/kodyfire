import fs from 'fs';
import { $ } from 'zx';
const chalk = require('chalk');
const { Command } = require('commander');
const { join } = require('path');

const watchFile = async (
  source: fs.PathLike,
  kodyName: string,
  build = false
) => {
  console.log(`Watching for file changes on ${source} for kody ${kodyName}`);
  fs.watchFile(source, async (_event, filename) => {
    if (filename) {
      if (build) {
        console.log(`Building ${kodyName}`);
        // build ts files
        await $`npm run build`;
      }
      console.log(`${source} file Changed, running kody ${kodyName}`);
      await $`kody run ${kodyName} -s ${source}`;
    }
  });
};

const action = async (args: any) => {
  if (typeof args.source === 'undefined') {
    args.source = join(process.cwd(), 'kody.json');
  }

  if (!fs.existsSync(args.source)) {
    console.log(
      chalk.red(
        `${chalk.bgRed(
          chalk.white(args.source)
        )} not found. Please provide the source file to be used.`
      )
    );
    process.exit(1);
  }
  const { source, build } = args;
  const schema = JSON.parse(fs.readFileSync(source).toString());
  if (schema.sources) {
    for (const item of schema.sources) {
      await watchFile(item.filename, item.name, build);
    }
  } else {
    await watchFile(source, schema.name, build);
  }
};

module.exports = (program: typeof Command) => {
  program
    .command('watch')
    .alias('w')
    .option(
      '-s,--source <source>',
      'Source file to be used as the schema for the generator (default: kody.json)',
      'kody.json'
    )
    .option('-b, --build', 'Build source files (default: false)', false)
    .description(chalk.green('Watch for file changes and run kody'))
    .action(async (_opt: any) => {
      return await action(_opt);
    });
};
