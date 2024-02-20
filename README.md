# changelogger



A CHANGELOG.md utility generator. Provide a folder `/unreleased` with a Markdown file for each of your completed tasks: each file should be named with the task or ticket code related.

Run this utility in order to generate or update a CHANGELOG file merging each file in a new release or explore a range of versions included in the CHANGELOG. You must specify the [semver version](https://semver.org/lang/it/) code for the next release to be generated.

- [Installation](#installation)
- [Commands and usage](#commands-and-usage)
  - [Generate (default)](#generate-default)
  - [Explore](#explore)
  - [Init](#init)
- [Task file format](#task-file-format)
  - [Example](#example)

## Installation

```bash
npm install -g @ctinnovation/changelogger
changelogger --help
```

## Commands and usage

### Generate (default)

In your `unreleased` folder you have a `PR-120.md` file with this content:

```markdown
## Added 
- I added this

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

or 

```bash
changelogger generate --targetVersion 1.0.0
```
You'll have a CHANGELOG.md like this:

---
> # Changelog
> 
> All notable changes to this project will be documented in this file.
> 
> [![CHANGELOG FORMAT](https://img.shields.io/badge/Format-keepachangelog-orange.svg)](https://keepachangelog.com/en/1.0.0/)
> [![VERSIONING](https://img.shields.io/badge/Versioning-semver-red.svg)](https://semver.org/spec/v2.0.0.html)
> 
> - [[1.0.0] - 2023-09-26](#100---2021-07-05)
> 
> ## [1.0.0] - 2023-09-26
> 
> [![TASK](https://img.shields.io/badge/TASK-BC%20120-default.svg)](https://jira.com/browse/PR-120)
>
> #### Added
> - I added this
> #### Changed
> 
> - I've changed this
> - And also this
> 
> #### Fixed
> 
> - I fixed this
> - But also this!
---

Feel free to customize your template by modifying the templates inside `templates` folder.

You must specify:
- `targetVersion`

You can also specify:
- `fromPackageJson`
- `output`
- `includeCommits`
- `excludeTaskList`
- `createOutputIfNotFound`
- `taskUrlTemplate`

For a description of all the available options please run:

```bash
changelogger generate --help
```

> You can pass the `-p` option to automatically infer the version from the package.json of your project.

### Explore

You can explore a range of versions contained in a `CHANGELOG.md` file generated with this tool:

```bash
changelogger explore --range 1.2.1
```

This command will exctract you a range of versions, in this case from 1.2.1 to the latest.
You'll get a console logs similar to the following:

---
> # `packageName` changelog from 1.2.1 to 1.3.1 (1.2.1~1.3.1)
> 
>All notable changes to this project from version 1.2.1 to 1.3.1.
>
>CHANGELOG FORMAT https://keepachangelog.com/en/1.0.0/
> 
>VERSIONING https://semver.org/spec/v2.0.0.html
>
>## 1.3.1
>https://jira.com/browse/{taskCode}
>
>### Added
>
>- I added this
>## 1.2.5
>https://jira.com/browse/{taskCode}
>
>### Added
>
>- I changed this
>### Fixed
>- I fixed this
>
>## 1.2.1
>https://jira.com/browse/{taskCode}
>
>### Added
>
>- I changed this
>### Fixed
>- I fixed this
>
---
You must specify:

- `range`

You can also specify:

- `input`
- `output`

For a description of all the available options please run:

```bash
changelogger explore --help
```

### Init

Creates a new empty CHANGELOG.md file. 

```bash
changelogger init
```

## Task file format

For the `generate` command you must provide a Markdown file for each of yours task completed on the current branch. Each file:

- Should be named with the code of the task
- Should be splitted in sections with these titles
  - \## Change[d]
  - \## [hot]Fix[ed]
  - \## Remove[d]
  - \## Add[ed]

- Each section should list each change prepended with `-`.

### Example

```markdown
## Changed
- change 1
- change 2

## Fix
- fix 1
- fix 2
```

> The `[notation]` is used to indicate optional group of characters inside the section title. Each possible variation will be standardised to the form: Changed, Added, Removed, Fixed