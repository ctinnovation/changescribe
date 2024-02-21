const path = require('path')
const { loadDefaultsFromFile } = require('../../helpers/defaults')

const COMMAND_DEFAULTS = {
  output: path.resolve(process.cwd(), './CHANGELOG.md')
}

const argvBuilder = function argvBuilder (yargs) {
  const defaults = loadDefaultsFromFile('init', COMMAND_DEFAULTS)

  yargs
    .example(
      '$0 init',
      'Initializes a new empty CHANGELOG file'
    )
    .string('output')
    .alias('output', 'o')
    .default('output', defaults.output)
    .describe('output', 'Ouput CHANGELOG file')
    .help()
}

module.exports = {
  argvBuilder
}
