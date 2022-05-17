import chalk from 'chalk';
const fs = require('fs');
const { join } = require('path');
import { $, cd } from 'zx';

export default async (args: any) => {
  // @todo: Refactor used by watch command
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
  const schema = JSON.parse(fs.readFileSync(args.source));
  const { scripts = [] } = schema;
  if (scripts.length === 0) return;
  // We access rootDir if it was specified
  const currentDir = process.cwd();
  const rootDir = schema.rootDir || currentDir;
  cd(rootDir);
  for (const script of scripts) {
    console.log(`running script ${script}`);
    await $`${script}`;
  }
  cd(currentDir);
};
