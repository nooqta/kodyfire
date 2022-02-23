import { KodyWorkflow } from 'kodyfire-core';
const boxen = require('boxen');
const chalk = require('chalk');
export class CliWorkflow extends KodyWorkflow {
  constructor(input: any) {
    super();
    this.input = input;
  }

  handleKodyNotFound = (name: string) => {
    const message = `🚨 ${chalk.bold(
      chalk.yellow(name)
    )} is not a registered kody.`;
    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        align: 'center',
        borderColor: 'red',
        borderStyle: 'round',
      })
    );
    process.exit();
  };

  handleSourceNotValid = (errors: any) => {
    console.log(errors);
    process.exit();
  };

  handleKodySuccess = () => {
    console.log(chalk.green('🙌 kody done! '));
  };
}
