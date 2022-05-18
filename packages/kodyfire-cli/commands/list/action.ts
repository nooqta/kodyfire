import { Package, Template } from 'kodyfire-core';
import fs from 'fs';
const chalk = require('chalk');
const boxen = require('boxen');
const Table = require('cli-table');
const EventEmitter = require('events');
const ee = new EventEmitter();
export class Action {
  static displayMessage(message: string) {
    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        align: 'center',
        borderColor: 'yellow',
        borderStyle: 'round',
      })
    );
  }
  static displayKodies(kodies: any[]) {
    const table = new Table({
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
  static async execute() {
    try {
      // We check if package.json exists
      const kodies = fs.existsSync('package.json')
        ? await Package.getInstalledKodies()
        : [];
      // @todo: use event emitter to listen to the event of the runner
      ee.on('message', (text: string) => {
        console.log(text);
      });

      if (kodies.length == 0) {
        const kody = chalk.greenBright(chalk.bold('kody'));
        const message = `😞 No ${kody} installed yet.\nInstall a ${kody} to become a Ninja 🚀🚀🚀`;
        this.displayMessage(message);
      } else {
        this.displayKodies(kodies);
      }
    } catch (error) {
      this.displayMessage(error.message);
    }
  }
}
export const action = async () => {
  try {
    const kodies = await Package.getInstalledKodies();
    // @todo: use event emitter to listen to the event of the runner
    ee.on('message', (text: string) => {
      console.log(text);
    });

    if (kodies.length == 0) {
      const kody = chalk.greenBright(chalk.bold('kody'));
      const message = `😞 No ${kody} installed yet.\nInstall a ${kody} to become a Ninja 🚀🚀🚀`;
      Action.displayMessage(message);
    } else {
      Action.displayKodies(kodies);
    }
  } catch (error) {
    Action.displayMessage(error.message);
  }
};
