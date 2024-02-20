const path = require('path');

const argvBuilder = function argvBuilder(yargs) {
  yargs
    .example(
      '$0 init',
      'Initializes a new empty CHANGELOG file',
    )
    .string('output')
    .alias('output', 'o')
    .default('output', path.resolve(process.cwd(), './CHANGELOG.md'))
    .describe('output', 'Ouput CHANGELOG file')
    .help();
};

module.exports = {
  argvBuilder,
};
