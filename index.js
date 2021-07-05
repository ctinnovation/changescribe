const path = require('path');
const fs = require('fs');
const { argv } = require('yargs')
  .string('targetVersion')
  .alias('targetVersion', 't')
  .describe('targetVersion', 'Target version')
  .string('output')
  .alias('output', 'o')
  .default('output', path.resolve(process.cwd(), './CHANGELOG.md'))
  .describe('output', 'Ouput CHANGELOG file')
  .string('input')
  .alias('input', 'i')
  .default('input', path.resolve(process.cwd(), './unreleased'))
  .describe('input', 'Input folder for compiling the changelog')
  .demandOption('targetVersion')
  .help();

const {
  Handlebars, versionTemplate, taskTemplate, headerTemplate,
} = require('./helpers/hbs');
const { verifyTargetVersion } = require('./helpers/semver');
const { VERSION_LINE_REGEX } = require('./helpers/regexprs');
const { createVersionIndex } = require('./helpers/md');

const targetRoot = path.resolve(process.cwd(), '.');
const releaseFolder = path.isAbsolute(argv.input)
  ? argv.input : path.resolve(targetRoot, argv.input);

const changelogPath = path.isAbsolute(argv.output)
  ? argv.output : path.resolve(targetRoot, argv.output);

async function main() {
  const changelogExists = fs.existsSync(changelogPath);
  let oldChangelogBody = '';

  if (changelogExists) {
    const changelog = fs.readFileSync(changelogPath, 'utf-8');
    // search for something like "## [4.9.0] - 2021-04-30"
    const startIndex = changelog.search(
      VERSION_LINE_REGEX,
    );
    if (startIndex !== -1) {
      oldChangelogBody = changelog.substr(startIndex);
    }
  }

  verifyTargetVersion(argv.targetVersion, oldChangelogBody);
  const writeStream = fs.createWriteStream(changelogPath);

  writeStream.on('error', (e) => {
    console.error(e);
    process.exit(1);
  });

  // write header template
  const header = Handlebars.compile(headerTemplate)({
    index: createVersionIndex(argv.targetVersion, oldChangelogBody),
  });
  writeStream.write(header);
  writeStream.write('\n');

  // write version template
  const version = Handlebars.compile(versionTemplate)({
    version: argv.targetVersion,
  });
  writeStream.write(version);
  writeStream.write('\n\n');

  const releaseFiles = fs.readdirSync(releaseFolder);
  releaseFiles.forEach((releaseFile) => {
    const taskCode = path.basename(releaseFile, '.md');
    const fullPath = path.resolve(releaseFolder, releaseFile);
    const taskBody = fs.readFileSync(fullPath, 'utf-8');
    const task = Handlebars.compile(taskTemplate)({
      taskCode,
      taskBody,
    });
    writeStream.write(task);
    writeStream.write('\n');
  });

  writeStream.write(oldChangelogBody);
  writeStream.close();

  // fs.rmSync(releaseFolder, { recursive: true });
}

main();
