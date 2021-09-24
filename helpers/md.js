const git = require('simple-git')({
  baseDir: process.cwd(),
  binary: 'git',
});

const { Handlebars, versionTemplate, lineCodeTemplate } = require('./hbs');
const {
  VERSION_LINE_REGEX,
  TASK_SECTION_REGEX,
  SUBSECTION_TITLE_REGEX,
  upperFirst,
  matchesToArray,
  SUBSECTION_POINT_REGEX,
  matchSectionTitle,
} = require('./regexprs');

function parseTaskFile(taskCode, fileContent, currentMap = {}) {
  if (!fileContent || !fileContent.length) {
    return currentMap;
  }

  TASK_SECTION_REGEX.lastIndex = 0;
  const matches = matchesToArray(TASK_SECTION_REGEX, fileContent);

  const result = currentMap;

  matches.forEach((match, i) => {
    const { index: matchIndex } = match;
    let sectionTitle = match[1].trim();

    // allowed section title?
    if (!sectionTitle.match(SUBSECTION_TITLE_REGEX)) {
      console.warn('Invalid section title found:', sectionTitle);
      console.log('Terminating...');
      process.exit(1);
    }

    sectionTitle = matchSectionTitle(sectionTitle);

    let subsectionBody = '';
    // retrieve sub section
    if (i === matches.length - 1) {
      // this is the last one => get from match to end
      subsectionBody = fileContent.substr(
        matchIndex + sectionTitle.length,
      );
    } else {
      // keep from current match index to next match index
      subsectionBody = fileContent.substring(
        matchIndex + match[0].length,
        matches[i + 1].index,
      );
    }

    // parse each point and format as template
    const pointMatches = matchesToArray(SUBSECTION_POINT_REGEX, subsectionBody);
    pointMatches.forEach((lineMatch) => {
      const line = lineMatch[0].replace(/\n|-/gi, '').trim();
      const lineCompiled = Handlebars.compile(lineCodeTemplate)({
        line,
        taskCode,
      });
      // concatenate to current subsection string
      result[sectionTitle] = `${(result[sectionTitle] || '')}\n${lineCompiled}`;
    });
  });

  return result;
}

function createVersionIndex(targetVersion, currentChangelog) {
  VERSION_LINE_REGEX.lastIndex = 0;
  let result = '';

  // prepend target version
  let compiledVersion = Handlebars.compile(versionTemplate)({
    version: targetVersion,
  });
  compiledVersion = compiledVersion.replace(/#/g, '').trim();
  result
    += `- [${compiledVersion}](#${compiledVersion
      .replace(/\[|\]/g, '')
      .replace(/\./g, '')
      .replace(/ /g, '-')})\n`;

  if (!currentChangelog || !currentChangelog.length) {
    return result;
  }

  let nextMatch = VERSION_LINE_REGEX.exec(currentChangelog);

  while (nextMatch !== null) {
    let [fullLine] = nextMatch;
    fullLine = fullLine.replace(/#/g, '').trim();
    result
    += `- [${fullLine}](#${fullLine
        .replace(/\[|\]/g, '')
        .replace(/\./g, '')
        .replace(/ /g, '-')})\n`;
    nextMatch = VERSION_LINE_REGEX.exec(currentChangelog);
  }

  return result;
}

async function createCommitSummary() {
  const commits = await git.log({
    from: 'main',
  });
  return commits.all
    .map((c) => ` * ${c.message}`)
    .join('\n');
}

module.exports = {
  createVersionIndex,
  createCommitSummary,
  parseTaskFile,
};
