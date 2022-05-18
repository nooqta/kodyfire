import { $ } from 'zx';
const chalk = require('chalk');
const boxen = require('boxen');
const Table = require('cli-table');
const EventEmitter = require('events');
const ee = new EventEmitter();
$.verbose = false;
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
  static displaySearchResults(kodies: any[]) {
    const table = new Table({
      head: ['name', 'description', 'repository', 'author'],
      colWidths: [30, 31, 21, 20],
      style: {
        'padding-left': 1,
        'padding-right': 1,
        head: ['yellow'],
      },
    });

    kodies
      .filter(k => k.name.includes('-kodyfire'))
      .forEach((kody: any) => {
        table.push([
          kody.name,
          kody.description || kody.name,
          kody.links.npm,
          kody.publisher.username || kody.publisher.name,
        ]);
      });

    console.log(table.toString());
  }
  static async execute(_args: any) {
    try {
      // We check if package.json exists
      let kodies = JSON.parse((await $`npm search kodyfire -j -l`).toString());

      // @todo: use event emitter to listen to the event of the runner
      ee.on('message', (text: string) => {
        console.log(text);
      });
      kodies = await Promise.all(
        kodies.map(async (kody: any) => {
          const kodyData = await $`npm view ${kody.name} --json`;
          const kodyJson = JSON.parse(kodyData.toString());
          kody = { ...kody, version: kodyJson.version, ...kodyJson.kodyfire };
          return kody;
        })
      );
      console.log(kodies);
      if (kodies.length == 0) {
        const kody = chalk.greenBright(chalk.bold('kody'));
        const message = `😞 No ${kody} found.\nCheck your internet connection and try again.\nYou're a Ninja 🚀🚀🚀`;
        this.displayMessage(message);
      } else {
        this.displaySearchResults(kodies);
      }
    } catch (error) {
      this.displayMessage(error.message);
    }
  }
}
export const action = async (_args: any) => {
  try {
    Action.execute(_args);
  } catch (error) {
    console.log(error);
    Action.displayMessage(error.message);
  }
};
