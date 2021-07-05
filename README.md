# changelogger

- [An example](#an-example)
- [[1.0.0] - 2021-07-05](#100---2021-07-05)
  - [My sweet task](#my-sweet-task)
    - [Changed](#changed)
    - [Fixed](#fixed)
- [Task file suggestions](#task-file-suggestions)

A CHANGELOG.md utility generator. Provide a folder `/unreleased` with a Markdown file for each of your completed tasks: each file should be named with the task or ticket code related.

Run this utility in order to generate or update a CHANGELOG file merging each file in a new release. You must specify the [semver version](https://semver.org/lang/it/) code for the next release to be generated.

## An example

In your `unreleased` folder you have a `BC-120.md` file with this content:

```markdown
### My sweet task

#### Changed

- I've changed this
- And also this

#### Fixed

- I fixed this
- But also this!
```

Running this utility:

```bash
node . --targetVersion 1.0.0
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

### My sweet task

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
node . --help
```

## Task file suggestions

We suggest you provide a Markdown file for each of yours task completed on the current branch. Each file:

- Should include a title (h3: `###`)
- Should be named with the code of the task
- Should be splitted in these sections (each one specified if necessary and in h4: `####`):
  - Changed
  - Fixed
  - Removed
  - Added