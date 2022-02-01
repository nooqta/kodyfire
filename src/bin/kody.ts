#!/usr/bin/env node
"use strict";

import { Runner, Template } from "kodyfire-core";
import { CliWorkflow } from "../kodyfire/lib/cli/worklfow";
// import { $ } from "zx";
const chalk = require("chalk");
const { Command } = require("commander");
const program = new Command();
const fs = require("fs");
const { join } = require("path");
var Table = require("cli-table");
const boxen = require("boxen");

var EventEmitter = require('events')
var ee = new EventEmitter()

export async function execute(args: any): Promise<0 | 1> {
  try {
    // source is passed statically for developing purposes
    const input = join(process.cwd(),'data-html.json');
    let workflow  = new CliWorkflow(input);
    let runner = new Runner({...args, ...workflow});
    const output = await runner.run(args);
      // finish process
      return output;
  } catch (error) {
    console.log(chalk.red(error.stack || error.message));
    process.exit(1);
  }
}

const list = () => {
  const fileName = join(process.cwd(), "kodyfire.json");
  ee.on('message', (text: string) => {
    console.log(text)
  })
  let fileContent = fs.readFileSync(fileName);
  let content = JSON.parse(fileContent);
  if (content.templates.length == 0) {
    const kody = chalk.greenBright(chalk.bold("kody"));
    const message = `😞 No ${kody} installed yet.\nInstall a ${kody} to become a Ninja 🚀🚀🚀`;
    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        align: "center",
        borderColor: "yellow",
        borderStyle: "round",
      })
    );
  } else {
    var table = new Table({
      head: ["id", "name", "type", "version", "enabled"],
      colWidths: [21, 21, 21, 7, 10],
      style: {
        "padding-left": 1,
        "padding-right": 1,
        head: ["yellow"],
      },
    });



    content.templates.forEach(
      (template: Template) => {
        table.push([
          template.id,
          template.name,
          template.type,
          template.version,
          template.enabled
            ? chalk.green(template.enabled)
            : chalk.red(template.enabled),
        ]);
      }
    );
    console.log(table.toString());
  }
};


program
  .command("run")
  .description("Generate a digital artifact based on the selected technology")
  .option(
    "-n,--name <name>",
    "Name of technology (default is Laravel)",
    "laravel"
  )
  .action(async (_opt: { name: any }) => {
    // await $`schematics @noqta/kodyfire:run --name ${_opt.name} --dry-run`;
    try {
      execute({ ..._opt, schematic: "run", dryRun: false });
    } catch (error) {
      console.log(error);
    }
  });

program
  .command("scaffold")
  .description("Generate a blank kody project")

  .action(async (_opt: { name: any }) => {
    // await $`schematics @noqta/kodyfire:run --name ${_opt.name} --dry-run`;
    try {
      execute({ ..._opt, schematic: "scaffold", dryRun: false });
    } catch (error) {
      console.log(error);
    }
  });

program
  .command("list")
  .alias("ls")
  .description("list available technologies")
  .action(async (_opt: any) => {
    return list();
  });
program.parse(process.argv);
