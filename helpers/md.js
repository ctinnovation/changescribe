const { Handlebars, versionTemplate } = require('./hbs');
const { VERSION_LINE_REGEX } = require('./regexprs');

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

module.exports = {
  createVersionIndex,
};
