import chalk from 'chalk';
const { Command } = require('commander');

const action = async (args: any) => {
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
  const content = JSON.parse(fs.readFileSync(args.source));
  const { scripts = [] } = content;
  if (scripts.length === 0) {
    console.log(
      chalk.red(`no scripts found. Please add scripts array to your kody.`)
    );
    process.exit(1);
  }
  console.log(scripts);
};

module.exports = (program: typeof Command) => {
  program
    .command('run-script')
    .alias('rs')
    .description('run scripts')
    .action(async (_opt: any) => {
      return action(_opt);
    });
};
