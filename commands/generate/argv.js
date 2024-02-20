const path = require('path');

const argvBuilder = function argvBuilder(yargs) {
  yargs
    .example(
      '$0 generate -t 1.0.0',
      'Generate CHANGELOG for version 1.0.0',
    )
    .example(
      '$0 -t 1.0.0',
      'Generate CHANGELOG for version 1.0.0',
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
    .describe('taskUrlTemplate', 'Associated task URL')
    .example('taskUrlTemplate', 'https://jira.com/browse/{taskCode}')
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
    .demandOption('taskUrlTemplate')
    .help();
};

module.exports = {
  argvBuilder,
};
