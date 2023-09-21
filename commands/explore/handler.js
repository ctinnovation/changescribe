const path = require('path');
const fs = require('fs');
const { verifyVersionOfChangelog } = require('../../helpers/semver');
const Version = require('./version');
const {
  Handlebars, headerExploreTemplate, headerExploreConsoleTemplate,
} = require('../../helpers/hbs');

async function handler(argv) {
  // verifico se il file di input esiste
  const targetRoot = path.resolve(process.cwd(), '.');
  const changelogInputPath = path.isAbsolute(argv.input)
    ? argv.input : path.resolve(targetRoot, argv.input);

  const lines = fs.readFileSync(changelogInputPath, 'utf-8');

  if (!lines) {
    throw new Error(`File ${argv.input} not found`);
  }

  let min;
  let max;
  // estraggo gli estremi delle versioni richieste:
  const fromTo = argv.range.trim();
  const splittedVersions = fromTo.split('~');
  if (fromTo === '' || splittedVersions.length === 0) {
    console.error('No range found!');
    console.log('Closing the tool.');
    process.exit(1);
  } else {
    // un solo estremo
    if (splittedVersions.length === 1 && verifyVersionOfChangelog(splittedVersions[0])) {
      min = new Version(splittedVersions[0]);
      max = 'ACTUAL';
    } else if (splittedVersions.length === 2
        && verifyVersionOfChangelog(splittedVersions[0])
        && verifyVersionOfChangelog(splittedVersions[1])) {
      // controllo se sono nell'ordine corretto
      if (new Version(splittedVersions[0]).compareTo(new Version(splittedVersions[1])) > 0) {
        console.log('It looks like you reversed the order of the range in the changelog.');
        min = new Version(splittedVersions[1]);
        max = new Version(splittedVersions[0]);
      } else {
        min = new Version(splittedVersions[0]);
        max = new Version(splittedVersions[1]);
      }
    } else {
      console.error('Error in the inserted range.');
      console.log('Closing the tool.');
      process.exit(1);
    }
  }

  let output = '';

  let changelogLines = lines.split('## [');
  // elimino l'intestazione
  changelogLines = changelogLines.slice(1);
  changelogLines.forEach((line) => {
    let version = line.slice(0, line.indexOf(']'));
    if (verifyVersionOfChangelog(version)) {
      version = new Version(line.slice(0, line.indexOf(']')));
      // controllo se è compresa tra gli estremi:
      if (version.compareTo(min) > 0 && version.compareTo(max) <= 0) {
        output += `## [${line}`;
      }
    }
  });

  // vedo se stampare il file o mandarlo sull'output
  if (argv.output === 'console') {
    const header = Handlebars.compile(headerExploreConsoleTemplate)({
      v1: min.toString(),
      v2: max.toString(),
    });
    output = output.replaceAll(/\[(.*?)\]\((.*?)\)\]/g, '');
    output = output.replaceAll(/(\[.*?\]\(.*?\))/g, '');
    console.log(header);
    console.log(output);
  } else {
    const changelogOutputPath = path.isAbsolute(argv.output)
      ? argv.output : path.resolve(targetRoot, argv.output);
    // scrivo il file dove richiesto
    const writableStream = fs.createWriteStream(changelogOutputPath, 'utf-8');
    const header = Handlebars.compile(headerExploreTemplate)({
      v1: min.toString(),
      v2: max.toString(),
    });
    writableStream.write(header);
    writableStream.write(output);
    console.log(`File ${changelogOutputPath} written!`);
  }
}

module.exports = {
  handler,
};
