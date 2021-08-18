# changelogger

A CHANGELOG.md utility generator. Provide a folder `/unreleased` with a Markdown file for each of your completed tasks: each file should be named with the task or ticket code related.

Run this utility in order to generate or update a CHANGELOG file merging each file in a new release. You must specify the [semver version](https://semver.org/lang/it/) code for the next release to be generated.

- [How to install](#how-to-install)
- [An example](#an-example)
- [[1.0.0] - 2021-07-05](#100---2021-07-05)
    - [Changed](#changed)
    - [Fixed](#fixed)
- [Task file format](#task-file-format)
  - [Example](#example)

## How to install

In order to install the package you should be able to access the github npm registry:

1. Create a github access token (https://github.com/settings/tokens/new) with the `repo` and `read:packages` scope
3. Insert username, access token as password, email
4. You should be able to download the package: `npm install -g @ctinnovation/changelogger`
5. Run `changelogger --help`

## An example

In your `unreleased` folder you have a `BC-120.md` file with this content:

```markdown
## Changed

- I've changed this
- And also this

## Fixed

- I fixed this
- But also this!
```

Running this utility:

```bash
changelogger --targetVersion 1.0.0
```

You'll have a CHANGELOG.md like this:

---
# Changelog

All notable changes to this project will be documented in this file.

[![CHANGELOG
FORMAT](https://img.shields.io/badge/Format-keepachangelog-orange.svg)](https://keepachangelog.com/en/1.0.0/)
[![VERSIONING](https://img.shields.io/badge/Versioning-semver-red.svg)](https://semver.org/spec/v2.0.0.html)

- [[1.0.0] - 2021-07-05](#100---2021-07-05)

## [1.0.0] - 2021-07-05

[![TASK](https://img.shields.io/badge/TASK-BC%20120-default.svg)](https://ctinnovation.atlassian.net/browse/BC-120)

#### Changed

- I've changed this
- And also this

#### Fixed

- I fixed this
- But also this!

---

Feel free to customize your template by modifying the templates inside `templates` folder.

For a list of the available options please run:

```bash
changelogger --help
```

> You can pass the `-p` option to automatically infer the version from the package.json of your project.

## Task file format

You must provide a Markdown file for each of yours task completed on the current branch. Each file:

- Should be named with the code of the task
- Should be splitted in sections with these titles
  - \## Changed
  - \## Fixed
  - \## Removed
  - \## Added

Each section should list each change prepended with `-`.

### Example

```markdown
## Changed
- change 1
- change 2

## Fixed
- fix 1
- fix 2
```
