import { Package } from "kodyfire-core";
const chalk = require("chalk");
const boxen = require("boxen");
const { Command } = require("commander");
const { promises: fs } = require("fs")
const path = require("path")

const action = async (args: any) => {
  const kodies = await Package.getInstalledKodies();

  if (kodies.length == 0) {
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
    if(kodies.find(kody => kody.name == args.name)) {
        const target = `./.kody/${args.name}/templates`;
        const source = `./node_modules/${args.name}/src/concepts/templates`;
        await copyDir(source, target);
    } else {
        console.log('😞 Kody not found');
    }
  }
};

async function copyDir(src: any, dest: any) {
  await fs.mkdir(dest, { recursive: true });
  let entries = await fs.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
      let srcPath = path.join(src, entry.name);
      let destPath = path.join(dest, entry.name);

      entry.isDirectory() ?
          await copyDir(srcPath, destPath) :
          await fs.copyFile(srcPath, destPath);
  }
}

module.exports = (program: typeof Command) => {
  program
    .command("publish")
    .requiredOption(
      "-n,--name <kody>",
      "kody name to publish"
    )
    .description("Publish the templates of the kody")
    .action(async (_opt: any) => {
      return action(_opt);
    });
};
