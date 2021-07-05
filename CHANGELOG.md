# Changelog

All notable changes to this project will be documented in this file.

[![CHANGELOG
FORMAT](https://img.shields.io/badge/Format-keepachangelog-orange.svg)](https://keepachangelog.com/en/1.0.0/)
[![VERSIONING](https://img.shields.io/badge/Versioning-semver-red.svg)](https://semver.org/spec/v2.0.0.html)

- [[1.0.0] - 2021-07-05](#100---2021-07-05)

## [1.0.0] - 2021-07-05

[![TASK](https://img.shields.io/badge/TASK-BAC%20120-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-120)

### Porta per api liveness e readiness

#### Changed

- Modificato `config.js` la porta per le risorse `api/live` e `api/ready` per impostare la porta 3003 invece di 3008 per ambiente di produzione.
- Modificato `config.dev.js` per impostare porta 3008 per liveness e readyness
- Modificati `CONTRIBUTING.md` e `README.md`

#### Fixed

- Impostato origin a `*` sulle impostazioni CORS delle rotte di upload.
