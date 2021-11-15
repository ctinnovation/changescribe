const VERSION_LINE_REGEX = /## \[(\d+\.\d+\.\d+)\]( - \d*-\d*-\d*)?(?:\n|$)/gi;
const UNRELEASED_LINE_REGEX = /## \[Unreleased\]/gi;
const TASK_SECTION_REGEX = /#+ (\w+).*(?:\n|$)*/gi;
const SUBSECTION_TITLE_REGEX = /changed?|edit(ed)?|add(ed)?|(hot)?fix(ed)?|removed?|cancel(led)?|updated?|created?/gi;
const CHANGED_REGEX = /changed?|edit(ed)?|updated?/gi;
const FIXED_REGEX = /(hot)?fix(ed)?/gi;
const ADDED_REGEX = /add(ed)?|created?/gi;
const REMOVED_REGEX = /removed?|cancel(led)?/gi;
const REFACTORED_REGEX = /refactor(ed)?/gi;
const SUBSECTION_POINT_REGEX = /( )*- .+(?:\n|$)/gi;

function upperFirst(string = '') {
  return `${string.charAt(0).toUpperCase()}${string.substr(1).toLowerCase()}`;
}

function matchSectionTitle(currentTitle) {
  if (currentTitle.match(CHANGED_REGEX)) {
    return 'Changed';
  }
  if (currentTitle.match(FIXED_REGEX)) {
    return 'Fixed';
  }
  if (currentTitle.match(ADDED_REGEX)) {
    return 'Added';
  }
  if (currentTitle.match(REMOVED_REGEX)) {
    return 'Removed';
  }
  if (currentTitle.match(REFACTORED_REGEX)) {
    return 'Refactor';
  }
  throw new Error(`Critical error: '${currentTitle}' not matched any section title!`);
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
  CHANGED_REGEX,
  FIXED_REGEX,
  ADDED_REGEX,
  REMOVED_REGEX,
  REFACTORED_REGEX,
  matchSectionTitle,
};
