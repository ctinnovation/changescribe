const t = require('tap')
const fs = require('fs')
const { cleanFs, createChangescribeRc, spawnCli, setupFs, root, generateResult } = require('./helpers')
const path = require('path')
const output = path.join(root, path.basename(__filename), 'CHANGELOG.md')

t.beforeEach(() => {
  setupFs(__filename)
})

t.afterEach(() => {
  cleanFs(__filename)
})

t.test('should use default from changescriberc.js', async () => {
  createChangescribeRc(__filename, {
    generate: {
      targetVersion: '2.1.1',
      taskUrlTemplate: 'http://changescribe.atlassian.net/browse/{taskCode}'
    }
  }, 'cjs')

  await spawnCli(__filename, `--output ${output}`)
  const exists = fs.existsSync(output)
  t.equal(exists, true)
  const content = fs.readFileSync(output).toString('utf-8')
  t.ok(content)
  t.ok(content.includes('## [2.1.1]'))
  t.ok(content.includes('http://changescribe.atlassian.net/browse/BR-3'))
})

t.test('should use default from changescriberc.json', async () => {
  createChangescribeRc(__filename, {
    generate: {
      targetVersion: '2.1.1',
      taskUrlTemplate: 'http://changescribe.atlassian.net/browse/{taskCode}'
    }
  }, 'json')

  await spawnCli(__filename, `--output ${output}`)
  const exists = fs.existsSync(output)
  t.equal(exists, true)
  const content = fs.readFileSync(output).toString('utf-8')
  t.ok(content)
  t.ok(content.includes('## [2.1.1]'))
  t.ok(content.includes('http://changescribe.atlassian.net/browse/BR-3'))
})

t.test('should generate from scratch with targetVersion', async () => {
  await spawnCli(__filename, `--targetVersion 2.3.3 --output ${output} --taskUrlTemplate http://changescribe.atlassian.net/browse/{taskCode}`)
  const exists = fs.existsSync(output)
  t.ok(exists)
  const content = fs.readFileSync(output).toString('utf-8')
  t.ok(content)
  t.match(content, generateResult('2.3.3'))
})

t.test('should generate from packageJson version', async () => {
  const pkg = require('./unreleased/package-test.json')
  await spawnCli(__filename, `-p --output ${output} --taskUrlTemplate http://changescribe.atlassian.net/browse/{taskCode}`)
  const exists = fs.existsSync(output)
  t.ok(exists)
  const content = fs.readFileSync(output).toString('utf-8')
  t.ok(content)
  t.match(content, generateResult(pkg.version))
})

