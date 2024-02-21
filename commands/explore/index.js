const { argvBuilder } = require('./argv')
const { handler } = require('./handler')

exports.command = 'explore'

exports.describe = 'Explore changelog'

exports.builder = argvBuilder
exports.handler = handler
