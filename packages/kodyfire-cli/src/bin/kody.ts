#!/usr/bin/env node
// @ts-nocheck
"use strict";
import { NodeWorkflow } from "@angular-devkit/schematics/tools";
import { UnsuccessfulWorkflowExecution } from "@angular-devkit/schematics";
import { Package, Runner, Template } from "kodyfire-core";
import { CliWorkflow } from "../kodyfire/lib/cli/worklfow";
import { $ } from "zx";
const chalk = require("chalk");
const { Command } = require("commander");
const program = new Command();
const fs = require("fs");
const { join } = require("path");
var Table = require("cli-table");
const boxen = require("boxen");
const pack = require(join(process.cwd(), "package.json"));
var EventEmitter = require('events')
var ee = new EventEmitter()
var glob = require( 'glob' )
  , path = require( 'path' );

function parseSchematicName(_arg: any): {
  collection: string;
  schematic: string;
} {
  // All schematics are local to kody
  const collectionName = "kodyfire-cli";
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
    $`npm run start:builder`
}

program.version('0.0.1', '-v, --version', 'output the current version');
glob.sync(`${path.resolve(process.mainModule.path, '../..')}/commands/**/*.js` ).forEach( function( file ) {
  const cmd = require(path.resolve( file )).default;
  cmd(program);
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

// program
//   .command("list")
//   .alias("ls")
//   .description("list available technologies")
//   .action(async (_opt: any) => {
//     return list();
//   });

program
  .command("start")
  .alias("serve")
  .alias("builder")
  .description("Build your schema on the fly using web interface")
  .action(async (_opt: any) => {
    return startWebServer();
  });
 
program.parse(process.argv);
