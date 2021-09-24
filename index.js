/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const path = require('path');
const fs = require('fs');
const { argv } = require('yargs')
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
  .check((args) => {
    const { targetVersion, fromPackageJson } = args;
    if (!targetVersion && !fromPackageJson) {
      throw new Error('Should provide a target version or use the --fromPackageJson flag!');
    } else {
      return true; // tell Yargs that the arguments passed the check
    }
  })
  .help();

const { emptyFolder } = require('./helpers/fs');
const {
  Handlebars, versionTemplate, taskTemplate, headerTemplate,
} = require('./helpers/hbs');
const { verifyTargetVersion } = require('./helpers/semver');
const { VERSION_LINE_REGEX, UNRELEASED_LINE_REGEX } = require('./helpers/regexprs');
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

    if (changelog.search(UNRELEASED_LINE_REGEX) >= 0) {
      console.error('[Unreleased] section found in changelog. This tool is incompatible with this format.');
      console.log('In order to avoid data deletion the tool will shut down.');
      process.exit(1);
    }

    // search for something like "## [4.9.0] - 2021-04-30"
    const startIndex = changelog.search(
      VERSION_LINE_REGEX,
    );
    if (startIndex !== -1) {
      oldChangelogBody = changelog.substr(startIndex);
    }
  }
  let { targetVersion } = argv;

  if (argv.fromPackageJson) {
    const pkgPath = path.join(targetRoot, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      console.error('Unable to find a valid package.json to retrieve the version from!');
      process.exit(1);
    }
    const pkg = require(pkgPath);

    if (!pkg.version) {
      console.error('Unable to find a valid version in package.json!');
      process.exit(1);
    }

    targetVersion = pkg.version;
  }

  verifyTargetVersion(targetVersion, oldChangelogBody);

  let releaseFiles = fs.readdirSync(releaseFolder);
  releaseFiles = releaseFiles.filter((f) => f.endsWith('.md')).sort();

  if (!releaseFiles.length) {
    console.log('No file to parse. All done.');
    process.exit(0);
  }

  const tempChangelog = `${changelogPath}-temp-${new Date().getTime()}`;
  const writeStream = fs.createWriteStream(tempChangelog);

  writeStream.on('error', (e) => {
    console.error(e);
    process.exit(1);
  });

  // write header template
  const header = Handlebars.compile(headerTemplate)({
    index: createVersionIndex(targetVersion, oldChangelogBody),
  });
  writeStream.write(header);
  writeStream.write('\n');

  // write version template
  const version = Handlebars.compile(versionTemplate)({
    version: targetVersion,
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
      writeStream.write(`${badge} `);
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

  writeStream.on('finish', () => {
    // write on the final changelog file
    fs.copyFile(tempChangelog, changelogPath, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      fs.unlinkSync(tempChangelog);
      emptyFolder(releaseFolder);
      console.log('CHANGELOG generated 👍');
    });
  });

  writeStream.write(oldChangelogBody);
  writeStream.close();
}

main();
