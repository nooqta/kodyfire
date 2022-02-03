#!/usr/bin/env node
'use strict';
console.log("post uninstall");
if(!process.env.npm_package_kodyfire_id) {
    process.exit();
}
const fs = require('fs');
const { join, dirname } = require('path');

const fileName = join(process.env.INIT_CWD, 'kodyfire.json');
const name = process.env.npm_package_name;
let fileContent = `{"templates": []}`;
if (fs.existsSync(fileName)) {
    fileContent = fs.readFileSync(fileName);
}
let content = JSON.parse(fileContent);
let index = content.templates.findIndex(template => template.name == name ); 
if(index > -1) {
content.templates.splice(index,1);
} 
fs.writeFileSync(fileName, JSON.stringify(content))