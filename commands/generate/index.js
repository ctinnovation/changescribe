const { argvBuilder } = require('./argv')
const { handler } = require('./handler')

exports.command = ['$0', 'generate']

exports.describe = 'Generate changelog'

exports.builder = argvBuilder
exports.handler = handler
