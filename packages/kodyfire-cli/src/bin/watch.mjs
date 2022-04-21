#!/usr/bin/env zx

import fs from 'fs';
import { $ } from 'zx';
const { join } = require('path');
const watchFile = async (source) => {
  console.log(`Watching for file changes on ${source}`);
    fs.watchFile(source, async (event, filename) => {
      if (filename) {
        console.log(`${filename} file Changed, running kody`);
        await $`kody run`;
      }
    });
  }
const argv = process.argv.slice(3);
let source = argv[0];
const schema = JSON.parse(fs.readFileSync(source));
if(schema.sources) {
  for (const item of schema.sources) {
    await watchFile(item.filename);
  }
} else {
  await watchFile(source);
}