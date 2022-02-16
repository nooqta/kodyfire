import boxen from "boxen";
import { $ } from "zx";
import { Command } from "commander";

export const isPackageInstalled = (_name: string) => {
  try {
    return true;
  } catch {
    return false;
  }
};

const action = () => {
  const isInstalled = isPackageInstalled("kodyfire-builder");
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
  $`npm run start:builder`;
};

module.exports= (program: typeof Command) => {
  program
    .command("serve")
    .description("Build your schema on the fly using web interface")
    .action(async (_opt: any) => {
      return action();
    });
};
