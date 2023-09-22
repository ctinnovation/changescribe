const { argvBuilder } = require('./explore');
const { handler } = require('./handler');

exports.command = 'explore';

exports.describe = 'Esplora il changelog';

exports.builder = argvBuilder;
exports.handler = handler;