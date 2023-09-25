const Handlebars = require('handlebars');
const moment = require('moment');
const path = require('path');
const fs = require('fs');

Handlebars.registerHelper('now', (format) => moment().format(format));
Handlebars.registerHelper('replace', (string, match, replace) => string.replace(match, replace));

const packageRoot = path.resolve(__dirname, '../');
// GENERATE TEMPLATES
const headerTemplate = fs.readFileSync(
  path.resolve(packageRoot, './templates/header.hbs'),
  'utf-8',
);
const taskTemplate = fs.readFileSync(
  path.resolve(packageRoot, './templates/task.hbs'),
  'utf-8',
);
const versionTemplate = fs.readFileSync(
  path.resolve(packageRoot, './templates/version.hbs'),
  'utf-8',
);
const lineCodeTemplate = fs.readFileSync(
  path.resolve(packageRoot, './templates/line.hbs'),
  'utf-8',
);
// EXPLORE TEMPLATES
const headerExploreTemplate = fs.readFileSync(
  path.resolve(packageRoot, './templates/headerExplore.hbs'),
  'utf-8',
);

const headerExploreConsoleTemplate = fs.readFileSync(
  path.resolve(packageRoot, './templates/headerExploreConsole.hbs'),
  'utf-8',
);

module.exports = {
  Handlebars,
  headerTemplate,
  versionTemplate,
  taskTemplate,
  lineCodeTemplate,
  headerExploreTemplate,
  headerExploreConsoleTemplate,
};
