import { Package, Template } from 'kodyfire-core';
const chalk = require('chalk');
const boxen = require('boxen');
var Table = require('cli-table');
var EventEmitter = require('events');
var ee = new EventEmitter();
const { Command } = require('commander');

const action = async () => {
  const kodies = await Package.getInstalledKodies();
  // @todo: use event emitter to listen to the event of the runner
  ee.on('message', (text: string) => {
    console.log(text);
  });

  if (kodies.length == 0) {
    const kody = chalk.greenBright(chalk.bold('kody'));
    const message = `😞 No ${kody} installed yet.\nInstall a ${kody} to become a Ninja 🚀🚀🚀`;
    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        align: 'center',
        borderColor: 'yellow',
        borderStyle: 'round',
      })
    );
  } else {
    var table = new Table({
      head: ['id', 'name', 'type', 'version'],
      colWidths: [31, 31, 21, 10],
      style: {
        'padding-left': 1,
        'padding-right': 1,
        head: ['yellow'],
      },
    });

    kodies.forEach((template: Template) => {
      table.push([template.id, template.name, template.type, template.version]);
    });
    console.log(table.toString());
  }
};

module.exports = (program: typeof Command) => {
  program
    .command('list')
    .alias('ls')
    .description('list available technologies')
    .action(async (_opt: any) => {
      return action();
    });
};
