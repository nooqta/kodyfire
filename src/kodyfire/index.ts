import { strings } from "@angular-devkit/core";
import {  apply, applyTemplates, chain, mergeWith, move, Rule, SchematicContext, Tree, url } from "@angular-devkit/schematics";
import { join } from "path";

import { Runner } from "kodyfire-core";
import * as repo from "./../../kodyfire.json";
import { KodyfireOptionsSchema } from './schema';
const boxen = require("boxen");
const chalk = require("chalk");

export function run(_options: KodyfireOptionsSchema) {
  return async (tree: Tree, _context: SchematicContext) => {
    // source is passed statically for developing purposes
    const fileName = join(process.cwd(),'data-html.json');
      let runner = new Runner({..._options, tree, getKody, handleKodyNotFound, handleSourceNotValid, handleKodySuccess, fileName});
      tree = await runner.run(_options);
        // finish process
        return tree;

  };
}

export function scaffold(_options: any): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const fileName = './data.json';
    const content = tree.read(fileName);
    const json = content?.toString()?? "{}";
        const templateSource = apply(
            url('./templates/blank'),
         [
            applyTemplates({
              ...strings,
              ...JSON.parse(json)
            }),
            move('./dist/my-kody'),
          ]);
          const rule = chain([mergeWith(templateSource)]);
          console.log(chalk.green('🙌 kody done! '));
          return rule;

  };
}
async function getKody(name: string): Promise<any> {
  return repo.templates.find(
    (cody: any) => cody.id == name
  );
}

function handleKodyNotFound(name: string) {
  const message = `🚨 ${chalk.bold(chalk.yellow(name))} is not a registered kody.`;
      console.log(
        boxen(message, {
          padding: 1,
          margin: 1,
          align: "center",
          borderColor: "red",
          borderStyle: "round",
        })
      );
      process.exit();
}

function handleSourceNotValid(errors: any) {
  console.log(errors);
  process.exit();
}

function handleKodySuccess() {
  console.log(chalk.green('🙌 kody done! '));
}

