import { Command } from 'commander';
// import { Package, Template } from 'kodyfire-core';
// const chalk = require('chalk');
// const boxen = require('boxen');

const action = async () => {
  const label = await fetch(
    'https://api.github.com/repos/nooqta/kodyfire/labels'
  );
  console.log(label);
};

module.exports = (program: Command) => {
  program
    .command('push')
    .description(
      'Push your own package to the registry. This will open an issue on Github with a request to include your package to the repository.'
    )
    .action(async (_opt: any) => {
      return action();
    });
};
