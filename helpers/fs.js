const fs = require('fs');
const path = require('path');

function emptyFolder(folder) {
  const files = fs.readdirSync(folder);
  files.forEach((file) => {
    if (file === '.gitkeep') {
      return;
    }
    fs.unlinkSync(path.resolve(folder, file));
  });
}

module.exports = {
  emptyFolder,
};
