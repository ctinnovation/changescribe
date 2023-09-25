const path = require('path');

const defaultURL = 'https://ctinnovation.atlassian.net/browse/{taskCode}';

const argvBuilder = function argvBuilder(yargs) {
  yargs
    .example(
      '$0 generate -t 1.0.0',
      'Genera il changelog alla versione 1.0.0',
    )
    .example(
      '$0 -t 1.0.0',
      'Genera il changelog alla versione 1.0.0',
    )
    .string('targetVersion')
    .alias('targetVersion', 't')
    .describe('targetVersion', 'Target version')
    .boolean('fromPackageJson')
    .alias('fromPackageJson', 'p')
    .default('fromPackageJson', false)
    .describe('fromPackageJson', 'Retrieve version from pkg.json')
    .string('output')
    .alias('output', 'o')
    .default('output', path.resolve(process.cwd(), './CHANGELOG.md'))
    .describe('output', 'Ouput CHANGELOG file')
    .string('input')
    .alias('input', 'i')
    .default('input', path.resolve(process.cwd(), './unreleased'))
    .describe('input', 'Input folder for compiling the changelog')
    .boolean('includeCommits')
    .default('includeCommits', false)
    .describe('includeCommits', 'Include branch commits in new release')
    .boolean('excludeTaskList')
    .default('excludeTaskList', false)
    .describe('excludeTaskList', 'Exclude tasks list after release title')
    .boolean('createOutputIfNotFound')
    .default('createOutputIfNotFound', true)
    .describe('createOutputIfNotFound', 'Create a new output file if not found')
    .string('taskUrlTemplate')
    .alias('taskUrlTemplate', 'u')
    .default('taskUrlTemplate', defaultURL)
    .describe('taskUrlTemplate', 'Associated task URL')
    .check((args) => {
      const { targetVersion, fromPackageJson, taskUrlTemplate } = args;
      if (!targetVersion && !fromPackageJson) {
        throw new Error('Should provide a target version or use the --fromPackageJson flag!');
      }
      if (taskUrlTemplate && !taskUrlTemplate.includes('{taskCode}')) {
        throw new Error('Should provide a URL that contains `{taskCode}`!');
      } else {
        return true; // tell Yargs that the arguments passed the check
      }
    })
    .help();
};

module.exports = {
  argvBuilder,
};
