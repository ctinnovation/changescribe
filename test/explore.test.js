const t = require('tap')
const fs = require('fs')
const { cleanFs, spawnCli, setupFs, root, generateMultipleVersionResult } = require('./helpers')
const path = require('path')
const outputFolder = path.join(root, path.basename(__filename))

t.beforeEach(() => {
  setupFs(__filename)
})

t.afterEach(() => {
  cleanFs(__filename)
})

t.test('output folder should exists', () => {
  return spawnCli(__filename, 'explore --range 1.2.4 --output /unexists')
    .then(() => t.fail('expected rejection'))
    .catch(e => t.ok(e.stderr.includes('You must provide a valid and existing folder as --output!')))
})

t.test('should print on console', async () => {
  fs.writeFileSync(path.resolve(root, path.basename(__filename), 'CHANGELOG.md'), generateMultipleVersionResult())
  const { stdout } = await spawnCli(__filename, 'explore --range 1.2.5')
  t.notOk(stdout.includes('1.2.4'))
  t.notOk(stdout.includes('- Fix 1'))
  t.ok(stdout.includes('1.2.5'))
  t.ok(stdout.includes('- Added 1'))
})

t.test('should print on console (even if package.json is missing)', async () => {
  fs.unlinkSync(path.resolve(root, path.basename(__filename), 'package.json'))
  fs.writeFileSync(path.resolve(root, path.basename(__filename), 'CHANGELOG.md'), generateMultipleVersionResult())
  const { stdout } = await spawnCli(__filename, 'explore --range 1.2.5')
  t.notOk(stdout.includes('1.2.4'))
  t.notOk(stdout.includes('- Fix 1'))
  t.ok(stdout.includes('Unknown'))
  t.ok(stdout.includes('1.2.5'))
  t.ok(stdout.includes('- Added 1'))
})

t.test('should print on console multiple versions', async () => {
  fs.writeFileSync(path.resolve(root, path.basename(__filename), 'CHANGELOG.md'), generateMultipleVersionResult())
  const { stdout } = await spawnCli(__filename, 'explore --range 1.2.0')
  t.ok(stdout.includes('1.2.4'))
  t.ok(stdout.includes('- Fix 1'))
  t.ok(stdout.includes('1.2.5'))
  t.ok(stdout.includes('- Added 1'))
})

t.test('should print on console multiple range', async () => {
  fs.writeFileSync(path.resolve(root, path.basename(__filename), 'CHANGELOG.md'), generateMultipleVersionResult())
  const { stdout } = await spawnCli(__filename, 'explore --range 1.2.0~3.3.0')
  t.ok(stdout.includes('1.2.4'))
  t.ok(stdout.includes('- Fix 1'))
  t.ok(stdout.includes('1.2.5'))
  t.ok(stdout.includes('- Added 1'))
})

t.test('should not print on unexisting range', async () => {
  fs.writeFileSync(path.resolve(root, path.basename(__filename), 'CHANGELOG.md'), generateMultipleVersionResult())
  const { stdout, stderr } = await spawnCli(__filename, 'explore --range 3.3.3')
  t.notOk(stdout.includes('1.2.5'))
  t.notOk(stdout.includes('- Added 1'))
  t.ok(stderr.includes('No release found that respects the parameters entered'))
  t.ok(stdout.includes('No file will be generated'))
})

t.test('should print on file', async () => {
  fs.writeFileSync(path.resolve(root, path.basename(__filename), 'CHANGELOG.md'), generateMultipleVersionResult())
  await spawnCli(__filename, `explore --range 1.2.5 --output ${outputFolder}`)
  const output = path.join(outputFolder, '1.2.5~1.2.5.md')
  const exists = fs.existsSync(output)
  t.ok(exists)
  const content = fs.readFileSync(output).toString('utf-8')
  t.notOk(content.includes('1.2.4'))
  t.notOk(content.includes('- Fix 1'))
  t.ok(content.includes('1.2.5'))
  t.ok(content.includes('- Added 1'))
})

t.test('should throw on missing input file', async () => {
  return spawnCli(__filename, 'explore --range 2.2.2')
    .then(() => t.fail('expected rejection'))
    .catch(e => {
      t.ok(e.stderr.includes('not found'))
    })
})

t.test('should throw on invalid version (with range)', async () => {
  fs.writeFileSync(path.resolve(root, path.basename(__filename), 'CHANGELOG.md'), generateMultipleVersionResult())
  return spawnCli(__filename, 'explore --range A.B.c~1.2.3')
    .then(() => t.fail('expected rejection'))
    .catch(e => {
      t.ok(e.stderr.includes('Found invalid version: A.B.c'))
    })
})

t.test('should throw on invalid version (without range)', async () => {
  fs.writeFileSync(path.resolve(root, path.basename(__filename), 'CHANGELOG.md'), generateMultipleVersionResult())
  return spawnCli(__filename, 'explore --range A.B.c')
    .then(() => t.fail('expected rejection'))
    .catch(e => {
      t.ok(e.stderr.includes('Found invalid version: A.B.c'))
    })
})

t.test('should reverse on wrong range', async () => {
  fs.writeFileSync(path.resolve(root, path.basename(__filename), 'CHANGELOG.md'), generateMultipleVersionResult())
  const { stderr } = await spawnCli(__filename, 'explore --range 3.3.0~2.2.2')
  t.ok(stderr.includes('It looks like you reversed the order of the range in the changelog: reversing them.'))
})
