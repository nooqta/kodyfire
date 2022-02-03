#!/usr/bin/env node
"use strict";
import { NodeWorkflow } from "@angular-devkit/schematics/tools";
import { UnsuccessfulWorkflowExecution } from "@angular-devkit/schematics";
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
const pack = require(join(process.cwd(), "kodyfire.json"));
var EventEmitter = require('events')
var ee = new EventEmitter()


function parseSchematicName(_arg: any): {
  collection: string;
  schematic: string;
} {
  // All schematics are local to kody
  const collectionName = "kodyfire";
  let collection = pack.name == collectionName? collectionName : ".";

  let schematic = _arg.schematic;

  return { collection, schematic };
}

export async function execute(args: any): Promise<0 | 1> {
  const { collection: collectionName, schematic: schematicName } =
    parseSchematicName(args);
    args.input = join(process.cwd(),'data-html.json');
  const root = process.cwd();
  // const dryRun = args.dryRun as boolean;
  const dryRun = false;
  const workflow = new NodeWorkflow(root, {
    resolvePaths: [root, join(root, "src")],
    dryRun: dryRun,
    schemaValidation: true,
  });

  try {
    await workflow
      .execute({
        collection: collectionName,
        schematic: schematicName,
        options: args,
      })
      .toPromise();

    return 0;
  } catch (err) {
    if (err instanceof UnsuccessfulWorkflowExecution) {
      console.log(chalk.red("Kody failed. See above."));
    } else {
      console.log(chalk.red(err.stack || err.message));
    }

    return 1;
  }
}

export async function run(args: any): Promise<0 | 1> {
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
export const isPackageInstalled = (_name: string) => {
  try {
    
		return (
      true
		);
	} catch {
		return false;
	}
}

export const startWebServer = () => {
  const isInstalled = isPackageInstalled('kodyfire-builder');
  let message = "Starting web server...";
  if (!isInstalled) {
    message = `😞 Kodyfire server not installed yet.\nInstall the web builder to quickly generate your schema 🚀🚀🚀\n
    npm install -g kodyfire-builder`;
  } 
    // const kody = chalk.greenBright(chalk.bold("kody"));
    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        align: "center",
        borderColor: "yellow",
        borderStyle: "round",
      })
    );
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
      run({ ..._opt, schematic: "run", dryRun: false });
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

program
  .command("start")
  .alias("serve")
  .alias("builder")
  .description("Build your schema on the fly using web interface")
  .action(async (_opt: any) => {
    return startWebServer();
  });
program.parse(process.argv);
