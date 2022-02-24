import { Command } from 'commander';
import fetch from 'node-fetch';
import { Package } from 'kodyfire-core';
import dotenv from 'dotenv';
dotenv.config();

const action = async () => {
  // Get current package info
  const packageInfo = await Package.getPackageJson();
  console.log(packageInfo);
  const response = await fetch(
    'https://api.github.com/repos/nooqta/kodyfire/labels'
  );
  const labels = await response.json();
  const requestLabel = labels.find(
    (label: any) => label.name === 'request: listing'
  );

  const resp = await fetch(
    `https://api.github.com/repos/nooqta/kodyfire/issues`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        title: `Request to publish ${packageInfo.name}`,
        owner: 'nooqta',
        repo: 'kodyfire',
        body: `I would like to publish the following package: ${packageInfo.name} to the kody's repo.
               The repository url is [${packageInfo.repository.url}](${packageInfo.repository.url}) @anis-marrouchi.`,
        labels: [requestLabel.name],
      }),
    }
  );
  const issue = await resp.json();
  console.log(issue);
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
