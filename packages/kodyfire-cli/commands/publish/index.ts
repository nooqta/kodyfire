// @ts-nocheck
import { existsSync } from 'fs';
import { Package } from 'kodyfire-core';
const chalk = require('chalk');
const boxen = require('boxen');
const { Command } = require('commander');
const { promises: fs } = require('fs');
const path = require('path');

const action = async (args: any) => {
  const { template } = args;
  const kodies = await Package.getInstalledKodies();

  if (kodies.length == 0) {
    const kody = chalk.greenBright(chalk.bold('kody'));
    const message = `😞 No ${kody} installed yet.\nInstall a ${kody} to become a Ninja 🚀🚀🚀`;
    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        align: 'center',
        borderColor: 'yellow',
        borderStyle: 'round',
      })
    );
  } else {
    const name = !args.name.includes('-kodyfire')
      ? `${args.name}-kodyfire`
      : args.name;
    if (kodies.find(kody => kody.name == name)) {
      // @todo: allow specifing target template path
      const target = `./.kody/${name}/templates`;
      // @todo: allow specifing source template paths
      const sources = [
        `./node_modules/${name}/src/concepts/templates`,
        `./node_modules/${name}/src/templates`,
      ];
      let templateFound = false;
      //for each source folder if it exists copy it to the target folder
      for (const source of sources) {
        if (template) {
          if (existsSync(`${source}/${template}`)) {
          await copyFileOrDir(`${source}/${template}`, `${target}`, `${template}`);
          templateFound = true;
          continue;
          }
        } else {
        if (existsSync(source)) {
            await copyDir(source, target);
          }
        }
      }
      if (template && !templateFound) {
        console.log(
          boxen(`😞 Template ${ chalk.yellow(chalk.bold(template))} not found`, {
            padding: 1,
            margin: 1,
            align: 'center',
            borderColor: 'yellow',
            borderStyle: 'round',
          })
        );
        process.exit(1);
      }
      //copy the assets.(json|js) file
      if (existsSync(`./node_modules/${name}/src/assets.js`)) {
        await fs.copyFile(
          `./node_modules/${name}/src/assets.js`,
          `./.kody/${name}/assets.js`
        );
      } else if (existsSync(`./node_modules/${name}/src/assets.json`)) {
        await fs.copyFile(
          `./node_modules/${name}/src/assets.json`,
          `./.kody/${name}/assets.json`
        );
      }

      //copy the schema.js file
      if (existsSync(`./node_modules/${name}/build/schema.js`)) {
        await fs.copyFile(
          `./node_modules/${name}/build/schema.js`,
          `./.kody/${name}/schema.js`
        );
      }
    } else {
      console.log('😞 Kody not found');
    }
  }
};

async function copyFileOrDir(src: any, dest: any, template: string) {
  await fs.mkdir(dest, { recursive: true });
  const destPath = path.join(dest, template);
  const stats = await fs.lstat(src);
  if (stats.isDirectory()) {
    await copyDir(src, destPath);
  } else {
    await fs.copyFile(src, destPath);
  }
}
async function copyDir(src: any, dest: any) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    entry.isDirectory()
      ? await copyDir(srcPath, destPath)
      : await fs.copyFile(srcPath, destPath);
  }
}

module.exports = (program: typeof Command) => {
  program
    .command('publish')
    .argument('<kody>', 'kody name to publish')
    .argument('[template]', 'The abreviated or full template name', false)
    .description(
      'Publish the templates of the kody along with the assets.json and schema.ts files'
    )
    .action(async (name: string, template, _opt: any) => {
      action({ name, template, ..._opt });
    });
};
