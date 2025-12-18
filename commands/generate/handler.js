const path = require('path')
const fs = require('fs')

const { emptyFolder } = require('../../helpers/fs')
const {
  Handlebars, versionTemplate, taskTemplate, headerTemplate
} = require('../../helpers/hbs')
const { verifyTargetVersion } = require('../../helpers/semver')
const { VERSION_LINE_REGEX, UNRELEASED_LINE_REGEX } = require('../../helpers/regexprs')
const { createVersionIndex, parseTaskFile } = require('../../helpers/md')

// Predefined patterns for common issue tracking systems
const ISSUE_SYSTEM_PATTERNS = {
  github: '^(.+)-(\\d+)$', // projectname-123 -> project: projectname, issue: 123
  gitlab: '^(.+)-(\\d+)$', // projectname-456 -> project: projectname, issue: 456
  jira: null // PROJ-123 -> uses full filename as taskCode
}

function getPatternForIssueSystem (issueSystem) {
  if (!issueSystem) return null
  const pattern = ISSUE_SYSTEM_PATTERNS[issueSystem.toLowerCase()]
  if (pattern === undefined) {
    console.warn(`Warning: Unknown issueSystem "${issueSystem}". Using default behavior.`)
    return null
  }
  return pattern
}

async function handler (argv) {
  const targetRoot = path.resolve(process.cwd(), '.')
  /* c8 ignore next 3 */
  const releaseFolder = path.isAbsolute(argv.input)
    ? argv.input
    : path.resolve(targetRoot, argv.input)

  /* c8 ignore next 3 */
  const changelogPath = path.isAbsolute(argv.output)
    ? argv.output
    : path.resolve(targetRoot, argv.output)

  const releaseFolderExists = fs.existsSync(releaseFolder)

  if (!releaseFolderExists) {
    console.error('Unable to find source folder')
    process.exit(1)
  }

  const changelogExists = fs.existsSync(changelogPath)
  let oldChangelogBody = ''

  if (changelogExists) {
    const changelog = fs.readFileSync(changelogPath, 'utf-8')

    if (changelog.search(UNRELEASED_LINE_REGEX) >= 0) {
      console.error('[Unreleased] section found in changelog. This tool is incompatible with this format.')
      console.log('In order to avoid data deletion the tool will shut down.')
      process.exit(1)
    }

    // search for something like "## [4.9.0] - 2021-04-30"
    const startIndex = changelog.search(
      VERSION_LINE_REGEX
    )
    if (startIndex !== -1) {
      oldChangelogBody = changelog.substr(startIndex)
    }
  }

  if (!changelogExists && !argv.createOutputIfNotFound) {
    console.error(`Missing file ${changelogPath} and option createOutputIfNotFound set to false.`)
    console.log('Unable to continue. The tool will be shut down.')
    process.exit(1)
  }

  let { targetVersion } = argv

  if (argv.fromPackageJson) {
    const pkgPath = path.join(targetRoot, 'package.json')
    if (!fs.existsSync(pkgPath)) {
      console.error('Unable to find a valid package.json to retrieve the version from!')
      process.exit(1)
    }
    const pkg = require(pkgPath)

    if (!pkg.version) {
      console.error('Unable to find a valid version in package.json!')
      process.exit(1)
    }

    targetVersion = pkg.version
  }

  verifyTargetVersion(targetVersion, oldChangelogBody)

  let releaseFiles = fs.readdirSync(releaseFolder)
  releaseFiles = releaseFiles.filter((f) => f.endsWith('.md')).sort()

  if (!releaseFiles.length) {
    console.log('No file to parse. All done.')
    process.exit(0)
  }

  const tempChangelog = `${changelogPath}-temp-${new Date().getTime()}`
  const writeStream = fs.createWriteStream(tempChangelog)

  // write header template
  const header = Handlebars.compile(headerTemplate)({
    index: createVersionIndex(targetVersion, oldChangelogBody)
  })
  writeStream.write(header)
  writeStream.write('\n')

  // write version template
  const version = Handlebars.compile(versionTemplate)({
    version: targetVersion
  })
  writeStream.write(version)
  writeStream.write('\n\n')

  let finalSectionMap = {}
  const tasks = []

  releaseFiles.forEach((releaseFile) => {
    const fileName = path.basename(releaseFile, '.md')
    let taskCode = fileName
    let project = ''

    // Determine which pattern to use: taskCodePattern has priority, then issueSystem
    const patternToUse = argv.taskCodePattern || getPatternForIssueSystem(argv.issueSystem)

    // Extract task code and project using pattern if provided
    if (patternToUse) {
      try {
        const regex = new RegExp(patternToUse)
        const match = fileName.match(regex)
        if (match) {
          // If pattern has 2 groups, first is project, second is taskCode
          // If pattern has 1 group, it's just the taskCode
          if (match[2]) {
            project = match[1]
            taskCode = match[2]
          } else if (match[1]) {
            taskCode = match[1]
          }
        } else {
          console.warn(`Warning: Pattern did not match filename "${fileName}". Using full filename as taskCode.`)
        }
      } catch (error) {
        console.error(`Error: Invalid pattern regex: ${error.message}`)
        process.exit(1)
      }
    }

    const fullPath = path.resolve(releaseFolder, releaseFile)
    const taskBody = fs.readFileSync(fullPath, 'utf-8')

    tasks.push({ taskCode, project })
    let urlTask = (argv.taskUrlTemplate || '')
      .replace('{taskCode}', taskCode)
      .replace('{project}', project)
    finalSectionMap = parseTaskFile(taskCode, taskBody, urlTask, finalSectionMap)
  })

  // task summary after version title
  if (!argv.excludeTaskList) {
    tasks.forEach((task) => {
      const urlTask = argv.taskUrlTemplate
        .replace('{taskCode}', task.taskCode)
        .replace('{project}', task.project)
      const badge = Handlebars.compile(taskTemplate)({ taskCode: task.taskCode, urlTask })
      writeStream.write(`${badge} `)
    })
    writeStream.write('\n')
  }

  // task body ordered by subsections
  Object
    .keys(finalSectionMap)
    .sort()
    .forEach((sectionKey) => {
      const sectionBody = finalSectionMap[sectionKey]
      writeStream.write(`\n### ${sectionKey}\n`)
      writeStream.write(sectionBody)
      writeStream.write('\n')
    })

  writeStream.on('finish', () => {
    // write on the final changelog file
    fs.copyFile(tempChangelog, changelogPath, (err) => {
      /* c8 ignore next 4 */
      if (err) {
        console.error(err)
        process.exit(1)
      }
      fs.unlinkSync(tempChangelog)
      emptyFolder(releaseFolder)
      console.log('CHANGELOG generated 👍')
    })
  })

  writeStream.write(oldChangelogBody)
  writeStream.close()
}

module.exports = {
  handler
}
