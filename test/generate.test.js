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

t.test('should support issueSystem=github with project extraction', async () => {
  // Create GitHub-style issue files
  const unreleasedPath = path.resolve(root, path.basename(__filename), 'unreleased')
  fs.writeFileSync(
    path.join(unreleasedPath, 'my-project-42.md'),
    '## Added\n- GitHub integration support\n\n## Fixed\n- Bug in URL generation'
  )

  createChangescribeRc(__filename, {
    generate: {
      targetVersion: '3.0.0',
      issueSystem: 'github',
      taskUrlTemplate: 'https://github.com/myorg/{project}/issues/{taskCode}'
    }
  })

  await spawnCli(__filename, `--output ${output}`)
  const exists = fs.existsSync(output)
  t.ok(exists)
  const content = fs.readFileSync(output).toString('utf-8')
  t.ok(content)
  t.ok(content.includes('## [3.0.0]'))
  t.ok(content.includes('https://github.com/myorg/my-project/issues/42'))
  t.ok(content.includes('GitHub integration support'))
  t.ok(content.includes('Bug in URL generation'))
})

t.test('should support issueSystem=jira without project extraction', async () => {
  createChangescribeRc(__filename, {
    generate: {
      targetVersion: '3.1.0',
      issueSystem: 'jira',
      taskUrlTemplate: 'https://mycompany.atlassian.net/browse/{taskCode}'
    }
  })

  await spawnCli(__filename, `--output ${output}`)
  const exists = fs.existsSync(output)
  t.ok(exists)
  const content = fs.readFileSync(output).toString('utf-8')
  t.ok(content)
  t.ok(content.includes('## [3.1.0]'))
  // Should use full filename as taskCode
  t.ok(content.includes('https://mycompany.atlassian.net/browse/BR-3'))
  t.ok(content.includes('https://mycompany.atlassian.net/browse/CH-2'))
})

t.test('should support issueSystem=gitlab with project extraction', async () => {
  const unreleasedPath = path.resolve(root, path.basename(__filename), 'unreleased')
  fs.writeFileSync(
    path.join(unreleasedPath, 'awesome-app-99.md'),
    '## Added\n- GitLab integration\n\n## Changed\n- Updated CI/CD'
  )

  createChangescribeRc(__filename, {
    generate: {
      targetVersion: '4.0.0',
      issueSystem: 'gitlab',
      taskUrlTemplate: 'https://gitlab.com/mygroup/{project}/-/issues/{taskCode}'
    }
  })

  await spawnCli(__filename, `--output ${output}`)
  const exists = fs.existsSync(output)
  t.ok(exists)
  const content = fs.readFileSync(output).toString('utf-8')
  t.ok(content)
  t.ok(content.includes('## [4.0.0]'))
  t.ok(content.includes('https://gitlab.com/mygroup/awesome-app/-/issues/99'))
})

t.test('should support taskCodePattern overriding issueSystem', async () => {
  const unreleasedPath = path.resolve(root, path.basename(__filename), 'unreleased')
  fs.writeFileSync(
    path.join(unreleasedPath, 'CUSTOM-789.md'),
    '## Added\n- Custom pattern support'
  )

  createChangescribeRc(__filename, {
    generate: {
      targetVersion: '5.0.0',
      issueSystem: 'github', // This should be ignored
      taskCodePattern: '^(CUSTOM-\\d+)',
      taskUrlTemplate: 'https://custom.example.com/issue/{taskCode}'
    }
  })

  await spawnCli(__filename, `--output ${output}`)
  const exists = fs.existsSync(output)
  t.ok(exists)
  const content = fs.readFileSync(output).toString('utf-8')
  t.ok(content)
  t.ok(content.includes('## [5.0.0]'))
  t.ok(content.includes('https://custom.example.com/issue/CUSTOM-789'))
})

