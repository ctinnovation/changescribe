const { exec } = require('child_process')
const fs = require('fs')
const p = require('path')
const m = require('moment')

const root = p.resolve(__dirname, './__fs')

function createChangescribeRc (testName, data = {}, format = 'json') {
  let content = JSON.stringify(data)
  const name = format === 'json'
    ? '.changescriberc'
    : '.changescriberc.cjs'

  if (format !== 'json') {
    content = `module.exports = ${JSON.stringify(data)}`
  }

  fs.mkdirSync(
    p.resolve(root, p.basename(testName)),
    { recursive: true }
  )
  fs.writeFileSync(
    p.resolve(root, p.basename(testName), './', name),
    content
  )
}

function setupFs (testName) {
  const unreleasedRoot = p.resolve(__dirname, './unreleased')
  const entries = fs.readdirSync(unreleasedRoot)
  fs.mkdirSync(p.resolve(root, p.basename(testName), './unreleased/'), { recursive: true })

  for (const file of entries) {
    const path = p.resolve(__dirname, './unreleased', file)
    let dest = p.resolve(root, p.basename(testName), './unreleased', file)

    if (file.endsWith('package-test.json')) {
      dest = p.resolve(root, p.basename(testName), 'package.json')
    }

    fs.copyFileSync(path, dest)
  }
}

function cleanFs (testName) {
  const path = p.resolve(root, p.basename(testName))
  fs.rmSync(path, { recursive: true })
}

function spawnCli (testName, args = '') {
  return new Promise((resolve, reject) => {
    const cliRoot = p.resolve(__dirname, '../')
    let collectedStdErr = ''
    let collectedStdOut = ''
    const child = exec(
      `node ${cliRoot} ${args}`,
      { cwd: p.join(root, p.basename(testName)) }
    )
    child.stdout.on('data', d => {
      collectedStdOut += d
    })
    child.stderr.on('data', d => {
      collectedStdErr += d
    })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) {
        resolve({ code, stdout: collectedStdOut, stderr: collectedStdErr })
        return
      }

      const error = new Error(`process exited with code ${code}`)
      error.stderr = collectedStdErr
      reject(error)
    })
  })
}

function generateResult (targetVersion, taskUrlTemplate = 'http://changescribe.atlassian.net/browse/{taskUrl}') {
  const now = m()
  const result = `# Changelog

All notable changes to this project will be documented in this file.

[![CHANGELOG
FORMAT](https://img.shields.io/badge/Format-keepachangelog-orange.svg)](https://keepachangelog.com/en/1.0.0/) [![VERSIONING](https://img.shields.io/badge/Versioning-semver-red.svg)](https://semver.org/spec/v2.0.0.html)

- [[${targetVersion}] - ${now.format('YYYY-MM-DD')}](#${targetVersion.replace(/\./g, '')}---${now.format('YYYY-MM-DD')})

## [${targetVersion}] - ${now.format('YYYY-MM-DD')}

[![TASK](https://img.shields.io/badge/TASK-BR%203-default.svg)](${taskUrlTemplate.replace('{taskUrl}', '')}BR-3) [![TASK](https://img.shields.io/badge/TASK-CH%202-default.svg)](${taskUrlTemplate.replace('{taskUrl}', '')}CH-2) [![TASK](https://img.shields.io/badge/TASK-FIX%201-default.svg)](${taskUrlTemplate.replace('{taskUrl}', '')}FIX-1) [![TASK](https://img.shields.io/badge/TASK-MI%204-default.svg)](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4) 

### Added

- Added 1 ‧ [MI-4](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4)
- Added 2 ‧ [MI-4](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4)

### Changed

- [breaking] breaking change ‧ [BR-3](${taskUrlTemplate.replace('{taskUrl}', '')}BR-3)
- another change ‧ [BR-3](${taskUrlTemplate.replace('{taskUrl}', '')}BR-3)
- change ‧ [CH-2](${taskUrlTemplate.replace('{taskUrl}', '')}CH-2)
- another change ‧ [CH-2](${taskUrlTemplate.replace('{taskUrl}', '')}CH-2)
- Change 1 ‧ [MI-4](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4)
- Change 2 ‧ [MI-4](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4)
- Change 3 ‧ [MI-4](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4)

### Fixed

- Fix 1 ‧ [FIX-1](${taskUrlTemplate.replace('{taskUrl}', '')}FIX-1)
- Fix 2 ‧ [FIX-1](${taskUrlTemplate.replace('{taskUrl}', '')}FIX-1)
- Fix 1 ‧ [MI-4](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4)
- Fix 2 ‧ [MI-4](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4)
- Fix 3 ‧ [MI-4](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4)

### Refactor

- Refactor 1 ‧ [MI-4](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4)

### Removed

- removed ‧ [BR-3](${taskUrlTemplate.replace('{taskUrl}', '')}BR-3)`

  return result
}

