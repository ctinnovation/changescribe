const path = require('path')
const fs = require('fs')

const {
  Handlebars,
  headerTemplate
} = require('../../helpers/hbs')

async function handler (argv) {
  const targetRoot = path.resolve(process.cwd(), '.')
  /* c8 ignore next 3 */
  const changelogPath = path.isAbsolute(argv.output)
    ? argv.output
    : path.resolve(targetRoot, argv.output)

  const changelogExists = fs.existsSync(changelogPath)
  if (changelogExists) {
    console.log('File already exists. Nothing to do')
    return
  }

  const writeStream = fs.createWriteStream(changelogPath)
  // write header template
  const header = Handlebars.compile(headerTemplate)({})
  writeStream.write(header)
  writeStream.close()
}

module.exports = {
  handler
}
