const path = require('path')
const fs = require('fs')
const semver = require('semver')
const { verifyVersionOfChangelog } = require('../../helpers/semver')
const { coloring } = require('../../helpers/colorText')
const {
  Handlebars, headerExploreTemplate, headerExploreConsoleTemplate
} = require('../../helpers/hbs')
const { EXTRACT_VERSION, REMOVE_TASK_BADGES, REMOVE_TASK_LINK } = require('../../helpers/regexprs')

function printOnConsole (outputArray, min, max, name) {
  const header = Handlebars.compile(headerExploreConsoleTemplate)({
    name,
    v1: min.toString(),
    v2: max.toString()
  })
  console.log(header)
  let alternateColor = true
  outputArray.forEach((line) => {
    let changelogLine = line.replace(REMOVE_TASK_BADGES, '')
    changelogLine = changelogLine.replace(REMOVE_TASK_LINK, '')
    if (alternateColor) {
      // version notes
      console.log(coloring(`## ${changelogLine}`, 'green'))
    } else {
      // remove parentheses from task url
      const topLine = changelogLine.slice(0, changelogLine.indexOf('\n')).replaceAll('(', '').replaceAll(')', '')
      changelogLine = changelogLine.slice(changelogLine.indexOf('\n'))
      changelogLine = topLine + changelogLine

      console.log(coloring(changelogLine, 'white'))
    }
    alternateColor = !alternateColor
  })
}

function writeOnFile (outputPath, output, targetRoot, min, max, name) {
  const outputFile = path.join(outputPath, `${min}~${max}.md`)
  const changelogOutputPath = path.isAbsolute(outputFile)
    ? outputFile
    : path.resolve(targetRoot, outputFile)
    // write the file on the correct path
  const writableStream = fs.createWriteStream(changelogOutputPath, 'utf-8')
  const header = Handlebars.compile(headerExploreTemplate)({
    name,
    v1: min.toString(),
    v2: max.toString()
  })
  let isHeader = true
  writableStream.write(header)
  output.forEach((line) => {
    if (isHeader) {
      writableStream.write(`## ${line}`)
    } else {
      writableStream.write(line)
    }
    isHeader = !isHeader
    writableStream.write('\n')
  })
  console.log(`File ${changelogOutputPath} written!`)
}

async function handler (argv) {
  // verify if file exists
  const targetRoot = path.resolve(process.cwd(), '.')
  const pkgPath = path.join(targetRoot, 'package.json')
  let name = 'Unknown'
  if (!fs.existsSync(pkgPath)) {
    console.warn('Unable to find a valid package.json to retrieve the name from!')
  } else {
    name = require(pkgPath).name
  }
  const changelogInputPath = path.isAbsolute(argv.input)
    ? argv.input
    : path.resolve(targetRoot, argv.input)

  const exists = fs.existsSync(changelogInputPath)
  if (!exists) {
    throw new Error(`File ${argv.input} not found`)
  }

  const lines = fs.readFileSync(changelogInputPath, 'utf-8')

  let min
  let max
  // extract the bounds of the versions
  const fromTo = argv.range.trim()
  const splittedVersions = fromTo.split('~')
  // zero arguments
  if (splittedVersions.length === 1 && verifyVersionOfChangelog(splittedVersions[0])) {
    min = splittedVersions[0]
    max = 'LATEST'
  // range
  } else if (splittedVersions.length === 2 &&
        verifyVersionOfChangelog(splittedVersions[0]) &&
        verifyVersionOfChangelog(splittedVersions[1])) {
    // check if the versions are in the correct order
    min = splittedVersions[0]
    max = splittedVersions[1]
    if (!semver.lt(splittedVersions[0], splittedVersions[1])) {
      console.warn('It looks like you reversed the order of the range in the changelog: reversing them.')
      min = splittedVersions[1]
      max = splittedVersions[0]
    }
  // any other input
  /* c8 ignore next 5 */
  } else {
    console.error('Error in the inserted range.')
    console.log('Closing the tool.')
    process.exit(1)
  }

  const output = []

  let changelogLines = lines.split(EXTRACT_VERSION)
  // delete the intestation
  changelogLines = changelogLines.slice(1)
  for (let i = 0; i < changelogLines.length; i += 2) {
    const version = changelogLines[i].trim()
    if (verifyVersionOfChangelog(version)) {
      // check if it's the last version
      if (max === 'LATEST') {
        max = version
      }
      if (!semver.gt(version, max) && !semver.lt(version, min)) {
        output.push(changelogLines[i].trim())
        output.push(changelogLines[i + 1])
      }
    }
  }
  // check if file will be empty
  if (output.length === 0) {
    console.error('No release found that respects the parameters entered')
    console.log('No file will be generated')
    process.exit(0)
  }
  // choose the correct output
  if (argv.output === 'console') {
    printOnConsole(output, min, max, name)
  } else {
    writeOnFile(argv.output, output, targetRoot, min, max, name)
  }
}

module.exports = {
  handler
}