function generateMultipleVersionResult (taskUrlTemplate = 'http://changescribe.atlassian.net/browse/{taskUrl}') {
  const now = m()
  const result = `# Changelog

All notable changes to this project will be documented in this file.

[![CHANGELOG
FORMAT](https://img.shields.io/badge/Format-keepachangelog-orange.svg)](https://keepachangelog.com/en/1.0.0/) [![VERSIONING](https://img.shields.io/badge/Versioning-semver-red.svg)](https://semver.org/spec/v2.0.0.html)

- [[1.2.5] - ${now.format('YYYY-MM-DD')}](#125---${now.format('YYYY-MM-DD')})
- [[1.2.4] - ${now.format('YYYY-MM-DD')}](#124---${now.format('YYYY-MM-DD')})

## [1.2.5] - ${now.format('YYYY-MM-DD')}

[![TASK](https://img.shields.io/badge/TASK-BR%203-default.svg)](${taskUrlTemplate.replace('{taskUrl}', '')}BR-3) [![TASK](https://img.shields.io/badge/TASK-CH%202-default.svg)](${taskUrlTemplate.replace('{taskUrl}', '')}CH-2) [![TASK](https://img.shields.io/badge/TASK-FIX%201-default.svg)](${taskUrlTemplate.replace('{taskUrl}', '')}FIX-1) [![TASK](https://img.shields.io/badge/TASK-MI%204-default.svg)](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4) 

### Added

- Added 1 ‧ [MI-4](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4)
- Added 2 ‧ [MI-4](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4)

### Removed

- removed ‧ [BR-3](${taskUrlTemplate.replace('{taskUrl}', '')}BR-3)

## [1.2.4] - ${now.format('YYYY-MM-DD')}

[![TASK](https://img.shields.io/badge/TASK-BR%203-default.svg)](${taskUrlTemplate.replace('{taskUrl}', '')}BR-3) [![TASK](https://img.shields.io/badge/TASK-CH%202-default.svg)](${taskUrlTemplate.replace('{taskUrl}', '')}CH-2) [![TASK](https://img.shields.io/badge/TASK-FIX%201-default.svg)](${taskUrlTemplate.replace('{taskUrl}', '')}FIX-1) [![TASK](https://img.shields.io/badge/TASK-MI%204-default.svg)](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4) 

### Changed

- [breaking] breaking change ‧ [BR-3](${taskUrlTemplate.replace('{taskUrl}', '')}BR-3)
- another change ‧ [BR-3](${taskUrlTemplate.replace('{taskUrl}', '')}BR-3)
- change ‧ [CH-2](${taskUrlTemplate.replace('{taskUrl}', '')}CH-2)
- another change ‧ [CH-2](${taskUrlTemplate.replace('{taskUrl}', '')}CH-2)
- Change 1 ‧ [MI-4](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4)
- Change 2 ‧ [MI-4](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4)
- Change 3 ‧ [MI-4](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4)

### Fixed

- Fix 1 ‧ [FIX-1](${taskUrlTemplate.replace('{taskUrl}', '')}FIX-1)
- Fix 2 ‧ [FIX-1](${taskUrlTemplate.replace('{taskUrl}', '')}FIX-1)
- Fix 1 ‧ [MI-4](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4)
- Fix 2 ‧ [MI-4](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4)
- Fix 3 ‧ [MI-4](${taskUrlTemplate.replace('{taskUrl}', '')}MI-4)`

  return result
}

module.exports = {
  root,
  createChangescribeRc,
  cleanFs,
  spawnCli,
  setupFs,
  generateResult,
  generateMultipleVersionResult
}
