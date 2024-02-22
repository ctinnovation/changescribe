const t = require('tap')
const fs = require('fs')
const { cleanFs, createChangescribeRc, spawnCli, setupFs, root } = require('./helpers')
const path = require('path')
const output = path.resolve(root, path.basename(__filename), 'CHANGELOG.md')

t.beforeEach(() => {
  setupFs(__filename)
})

t.afterEach(() => {
  cleanFs(__filename)
})

t.test('should use default from changescriberc.json', async () => {
  const newOutput = path.resolve(root, path.basename(__filename), 'CHANGELOG_MY.md')
  createChangescribeRc(__filename, {
    generate: {
      targetVersion: '2.1.1',
      taskUrlTemplate: 'http://changescribe.atlassian.net/browse/{taskCode}'
    },
    init: {
      output: newOutput
    }
  }, 'json')

  await spawnCli(__filename, 'init')
  const exists = fs.existsSync(newOutput)
  t.equal(exists, true)
  const content = fs.readFileSync(newOutput).toString('utf-8')
  t.ok(content)
  t.ok(content.includes('All notable changes'))
})

t.test('should init CHANGELOG.md', async () => {
  await spawnCli(__filename, 'init')
  const exists = fs.existsSync(output)
  t.equal(exists, true)
  const content = fs.readFileSync(output).toString('utf-8')
  t.ok(content)
  t.ok(content.includes('All notable changes'))
  t.ok(content.includes('# Changelog'))
})

t.test('should not init if already exists', async () => {
  fs.writeFileSync(output, 'MY DATA')
  await spawnCli(__filename, 'init')
  const exists = fs.existsSync(output)
  t.equal(exists, true)
  const content = fs.readFileSync(output).toString('utf-8')
  t.ok(content)
  t.ok(content.includes('MY DATA'))
  t.notOk(content.includes('# Changelog'))
})
