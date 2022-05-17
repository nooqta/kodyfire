const { Command } = require('commander');
const prompts = require('prompts');

const questions = (_args: any) => {
  // Does kody.json file exist
  // Are there any kodies installed
  // If no list kodies the user can install
  // If yes, list the kodies
  // Choose kody
  // If done selecting kodies, save the kody.json file
  // Ask the user if she/he wants to watch the build process
  // For every selected kody
  // Install project from scratch if applicable
  // Select destination
  //  Define concepts

  return [
    {
      type: 'select',
      name: 'technology',
      message: `What are you building today?`,
      choices: [
        // Installed kodies list
        { title: 'A Backend using Laravel (php)', value: 'laravel' },
        { title: 'A frontend using Vuexy (vue)', value: 'vuexy' },
        { title: 'Both', value: ['laravel', 'vuexy'] },
      ],
    },
    {
      type: 'multiselect',
      name: 'color',
      message: 'Pick colors',
      choices: [
        { title: 'Red', value: '#ff0000' },
        { title: 'Green', value: '#00ff00' },
        { title: 'Blue', value: '#0000ff' },
      ],
    },
  ];
};

const action = async (_args: any) => {
  const response = await prompts(questions);
  console.log(response);
};

module.exports = (program: typeof Command) => {
  program
    .command('ride')
    .alias('↻')
    .description('Prompt assistant to help build your kody.json file')
    .action(async (_opt: any) => {
      return await action(_opt);
    });
};

export default action;
