#!/usr/bin/env zx

const fs = require('fs');
import { $ } from "zx";
const argv = process.argv.slice(3);
const source = argv[0];
const name = argv[1];
console.log(`Watching for file changes on ${source}`);

fs.watch(source, async (event, filename) => {
  if (filename) {
    console.log(`${filename} file Changed, running kody`);
    await $`kody run --name ${name}`;
  }
});