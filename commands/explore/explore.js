const path = require('path');

const argvBuilder = function argvBuilder(yargs) {
  yargs
    .example(
      '$0 explore --range 1.2.4~3.2.1',
      'Genera il riassunto del file CHANGELOG.md dalla versione 1.2.4 esclusa alla versione 3.2.1',
    )
    .example(
      '$0 explore --range 1.2.4',
      'Genera il riassunto del file CHANGELOG.md dalla versione 1.2.4 esclusa all\'ultima versione trovata',
    )
    .string('range')
    .alias('range', 'r')
    .describe('range', 'Range of versions in a format like X.Y.Z ~ A.B.C')
    .string('output')
    .alias('output', 'o')
    .default('output', 'console')
    .describe('output', 'Ouput file')
    .string('input')
    .alias('input', 'i')
    .default('input', path.resolve(process.cwd(), './CHANGELOG.md'))
    .describe('input', 'Input CHANGELOG for explore diffs')
    .check((args) => {
      const { range } = args;
      if (!range) {
        throw new Error('Should provide a range!');
      } else {
        return true; // tell Yargs that the arguments passed the check
      }
    })
    .help();
};

module.exports = {
  argvBuilder,
};