t.test('should append to existing changelog', async () => {
  fs.writeFileSync(output, generateResult('0.0.1'))
  await spawnCli(__filename, `--targetVersion 0.0.2 --output ${output} --taskUrlTemplate http://changescribe.atlassian.net/browse/{taskCode}`)
  const exists = fs.existsSync(output)
  t.ok(exists)
  const content = fs.readFileSync(output).toString('utf-8')
  t.ok(content)
  t.ok(content.includes('## [0.0.1]'))
  t.ok(content.includes('## [0.0.2]'))
  // should be present twice:
  t.equal(content.match(/- \[breaking\] breaking change/g).length, 2)
  t.equal(content.match(/- Fix 1 ‧ \[FIX-1\]/g).length, 2)
  t.equal(content.match(/### Changed/g).length, 2)
})

t.test('should prevent appending to [Unreleased] changelog', () => {
  fs.writeFileSync(output, '## [Unreleased]')
  return spawnCli(__filename, `--targetVersion 0.0.2 --output ${output} --taskUrlTemplate http://changescribe.atlassian.net/browse/{taskCode}`)
    .then(() => t.fail('expected rejection'))
    .catch(e => t.ok(e.stderr.includes('[Unreleased] section found in changelog. This tool is incompatible with this format.')))
})

t.test('should prevent appending when --createOutputIfNotFound false', () => {
  return spawnCli(__filename, `--targetVersion 0.0.2 --output ${output} --taskUrlTemplate http://changescribe.atlassian.net/browse/{taskCode} --createOutputIfNotFound=false`)
    .then(() => t.fail('expected rejection'))
    .catch(e => {
      t.ok(e.stderr.includes(`Missing file ${output} and option createOutputIfNotFound set to false.`))
    })
})

t.test('should throw when missing package.json', () => {
  const pkgPath = path.resolve(root, path.basename(__filename), 'package.json')
  fs.unlinkSync(pkgPath)
  return spawnCli(__filename, `-p --output ${output} --taskUrlTemplate http://changescribe.atlassian.net/browse/{taskCode}`)
    .then(() => t.fail('expected rejection'))
    .catch(e => {
      t.ok(e.stderr.includes('Unable to find a valid package.json to retrieve the version from!'))
    })
})

t.test('should throw when missing package.json version', () => {
  const pkgPath = path.resolve(root, path.basename(__filename), 'package.json')
  fs.unlinkSync(pkgPath)
  fs.writeFileSync(pkgPath, JSON.stringify({ name: 'test' }))
  return spawnCli(__filename, `-p --output ${output} --taskUrlTemplate http://changescribe.atlassian.net/browse/{taskCode}`)
    .then(() => t.fail('expected rejection'))
    .catch(e => {
      t.ok(e.stderr.includes('Unable to find a valid version in package.json!'))
    })
})

t.test('should do nothing if no task files to parse', async () => {
  cleanFs(__filename)
  fs.mkdirSync(path.resolve(root, path.basename(__filename), 'unreleased'), { recursive: true })
  await spawnCli(__filename, `--targetVersion 1.1.1 --output ${output} --taskUrlTemplate http://changescribe.atlassian.net/browse/{taskCode}`)
  const exists = fs.existsSync(output)
  t.notOk(exists)
})

t.test('should throw when missing folder', () => {
  cleanFs(__filename)
  fs.mkdirSync(path.resolve(root, path.basename(__filename)), { recursive: true })
  return spawnCli(__filename, `-p --output ${output} --taskUrlTemplate http://changescribe.atlassian.net/browse/{taskCode}`)
    .then(() => t.fail('expected rejection'))
    .catch(e => {
      t.ok(e.stderr.includes('Unable to find source folder'))
    })
})

t.test('should throw when wrong section found', () => {
  fs.writeFileSync(
    path.resolve(root, path.basename(__filename), 'unreleased/', 'TK-213.md'),
    '## Wrong\n\n- test'
  )
  return spawnCli(__filename, `--targetVersion 1.2.3 --output ${output} --taskUrlTemplate http://changescribe.atlassian.net/browse/{taskCode}`)
    .then(() => t.fail('expected rejection'))
    .catch(e => {
      t.ok(e.stderr.includes('Invalid section title found: Wrong'))
    })
})

t.test('should parse empty files', async () => {
  fs.writeFileSync(
    path.resolve(root, path.basename(__filename), 'unreleased/', 'TK-213.md'),
    ''
  )
  await spawnCli(__filename, `--targetVersion 1.2.3 --output ${output} --taskUrlTemplate http://changescribe.atlassian.net/browse/{taskCode}`)
  const exists = fs.existsSync(output)
  t.ok(exists)
  const content = fs.readFileSync(output).toString('utf-8')
  t.ok(content.includes('TK-213'))
})

t.test('should throw when missing fromPackageJsona and targetVersion', () => {
  return spawnCli(__filename, `--output ${output} --taskUrlTemplate http://changescribe.atlassian.net/browse/{taskCode}`)
    .then(() => t.fail('expected rejection'))
    .catch(e => {
      t.ok(e.stderr.includes('Should provide --targetVersion or use the --fromPackageJson flag!'))
    })
})

t.test('should proceed on missing --taskUrlTemplate but --excludeTaskList true', async () => {
  await spawnCli(__filename, `-p --output ${output} --excludeTaskList`)
  const exists = fs.existsSync(output)
  t.ok(exists)
})

t.test('should throw when missing --taskUrlTemplate but and not --excludeTaskList', async () => {
  return spawnCli(__filename, `--output ${output} -p`)
    .then(() => t.fail('expected rejection'))
    .catch(e => {
      t.ok(e.stderr.includes('Should provide --taskUrlTemplate when --excludeTaskList is false!'))
    })
})

t.test('should throw when --taskUrlTemplate is missing template', async () => {
  return spawnCli(__filename, `--output ${output} -p --taskUrlTemplate http://changescribe.atlassian.net/browse/`)
    .then(() => t.fail('expected rejection'))
    .catch(e => {
      t.ok(e.stderr.includes('Should provide a URL that contains `{taskCode}`!'))
    })
})

t.test('should throw on target version smaller than current', async () => {
  fs.writeFileSync(output, generateResult('1.2.3'))
  return spawnCli(__filename, `--targetVersion 0.0.2 --output ${output} --taskUrlTemplate http://changescribe.atlassian.net/browse/{taskCode}`)
    .then(() => t.fail('expected rejection'))
    .catch(e => {
      t.ok(e.stderr.includes('Target version must be greater than last found version!'))
    })
})
