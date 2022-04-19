#!/usr/bin/env node
'use strict';
const chalk = require('chalk');
const { Command } = require('commander');
const program = new Command();
const fs = require('fs');
const { join } = require('path');
const Table = require('cli-table');
const boxen = require('boxen');
const pack = require(join(process.cwd(), 'package.json'));
const EventEmitter = require('events');
const ee = new EventEmitter();
const glob = require('glob'),
  path = require('path');

program.version('0.0.1', '-v, --version', 'output the current version');
glob
  .sync(
    `${path.resolve(
      process.mainModule?.path,
      '../..'
    )}/commands/{list,publish,push,run,scaffold,serve}/index.js`
  )
  .forEach(function (file: any) {
    const cmd = require(path.resolve(file));
    cmd(program);
    // @todo: register custom commands using glob
  });

program.parse(process.argv);
