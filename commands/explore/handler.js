const path = require('path');
const fs = require('fs');
const { verifyVersionOfChangelog } = require('../../helpers/semver');
const Version = require('./version');
const { coloring } = require('../../helpers/colorText');
const {
  Handlebars, headerExploreTemplate, headerExploreConsoleTemplate,
} = require('../../helpers/hbs');

function printOnConsole(outputArray, min, max) {
  const header = Handlebars.compile(headerExploreConsoleTemplate)({
    v1: min.toString(),
    v2: max.toString(),
  });
  console.log(header);
  let alternateColor = true;
  outputArray.forEach((line) => {
    let changelogLine = line.replace(/\[(.*?)\]\((.*?)\)\]/g, '');
    changelogLine = changelogLine.replace(/(‧ \[.*?\]\(.*?\))/g, '');
    if (alternateColor) {
      console.log(coloring(changelogLine, 'gray'));
    } else {
      console.log(coloring(changelogLine, 'white'));
    }
    alternateColor = !alternateColor;
  });
}

function writeOnFile(outputPath, output, targetRoot, min, max) {
  const outputFile = path.join(outputPath, `${min}~${max}.md`);
  const changelogOutputPath = path.isAbsolute(outputFile)
    ? outputFile : path.resolve(targetRoot, outputFile);
    // write the file on the correct path
  const writableStream = fs.createWriteStream(changelogOutputPath, 'utf-8');
  const header = Handlebars.compile(headerExploreTemplate)({
    v1: min.toString(),
    v2: max.toString(),
  });
  writableStream.write(header);
  output.forEach((line) => {
    writableStream.write(line);
  });
  console.log(`File ${changelogOutputPath} written!`);
}

async function handler(argv) {
  // verify if file exists
  const targetRoot = path.resolve(process.cwd(), '.');
  const changelogInputPath = path.isAbsolute(argv.input)
    ? argv.input : path.resolve(targetRoot, argv.input);

  const lines = fs.readFileSync(changelogInputPath, 'utf-8');

  if (!lines) {
    throw new Error(`File ${argv.input} not found`);
  }

  let min;
  let max;
  // extract the bounds of the versions
  const fromTo = argv.range.trim();
  const splittedVersions = fromTo.split('~');
  // zero arguments
  if (fromTo === '' || splittedVersions.length === 0) {
    console.error('No range found!');
    console.log('Closing the tool.');
    process.exit(1);
  // to last changelog
  } else if (splittedVersions.length === 1 && verifyVersionOfChangelog(splittedVersions[0])) {
    min = new Version(splittedVersions[0]);
    max = 'ACTUAL';
  // range
  } else if (splittedVersions.length === 2
        && verifyVersionOfChangelog(splittedVersions[0])
        && verifyVersionOfChangelog(splittedVersions[1])) {
    // check i f the versions are in the correct order
    if (new Version(splittedVersions[0]).compareTo(new Version(splittedVersions[1])) > 0) {
      console.log('It looks like you reversed the order of the range in the changelog: don\'t worry.');
      min = new Version(splittedVersions[1]);
      max = new Version(splittedVersions[0]);
    } else {
      min = new Version(splittedVersions[0]);
      max = new Version(splittedVersions[1]);
    }
  // any other input
  } else {
    console.error('Error in the inserted range.');
    console.log('Closing the tool.');
    process.exit(1);
  }

  const output = [];

  let changelogLines = lines.split('## [');
  // delete the intestation
  changelogLines = changelogLines.slice(1);
  changelogLines.forEach((line) => {
    let version = line.slice(0, line.indexOf(']'));
    if (verifyVersionOfChangelog(version)) {
      version = new Version(line.slice(0, line.indexOf(']')));
      // controllo se è compresa tra gli estremi:
      if (version.compareTo(min) > 0 && version.compareTo(max) <= 0) {
        output.push(`## [${line}`);
      }
      // check if it's the last version
      if (max === 'ACTUAL') {
        max = version;
      }
    }
  });
  // check if file will be empty
  if (output.length === 0) {
    console.error('No relese found that respects the parameters entered');
    console.log('No file will be generated');
    process.exit(0);
  }
  // choose the correct output
  if (argv.output === 'console') {
    printOnConsole(output, min, max);
  } else {
    writeOnFile(argv.output, output, targetRoot, min, max);
  }
}

module.exports = {
  handler,
};
