const { argvBuilder } = require('./argv');
const { handler } = require('./handler');

exports.command = 'explore';

exports.describe = 'Esplora il changelog';

exports.builder = argvBuilder;
exports.handler = handler;
