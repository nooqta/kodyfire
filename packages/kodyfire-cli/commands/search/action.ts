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
    const { keywords } = _args;
    try {
      // @todo: use event emitter to listen to the event of the runner
      ee.on('message', (text: string) => {
        console.log(text);
      });
      // We check if package.json exists
      const kodies = (await this.getKodies(keywords)).filter((kody:any) => kody.name.includes('-kodyfire'));

      if (kodies.length == 0) {
        const kody = chalk.greenBright(chalk.bold('kody'));
        const message = `😞 No ${kody} found.\nYou're a Ninja 🚀🚀🚀`;
        this.displayMessage(message);
      } else {
        this.displaySearchResults(kodies);
      }
    } catch (error: any) {
      this.displayMessage(error.message);
    }
  }
// @ts-ignore
  public static async getKodies(keywords: string[]) {
    let kodies = JSON.parse((await $`npm search kodyfire -j -l`).toString())
    if(keywords.length > 0) 
    kodies = kodies.filter((kody: any) => (keywords.includes(kody.name) || keywords.find(key => kody.description.toLowerCase().search(key.toLowerCase()) > -1) && kody.name.includes('-kodyfire')))
    return kodies;
  }
}
export const action = async (_args: any) => {
  try {
    Action.execute(_args);
  } catch (error: any) {
    console.log(error);
    Action.displayMessage(error.message);
  }
};
