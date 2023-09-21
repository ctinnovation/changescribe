const yargs = require('yargs');
const { argv } = yargs
  .usage('Utilizzo: node $0 <command> [options]')
  .command(require('./explore'))
  .command(require('./generate'))
  .demandCommand()
  .argv;

module.exports = argv;
