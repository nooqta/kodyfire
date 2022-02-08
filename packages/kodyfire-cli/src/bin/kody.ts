#!/usr/bin/env node
"use strict";
const chalk = require("chalk");
const { Command } = require("commander");
const program = new Command();
const fs = require("fs");
const { join } = require("path");
var Table = require("cli-table");
const boxen = require("boxen");
const pack = require(join(process.cwd(), "package.json"));
var EventEmitter = require('events')
var ee = new EventEmitter()
var glob = require( 'glob' )
  , path = require( 'path' );

program.version('0.0.1', '-v, --version', 'output the current version');
glob.sync(`${path.resolve(process.mainModule?.path, '../..')}/commands/**/*.js` ).forEach( function( file: any ) {
  const cmd = require(path.resolve( file ));
  cmd(program);
  // @todo: register custom commands using glob
});

program.parse(process.argv);
