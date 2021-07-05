const VERSION_LINE_REGEX = /## \[(\d+\.\d+\.\d+)\]( - \d*-\d*-\d*)?\n/gi;
const UNRELEASED_LINE_REGEX = /## \[Unreleased\]/gi;

module.exports = {
  VERSION_LINE_REGEX,
  UNRELEASED_LINE_REGEX,
};
