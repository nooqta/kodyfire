import { strings } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { join } from 'path';
import { Observable } from 'rxjs';

import { Package, Runner } from 'kodyfire-core';
import { KodyfireOptionsSchema } from './schema';
const boxen = require('boxen');
const chalk = require('chalk');

export function run(_options: KodyfireOptionsSchema): any {
  return async (tree: Tree, _context: SchematicContext) => {
    // source is passed statically for developing purposes
    const fileName = join(process.cwd(), 'data-html.json');
    const runner = new Runner({
      ..._options,
      getKody,
      handleKodyNotFound,
      handleSourceNotValid,
      handleKodySuccess,
      fileName,
    });
    tree = await runner.run(_options);
    // finish process
    return tree;
  };
}

export function scaffold(_options: any): Observable<Rule> | Rule {
  return async (_tree: Tree, _context: SchematicContext) => {
    const schema = {
      name: _options.name,
      technology: _options.type,
      version: '1.0.0',
    };

    const templateSource = apply(url('./templates/blank'), [
      applyTemplates({
        ...strings,
        ...schema,
      }),
      move(`./${_options.name}`),
    ]);
    const rule = chain([mergeWith(templateSource)]);
    const fs = require('fs-extra');
    fs.move(
      `${_options.currentPath}/${_options.name}`,
      `${process.cwd()}/${_options.name}`,
      { overwrite: true },
      (err: any) => {
        if (err) return console.error(err);
        console.log(chalk.green('🙌 kody done! '));
      }
    );
    return rule;
  };
}
async function getKody(name: string): Promise<any> {
  const packages = await Package.getInstalledKodies();
  return packages.find((cody: any) => cody.id == name);
}

function handleKodyNotFound(name: string) {
  const message = `🚨 ${chalk.bold(
    chalk.yellow(name)
  )} is not a registered kody.`;
  console.log(
    boxen(message, {
      padding: 1,
      margin: 1,
      align: 'center',
      borderColor: 'red',
      borderStyle: 'round',
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
