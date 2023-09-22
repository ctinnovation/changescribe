const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const MAGENTA = '\x1b[35m';
const CYAN = '\x1b[36m';
const WHITE = '\x1b[37m';
const GRAY = '\x1b[90m';
const ENDING = '\x1b[0m';

function coloring(text, color) {
  switch (color) {
    case 'red':
      return `${RED}${text}${ENDING}`;
    case 'green':
      return `${GREEN}${text}${ENDING}`;
    case 'yellow':
      return `${YELLOW}${text}${ENDING}`;
    case 'blue':
      return `${BLUE}${text}${ENDING}`;
    case 'magenta':
      return `${MAGENTA}${text}${ENDING}`;
    case 'white':
      return `${WHITE}${text}${ENDING}`;
    case 'gray':
      return `${GRAY}${text}${ENDING}`;
    default:
      return `${CYAN}${text}${ENDING}`;
  }
}

module.exports = {
  coloring,
};
