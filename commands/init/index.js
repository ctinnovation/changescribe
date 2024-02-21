const { argvBuilder } = require('./argv');
const { handler } = require('./handler');

exports.command = ['$0', 'init'];

exports.describe = 'Init empty changelog';

exports.builder = argvBuilder;
exports.handler = handler;
