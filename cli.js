#!/usr/bin/env node
const yargs = require('yargs');
const { argv } = yargs
  .usage('Utilizzo: node $0 <command> [options]')
  .command(require('./commands/explore'))
  .command(require('./commands/generate'))
  .demandCommand()
  .argv;

module.exports = argv;
