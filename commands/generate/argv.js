const path = require('path')
const { loadDefaultsFromFile } = require('../../helpers/defaults')

const COMMAND_DEFAULTS = {
  fromPackageJson: false,
  output: path.resolve(process.cwd(), './CHANGELOG.md'),
  input: path.resolve(process.cwd(), './unreleased'),
  includeCommits: false,
  excludeTaskList: false,
  createOutputIfNotFound: false
}

const argvBuilder = function argvBuilder (yargs) {
  const defaults = loadDefaultsFromFile('generate', COMMAND_DEFAULTS)
  yargs
    .example(
      '$0 generate -t 1.0.0',
      'Generate CHANGELOG for version 1.0.0'
    )
    .example(
      '$0 -t 1.0.0',
      'Generate CHANGELOG for version 1.0.0'
    )
    .string('targetVersion')
    .alias('targetVersion', 't')
    .describe('targetVersion', 'Target version')
    .default('targetVersion', defaults.targetVersion)
    .boolean('fromPackageJson')
    .alias('fromPackageJson', 'p')
    .default('fromPackageJson', defaults.fromPackageJson)
    .describe('fromPackageJson', 'Retrieve version from pkg.json')
    .string('output')
    .alias('output', 'o')
    .default('output', defaults.output)
    .describe('output', 'Ouput CHANGELOG file')
    .string('input')
    .alias('input', 'i')
    .default('input', defaults.input)
    .describe('input', 'Input folder for compiling the changelog')
    .boolean('includeCommits')
    .default('includeCommits', defaults.includeCommits)
    .describe('includeCommits', 'Include branch commits in new release')
    .boolean('excludeTaskList')
    .default('excludeTaskList', defaults.excludeTaskList)
    .describe('excludeTaskList', 'Exclude tasks list after release title')
    .boolean('createOutputIfNotFound')
    .default('createOutputIfNotFound', defaults.createOutputIfNotFound)
    .describe('createOutputIfNotFound', 'Create a new output file if not found')
    .string('taskUrlTemplate')
    .alias('taskUrlTemplate', 'u')
    .describe('taskUrlTemplate', 'Associated task URL')
    .default('taskUrlTemplate', defaults.taskUrlTemplate)
    .check((args) => {
      const { targetVersion, fromPackageJson, taskUrlTemplate, excludeTaskList } = args
      if (!targetVersion && !fromPackageJson) {
        throw new Error('Should provide --targetVersion or use the --fromPackageJson flag!')
      }

      if (!taskUrlTemplate.includes('{taskCode}')) {
        throw new Error('Should provide a URL that contains `{taskCode}`!')
      }

      if (!excludeTaskList && !taskUrlTemplate) {
        throw new Error('Should provide --taskUrlTemplate when --excludeTaskList is false!')
      }

      return true // tell Yargs that the arguments passed the check
    })
    .help()
}

module.exports = {
  argvBuilder
}
