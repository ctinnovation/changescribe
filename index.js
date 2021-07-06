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
  .boolean('includeCommits')
  .default('includeCommits', false)
  .describe('includeCommits', 'Include branch commits in new release')
  .boolean('excludeTaskList')
  .default('excludeTaskList', false)
  .describe('excludeTaskList', 'Exclude tasks list after release title')
  .demandOption('targetVersion')
  .help();

const { emptyFolder } = require('./helpers/fs');
const {
  Handlebars, versionTemplate, taskTemplate, headerTemplate,
} = require('./helpers/hbs');
const { verifyTargetVersion } = require('./helpers/semver');
const { VERSION_LINE_REGEX } = require('./helpers/regexprs');
const { createVersionIndex, createCommitSummary, parseTaskFile } = require('./helpers/md');

const targetRoot = path.resolve(process.cwd(), '.');
const releaseFolder = path.isAbsolute(argv.input)
  ? argv.input : path.resolve(targetRoot, argv.input);

const changelogPath = path.isAbsolute(argv.output)
  ? argv.output : path.resolve(targetRoot, argv.output);

async function main() {
  const releaseFolderExists = fs.existsSync(releaseFolder);

  if (!releaseFolderExists) {
    console.error('Unable to find source folder');
    process.exit(1);
  }

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

  let releaseFiles = fs.readdirSync(releaseFolder);
  releaseFiles = releaseFiles.filter((f) => f.endsWith('.md'));

  if (!releaseFiles.length) {
    console.log('No file to parse. All done.');
    process.exit(0);
  }

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

  let finalSectionMap = {};
  const tasks = [];

  releaseFiles.forEach((releaseFile) => {
    const taskCode = path.basename(releaseFile, '.md');
    const fullPath = path.resolve(releaseFolder, releaseFile);
    const taskBody = fs.readFileSync(fullPath, 'utf-8');

    tasks.push(taskCode);
    finalSectionMap = parseTaskFile(taskCode, taskBody, finalSectionMap);
  });

  // task summary after version title
  if (!argv.excludeTaskList) {
    tasks.forEach((task) => {
      const badge = Handlebars.compile(taskTemplate)({ taskCode: task });
      writeStream.write(badge);
    });
    writeStream.write('\n');
  }

  // task body ordered by subsections
  Object
    .keys(finalSectionMap)
    .sort()
    .forEach((sectionKey) => {
      const sectionBody = finalSectionMap[sectionKey];
      writeStream.write(`\n### ${sectionKey}\n`);
      writeStream.write(sectionBody);
      writeStream.write('\n');
    });

  if (argv.includeCommits) {
    writeStream.write('\n##### Commit history\n\n');
    const commitSummary = await createCommitSummary();
    writeStream.write(commitSummary);
  }

  writeStream.write(oldChangelogBody);
  writeStream.close();
  emptyFolder(releaseFolder);

  console.log('CHANGELOG generated 👍');
}

main();
