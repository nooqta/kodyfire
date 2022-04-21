import fs from 'fs';
import { $ } from 'zx';
const chalk = require('chalk');

const watchFile = async (source: fs.PathLike, kodyName: string) => {
  console.log(`Watching for file changes on ${source} for kody ${kodyName}`);
  fs.watchFile(source, async (_event, filename) => {
    if (filename) {
      console.log(`${source} file Changed, running kody ${kodyName}`);
      await $`kody run ${kodyName} -s ${source}`;
    }
  });
};

const action = async () => {
  const argv = process.argv.slice(3);
  const source = argv[0];
  if (!source) {
    console.log(chalk.red('No source file provided'));
    process.exit(1);
  }
  const schema = JSON.parse(fs.readFileSync(source).toString());
  if (schema.sources) {
    for (const item of schema.sources) {
      await watchFile(item.filename, item.name);
    }
  } else {
    await watchFile(source, schema.name);
  }
};

module.exports = (program: typeof Command) => {
  program
    .command('watch')
    .alias('w')
    .description(chalk.red('Watch for file changes and run kody'))
    .action(async (_opt: any) => {
      return await action();
    });
};
