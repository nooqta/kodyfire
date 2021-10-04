import { strings } from "@angular-devkit/core";
import {  apply, applyTemplates, chain, mergeWith, move, Rule, SchematicContext, Tree, url } from "@angular-devkit/schematics";
import { join } from "path";

import { IParser, IValidator } from "../lib";
import * as repo from "./../../kodyfire.json";
import { KodyfireOptionsSchema } from './schema';
const boxen = require("boxen");
const chalk = require("chalk");

export function run(_options: KodyfireOptionsSchema) {
  return async (tree: Tree, _context: SchematicContext) => {
    // get package name
    const { name } = _options;

    const currentCody: any = repo.templates.find(
      (cody: any) => cody.id == name
    );
    
    // stop processing if package found
    if (typeof currentCody == 'undefined') {
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

    // require package
    const m =  await import(currentCody.name);
        let validator: IValidator = new m.Validator();
        let parser: IParser = new m.Parser(validator);
        let kody = new m.Kody(parser, currentCody, tree);
        // parse source
        // source is passed statically for developing purposes
        const fileName = join(process.cwd(),'data-laravel.json');
        let content = kody.read(fileName);
        const data = kody.parse(content);
        /// check if source is valid
        if (!data) {
          console.log(kody.errors);
          process.exit();
        }
        // generate artifacts
        tree = kody.generate(kody.data, tree);
        console.log(chalk.green('🙌 kody done! '));
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