t.test('should support projectName with numeric filenames', async () => {
  const unreleasedPath = path.resolve(root, path.basename(__filename), 'unreleased')
  fs.writeFileSync(
    path.join(unreleasedPath, '42.md'),
    '## Added\n- Simplified issue tracking\n\n## Fixed\n- URL generation with projectName'
  )

  createChangescribeRc(__filename, {
    generate: {
      targetVersion: '6.0.0',
      issueSystem: 'github',
      projectName: 'my-awesome-project',
      taskUrlTemplate: 'https://github.com/myorg/{project}/issues/{taskCode}'
    }
  })

  await spawnCli(__filename, `--output ${output}`)
  const exists = fs.existsSync(output)
  t.ok(exists)
  const content = fs.readFileSync(output).toString('utf-8')
  t.ok(content)
  t.ok(content.includes('## [6.0.0]'))
  t.ok(content.includes('https://github.com/myorg/my-awesome-project/issues/42'))
  t.ok(content.includes('Simplified issue tracking'))
})

t.test('should support projectName with mixed filenames', async () => {
  const unreleasedPath = path.resolve(root, path.basename(__filename), 'unreleased')
  // Test with numeric filename
  fs.writeFileSync(
    path.join(unreleasedPath, '99.md'),
    '## Added\n- Feature A'
  )
  // Test with project-number filename (should extract just the number)
  fs.writeFileSync(
    path.join(unreleasedPath, 'oldstyle-100.md'),
    '## Fixed\n- Bug B'
  )

  createChangescribeRc(__filename, {
    generate: {
      targetVersion: '7.0.0',
      projectName: 'unified-project',
      taskUrlTemplate: 'https://github.com/org/{project}/issues/{taskCode}'
    }
  })

  await spawnCli(__filename, `--output ${output}`)
  const exists = fs.existsSync(output)
  t.ok(exists)
  const content = fs.readFileSync(output).toString('utf-8')
  t.ok(content)
  t.ok(content.includes('## [7.0.0]'))
  // Both should use the projectName from config
  t.ok(content.includes('https://github.com/org/unified-project/issues/99'))
  t.ok(content.includes('https://github.com/org/unified-project/issues/100'))
})

t.test('should support issueSystem with unknown value (shows warning)', async () => {
  const unreleasedPath = path.resolve(root, path.basename(__filename), 'unreleased')
  fs.writeFileSync(
    path.join(unreleasedPath, 'TASK-111.md'),
    '## Added\n- Unknown system support'
  )

  createChangescribeRc(__filename, {
    generate: {
      targetVersion: '8.0.0',
      issueSystem: 'unknown-system',
      taskUrlTemplate: 'https://example.com/issue/{taskCode}'
    }
  })

  await spawnCli(__filename, `--output ${output}`)
  const exists = fs.existsSync(output)
  t.ok(exists)
  const content = fs.readFileSync(output).toString('utf-8')
  t.ok(content)
  t.ok(content.includes('## [8.0.0]'))
  // Should use full filename as taskCode
  t.ok(content.includes('https://example.com/issue/TASK-111'))
})

t.test('should support projectName with non-numeric filename', async () => {
  const unreleasedPath = path.resolve(root, path.basename(__filename), 'unreleased')
  fs.writeFileSync(
    path.join(unreleasedPath, 'feature-xyz.md'),
    '## Added\n- Special feature'
  )

  createChangescribeRc(__filename, {
    generate: {
      targetVersion: '9.0.0',
      projectName: 'my-project',
      taskUrlTemplate: 'https://github.com/org/{project}/issues/{taskCode}'
    }
  })

  await spawnCli(__filename, `--output ${output}`)
  const exists = fs.existsSync(output)
  t.ok(exists)
  const content = fs.readFileSync(output).toString('utf-8')
  t.ok(content)
  t.ok(content.includes('## [9.0.0]'))
  // Should use the full filename as taskCode since it has no numbers
  t.ok(content.includes('https://github.com/org/my-project/issues/feature-xyz'))
})

t.test('should throw on invalid taskCodePattern regex', async () => {
  const unreleasedPath = path.resolve(root, path.basename(__filename), 'unreleased')
  fs.writeFileSync(
    path.join(unreleasedPath, 'TEST-222.md'),
    '## Added\n- Test feature'
  )

  createChangescribeRc(__filename, {
    generate: {
      targetVersion: '10.0.0',
      taskCodePattern: '(invalid[regex',
      taskUrlTemplate: 'https://example.com/issue/{taskCode}'
    }
  })

  return spawnCli(__filename, `--output ${output}`)
    .then(() => t.fail('expected rejection'))
    .catch(e => {
      t.ok(e.stderr.includes('Error: Invalid pattern regex'))
    })
})
