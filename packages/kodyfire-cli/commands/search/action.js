"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = exports.Action = void 0;
const zx_1 = require("zx");
const chalk = require('chalk');
const boxen = require('boxen');
const Table = require('cli-table');
const EventEmitter = require('events');
const ee = new EventEmitter();
zx_1.$.verbose = false;
class Action {
    static displayMessage(message) {
        console.log(boxen(message, {
            padding: 1,
            margin: 1,
            align: 'center',
            borderColor: 'yellow',
            borderStyle: 'round',
        }));
    }
    static displaySearchResults(kodies) {
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
            .forEach((kody) => {
            table.push([
                kody.name,
                kody.description || kody.name,
                kody.links.npm,
                kody.publisher.username || kody.publisher.name,
            ]);
        });
        console.log(table.toString());
    }
    static execute(_args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @todo: use event emitter to listen to the event of the runner
                ee.on('message', (text) => {
                    console.log(text);
                });
                // We check if package.json exists
                const kodies = yield this.getKodies();
                console.log(kodies);
                if (kodies.length == 0) {
                    const kody = chalk.greenBright(chalk.bold('kody'));
                    const message = `😞 No ${kody} found.\nCheck your internet connection and try again.\nYou're a Ninja 🚀🚀🚀`;
                    this.displayMessage(message);
                }
                else {
                    this.displaySearchResults(kodies);
                }
            }
            catch (error) {
                this.displayMessage(error.message);
            }
        });
    }
    static getKodies() {
        return __awaiter(this, void 0, void 0, function* () {
            const kodies = JSON.parse((yield (0, zx_1.$) `npm search kodyfire -j -l`).toString());
            // kodies = await Promise.all(
            //   kodies.map(async (kody: any) => {
            //     const kodyData = await $`npm view ${kody.name} --json`;
            //     const kodyJson = JSON.parse(kodyData.toString());
            //     kody = { ...kody, version: kodyJson.version, ...kodyJson.kodyfire };
            //     return kody;
            //   })
            // );
            return kodies;
        });
    }
}
exports.Action = Action;
const action = (_args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Action.execute(_args);
    }
    catch (error) {
        console.log(error);
        Action.displayMessage(error.message);
    }
});
exports.action = action;
//# sourceMappingURL=action.js.map