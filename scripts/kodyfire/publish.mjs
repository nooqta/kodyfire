#!/usr/bin/env zx


/*  
We check the latest lerna version
We update the package.json version
and git commit and push 
*/
/*jshint esversion: 6 */
import { $, fs, cd } from 'zx';
const {
    execSync
} = require('child_process');
const path = require('path');
const packageJsonPath = path.resolve(__dirname, '../../package.json');
const lernaJsonPath = path.resolve(__dirname, '../../lerna.json');

// read lerna.json version
let {version} = await fs.readJson(lernaJsonPath);
let packageJson = await fs.readJson(packageJsonPath);
packageJson.version = version;
// write package.json
fs.writeJson(packageJsonPath, packageJson, {
    spaces: 2
    });
// access root folder
cd(`${process.cwd()}`);
