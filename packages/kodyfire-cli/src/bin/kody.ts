#!/usr/bin/env node
'use strict';
const { Command } = require('commander');
const program = new Command();
const { readdirSync } = require('fs');
const glob = require('glob'),
  path = require('path');
// get the current version from package.json
const { version } = require(path.resolve(
  process.mainModule?.path,
  '../..',
  'package.json'
));
program.version(version, '-v, --version', 'Output the current version');

// @todo: move to core
const getDirectories = (source: string) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent: any) => dirent.isDirectory())
    .map((dirent: any) => dirent.name);

const cmdDir = getDirectories(
  path.resolve(process.mainModule?.path, '../..', 'commands')
).join(',');

glob
  .sync(
    `${path.resolve(
      process.mainModule?.path,
      '../..'
    )}/commands/{${cmdDir}}/index.js`
  )
  .forEach(function (file: any) {
    const cmd = require(path.resolve(file));
    cmd(program);
    // @todo: register custom commands using glob
  });

program.parse(process.argv);
