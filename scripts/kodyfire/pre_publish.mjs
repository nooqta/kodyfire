#!/usr/bin/env zx

/*jshint esversion: 6 */
import { $, fs, cd } from 'zx';
const path = require('path');
(async () => {
const lernaJsonPath = path.resolve(__dirname, '../../lerna.json');
const templatesPath = path.resolve(__dirname, '../../packages/kodyfire-cli/commands/create/kody/src/concepts/templates');
const templates = fs.readdirSync(templatesPath, {
    withFileTypes: true
    }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

    // read lerna.json version
    let { version } = fs.readJSONSync(lernaJsonPath);
    // update every template package.json.template using the version
    templates.forEach(template => {
        let packageJsonTemplatePath = path.resolve(templatesPath, template, 'package.json.template');
        let packageJson = fs.readJSONSync(packageJsonTemplatePath);
        packageJson.version = version;
        // write package.json
        fs.writeJSONSync(packageJsonTemplatePath, packageJson, {
            spaces: 2
        });
    });
})();