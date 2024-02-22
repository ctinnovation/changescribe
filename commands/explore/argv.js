const path = require('path')
const fs = require('fs')
const { loadDefaultsFromFile } = require('../../helpers/defaults')

const COMMAND_DEFAULTS = {
  input: path.resolve(process.cwd(), './CHANGELOG.md'),
  output: 'console'
}

const argvBuilder = function argvBuilder (yargs) {
  const defaults = loadDefaultsFromFile('explore', COMMAND_DEFAULTS)
  yargs
    .example(
      '$0 explore --range 1.2.4~3.2.1',
      'Generate CHANGELOG summary from version 1.2.4 (exclusive) to version 3.2.1'
    )
    .example(
      '$0 explore --range 1.2.4',
      'Generate CHANGELOG summary from version 1.2.4 (exclusive) to the latest'
    )
    .string('range')
    .alias('range', 'r')
    .describe('range', 'Range of versions in a format like X.Y.Z ~ A.B.C')
    .default('range', defaults.range)
    .string('output')
    .alias('output', 'o')
    .default('output', defaults.output)
    .describe('output', 'Output path')
    .string('input')
    .alias('input', 'i')
    .default('input', defaults.input)
    .describe('input', 'Input CHANGELOG for explore diffs')
    .check((args) => {
      const { output } = args

      if (output !== 'console' && (!fs.existsSync(output) || !fs.lstatSync(output).isDirectory())) {
        throw new Error('You must provide a valid and existing folder as --output!')
      }

      return true // tell Yargs that the arguments passed the check
    })
    .demandOption('range')
    .help()
}

module.exports = {
  argvBuilder
}
