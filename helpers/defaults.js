const fs = require('fs')
const path = require('path')

const RC_FILE_NAMES = [
  '.changescriberc',
  '.changescriberc.json',
  '.changescriberc.js',
  '.changescriberc.cjs'
]

function loadDefaultsFromFile (commandName, commandDefaults = {}) {
  const targetRoot = path.resolve(process.cwd(), '.')
  let resolvedRcPath = null

  for (const name of RC_FILE_NAMES) {
    const fullPath = path.resolve(targetRoot, './', name)
    const exists = fs.existsSync(fullPath)

    if (exists) {
      resolvedRcPath = fullPath
      break
    }
  }

  if (!resolvedRcPath) {
    console.debug('no .changescriberc file found')
    return commandDefaults
  }

  // commonjs file
  if (/\.c?js$/gi.test(resolvedRcPath)) {
    const rcDefaults = require(resolvedRcPath) || {}
    return {
      ...commandDefaults,
      ...rcDefaults[commandName]
    }
  }

  // JSON file as default
  const rcDefaults = JSON.parse(fs.readFileSync(resolvedRcPath, 'utf-8')) || {}
  return {
    ...commandDefaults,
    ...rcDefaults[commandName]
  }
}

module.exports = {
  loadDefaultsFromFile
}
