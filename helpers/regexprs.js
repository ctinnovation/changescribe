const VERSION_LINE_REGEX = /## \[(\d+\.\d+\.\d+)\]( - \d*-\d*-\d*)?\n/gi;
const UNRELEASED_LINE_REGEX = /## \[Unreleased\]/gi;
const TASK_SECTION_REGEX = /#+ (\w+)\n/gi;
const SUBSECTION_TITLE_REGEX = /Changed|Added|Fixed|Removed/gi;
const SUBSECTION_POINT_REGEX = /( )*- (\w| )+\n/gi;

function upperFirst(string = '') {
  return `${string.charAt(0).toUpperCase()}${string.substr(1).toLowerCase()}`;
}

function matchesToArray(regex, string) {
  regex.lastIndex = 0;
  const result = [];
  let next = regex.exec(string);
  while (next !== null) {
    result.push(next);
    next = regex.exec(string);
  }
  regex.lastIndex = 0;
  return result;
}

module.exports = {
  VERSION_LINE_REGEX,
  UNRELEASED_LINE_REGEX,
  TASK_SECTION_REGEX,
  SUBSECTION_TITLE_REGEX,
  SUBSECTION_POINT_REGEX,
  upperFirst,
  matchesToArray,
};
