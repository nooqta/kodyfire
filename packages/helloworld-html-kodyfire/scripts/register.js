#!/usr/bin/env node
'use strict';
console.log("post install");
if(!process.env.npm_package_kodyfire_id) {
    process.exit();
}
const fs = require('fs');
const { join, dirname } = require('path');

const fileName = join(process.env.INIT_CWD, 'kodyfire.json');
const name = process.env.npm_package_name;
const type = process.env.npm_package_kodyfire_type;
const version = process.env.npm_package_kodyfire_version;
const id = process.env.npm_package_kodyfire_id;
const enabled = true;
let fileContent = `{"templates": []}`;
if (fs.existsSync(fileName)) {
    fileContent = fs.readFileSync(fileName);
}
let content = JSON.parse(fileContent);
let index = content.templates.findIndex(template => template.name == name ); 
if(index > -1) {
content.templates[index] = {
    name, id, type, version, enabled
} 
} else {
    content.templates.push({name, id, type, version, enabled})
}
fs.writeFileSync(fileName, JSON.stringify(content))