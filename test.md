# Changelog

All notable changes to this project will be documented in this file.

[![CHANGELOG FORMAT](https://img.shields.io/badge/Format-keepachangelog-orange.svg)](https://keepachangelog.com/en/1.0.0/) [![VERSIONING](https://img.shields.io/badge/Versioning-semver-red.svg)](https://semver.org/spec/v2.0.0.html)

- [[Unreleased]](#unreleased)
- [[4.7.0] - 2020-09-28](#470---2020-09-28)
- [[4.6.0] - 2020-09-11](#460---2020-09-11)
- [[4.5.0] - 2020-08-17](#450---2020-08-17)
- [[4.4.0] - 2020-07-25](#440---2020-07-25)
- [[4.3.0] - 2020-07-11](#430---2020-07-11)
- [[4.2.0] - 2020-06-24](#420---2020-06-24)
- [[4.0.1] - 2020-06-10](#401---2020-06-10)
- [[4.0.0] - 2020-05-22](#400---2020-05-22)

## [Unreleased]

### Changed

#### Porta per api liveness e readiness

[![TASK](https://img.shields.io/badge/TASK-BAC%20309-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-309)

- Modificato `config.js` la porta per le risorse `api/live` e `api/ready` per impostare la porta 3003 invece di 3008 per ambiente di produzione.
- Modificato `config.dev.js` per impostare porta 3008 per liveness e readyness
- Modificati `CONTRIBUTING.md` e `README.md`

#### Ci

[![TASK](https://img.shields.io/badge/TASK-BAC%20312-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-312)

- Modificato `CONTRIBUTING.md` per cambiare gli url di gitlab in github.
- Modificato `.dockerignore` aggiungendo cartella con ci per github.

### Fixed

#### Rotte di upload

- Impostato origin a `*` sulle impostazioni CORS delle rotte di upload.

### Added

#### Search stream

[![TASK](https://img.shields.io/badge/TASK-BAC%20316-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-316)

- Aggiunto endpoint per la placemarkSearch su stream

#### Search pagination

[![TASK](https://img.shields.io/badge/TASK-BAC%20317-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-317)

- Aggiunto endpoint per la placemarkSearch paginata

#### Sync

[![TASK](https://img.shields.io/badge/TASK-BAC%20311-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-311)

- Aggiunti endpoint di sync per attributi e placemarks
- Aggiornata shared

#### Endpoint ricerca conteggio placemark per attribute per stato

[![TASK](https://img.shields.io/badge/TASK-BAC%20302-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-302)

- Aggiunto nuovo endpoint `GET  /search/attributes/:id/countByStatus` per ottenere dato un attributo il numero di placemark per stato.

#### Nuova struttura JWT e contesto

[![TASK](https://img.shields.io/badge/TASK-BAC%20310-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-310)

- Modificata la struttura del JWT corrente per essere uniformata e poter contenere il contesto e le acl e un principal generico. All'interno di `mode` è possibile sapere se il token è generato da credenziali esterne (`external_credentials`) oppure da credenziali interne (`internal_credentials`) oppure da un apptoken (`app_token`).
- Aggiunta la gestione del nuovo JWT nei mw di autenticazione e la gestione del contesto

#### Risorsa per ottenere JWT da token Yourban

[![TASK](https://img.shields.io/badge/TASK-BAC%20243-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-243)

- Aggiunta nel file `routes/custom.js` la rotta `api/custom/login` che invoca la action `remoteAuth.login` che si trova sul nodo custom_enelx.
- Aggiunta documentazione swagger per il nuovo servizio `services/remoteAuth.doc.js`.

#### Risorsa per ottenere JWT da appToken

[![TASK](https://img.shields.io/badge/TASK-BAC%20299-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-299)

- Modificato `routes/main.js`: aggiunta rotta `POST /appTokens/login`, per actions `appToken.login`.

## [4.9.0] - 2021-04-30

### Standard JWT

[![TASK](https://img.shields.io/badge/TASK-BAC%20295-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-295)

#### Changed

- Spostamento dati ed helper riguardanti le ACL su shared
- Modifica funzioni autenticazione e autorizzazione su api.service in modo che:
  - Vengano anzitutto risolte le ACLs dell'utente loggato o degli scope dell'apptoken
  - Venga risolto l'accesso alla risorsa in locale tramite un enforcer Casbin istanziato sulle acl risolte

#### Removed

- Rimosse le strategies di autenticazione basicJWT e local.

## [4.8.1] - 2020-12-21

### Added

[![TASK](https://img.shields.io/badge/TASK-BAC%20285-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-285)

- Aggiunto endpoint `PUT appTokens/:id` per la modifica di un apptoken.

## [4.8.0] - 2020-10-20

### Added

#### Unit testing nella CI

[![TASK](https://img.shields.io/badge/TASK-BAC%20280-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-280)

- Aggiunti i test JEST nella CI di Gitlab

## [4.7.0] - 2020-09-28

### Added

#### Nuovi endpoint enums drivers/parsers

[![TASK](https://img.shields.io/badge/TASK-BAC%20273-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-273)

- Aggiunto `GET /channels/drivers` e `GET /channels/parsers` per la restituzione rispettivamente dei drivers e dei parsers disponibili e i loro metadati

#### Estensione action setup.run per AKFs

[![TASK](https://img.shields.io/badge/TASK-BAC%20272-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-272)

- Aggiunto alla documentazione dell'endpoint `POST api/custom/channel/:channelId/setup` per il setup custom standard di un canale (action `setup.run`) il flag `patchAkfs` per abilitare il patch degli akfs.

## [4.6.0] - 2020-09-11

### Added

#### Servizio Widget

[![TASK](https://img.shields.io/badge/TASK-BAC%20264-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-264)

Aggiunte le rotte per il servizio widget:

- `'GET /widgets': 'widget.find'`, CRUD
- `'GET /widgets/count': 'widget.count'`, CRUD
- `'GET /widgets/:id': 'widget.get'`, CRUD
- `'GET /widgets/list/:page/:pageSize': 'widget.list'`, CRUD
- `'POST /widgets': 'widget.create'`, CRUD
- `'PUT /widgets/:id': 'widget.update'`, CRUD
- `'DELETE /widgets/:id': 'widget.remove'`, CRUD
- `'GET /attributes/:attributeId/widgets': 'widget.findByAttributeId'`, elenca i widgets per attributo
- `'GET /attributes/:attributeId/widgets/count': 'widget.countByAttributeId'`, ritorna i widgets per attributo
- `'GET /placemarks/:placemarkId/widgets': 'widget.findByPlacemarkId'`, elenca i widgets per placemark, unendo quelli ereditati tramite l'attributo. Esiste un flag per definirne il tipo di unione.
- `'GET /placemarks/:placemarkId/widgets/count': 'widget.countByPlacemarkId'` conta i widgets per placemark, unendo quelli ereditati tramite l'attributo. Esiste un flag per definirne il tipo di unione.

#### Aggiunto setup.run documentazione

[![TASK](https://img.shields.io/badge/TASK-BAC%20267-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-267)

- Aggiunto endpoint `POST api/custom/channel/:channelId/setup` per il setup custom standard di un canale (action `setup.run`).
- Aggiunta documentazione comune per il setup

## [4.5.0] - 2020-08-17

### BREAKING CHANGES - Changed

#### AppToken header retrocompatibility

[![TASK](https://img.shields.io/badge/TASK-BAC%20237-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-237)

- Rimossa retro compatibilità con `app_token` per autenticarsi con appToken con socketio o api/REST. Attualmente un middleware inoltre per ovviare a equivoci duplica chiavi in query string e headers anche nella loro versione lowercase per renderlo case-insensitive il più possibile. Consigliato sempre l'utilizzo di chiavi lowercase sia per query string che per headers.

### Added

#### Tickets riguardo i placemarks

[![TASK](https://img.shields.io/badge/TASK-BAC%20193-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-193)

- Aggiunto l'endpoint `GET api/custom/placemarks/:id/incidents` per ottenere tutti gli incidents relativi ad uno specifico placemarks. Questa risorsa fa sempre riferimento a `tickets.getIncidents` come definito in `shared/config/services.js` anche se il nodo custom dovesse cambiare. La definizione dell'endpoint è univoca rispetto alle possibili implementazioni del nodo custom ed è in `docs/common/tickets.doc.js`.

## [4.4.0] - 2020-07-25

### Added

#### TimeSeries history

[![TASK](https://img.shields.io/badge/TASK-BAC%20255-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-255)

- Aggiunto l'endpoint `GET api/custom/placemarks/:id/history` con l'action standard per il recupero dello storico di un placemark. Fa sempre riferimento a `timeseries.getHistory` come definito in `shared/config/services.js`. La definizione dell'endpoint è univoca rispetto alle possibili implementazioni ed è stata fatta in `docs/common/timeSeries.doc.js`.

### Changed

#### Refactoring docs

- Refactoring della definizione delle rotte per utilizzare `shared/config/services.js` per i nomi dei servizi e di alcune action *standard*
- Aggiornato `shared`
- Con la [BAC-255](https://ctinnovation.atlassian.net/browse/BAC-255) si è sistemato lo scaffolding degli helper della documentazione swagger: tutto è stato spostato all'interno di `/docs`. `/docs/common` contiene le definizioni di Swagger che vengono mergiate e sono utilizzabili poi dappertutto o che contengono informazioni globali. Oltre a questi sono state inserite anche le definizioni "standard" ovvero quelle che lato API non cambieranno, eventualmente cambierà la loro implementazione (come nel caso delle `timeSeries.getHistory`). Il file `/docs/swagger.config.js` si occupa di unire tutte le configurazioni comuni. All'interno di `docs/scripts` sono contenuti script per la creazione dell'SDK.

## [4.3.0] - 2020-07-11

### Changed

#### Default transporter

[![TASK](https://img.shields.io/badge/TASK-BAC%20240-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-240)

Il default transporter è impostato sul database 0.

#### Aggiornamento Moleculer

[![TASK](https://img.shields.io/badge/TASK-BAC%20250-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-250)

- Aggiornamento `moleculer` da versione `0.13.9` a `0.14.9`.
- Migrazione al nuovo sistema di metriche, rimozione `moleculer-prometheus` e servizio annesso
- Aggiornamento `moleculer-web`

### Added

#### Tests

[![TASK](https://img.shields.io/badge/TASK-BAC%20252-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-252)

- Aggiunta di primi unit tests su api.service e diagnostic.service.

#### Scenari

[![TASK](https://img.shields.io/badge/TASK-BAC%20179-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-179)

Aggiunte le seguenti nuove risorse per la gestione base del nuovo modello `scenario`:

- `'GET /users/current/scenarios': 'scenario.findByCurrentUser'` Recupero degli scenari per l'utente corrente.
- `'GET /users/current/scenarios/list/:page/:pageSize':
     'scenario.listByCurrentUser'` List scenari per l'utente corrente.
- `'GET /users/current/scenarios/:id':
     'scenario.getByCurrentUser'` Get scenari per l'utente corrente.
- `'GET /scenarios': 'scenario.find'` CRUD
- `'GET /scenarios/list/:page/:pageSize': 'scenario.list'` CRUD
- `'GET /scenarios/:id': 'scenario.get'` CRUD
- `'POST /scenarios': 'scenario.create'` CRUD
- `'PUT /scenarios/:id': 'scenario.update'` CRUD
- `'DELETE /scenarios/:id': 'scenario.remove'` CRUD

#### Aggiornamento diagnostica

- Aggiornati i nomi dei servizi da monitorare nella diagnostica del sistema.

## [4.2.0] - 2020-06-24

[![DOCS](https://img.shields.io/badge/DOCS-Breaking%20changes-blue.svg)](https://ctinnovation.atlassian.net/wiki/spaces/KAL/pages/1437564947/Breaking+changes+Unreleased)
[![DOCS](https://img.shields.io/badge/DOCS-Migrations-purple.svg)](https://ctinnovation.atlassian.net/wiki/spaces/KAL/pages/1379008574/Migrazioni+UNRELEASED)

### Changed

#### Modificato servizio placemark

[![TASK](https://img.shields.io/badge/TASK-BAC%20199-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-199)

E' stato aggiunto il campo `geometry` al modello `placemark` che fa riferimento al servizio `placemark`.

Sono modificate, nella risposta, le seguenti api:

- GET /api/placemarks
- GET /api/placemarks/:id
- GET /api/placemarks/list/:page/:pageSize
- GET /api/placemarks/tags
- GET /api/tags/{tagIdKeyValue}/placemarks
- GET /api/tagPlacemarks
- GET /api/tagPlacemarks/list/{page}/{pageSize}
- GET /api/tagPlacemarks/{tagPlacemarkId}
- GET /api/channels/{id}/placemarks/publicId/{publicId}
- GET /api/channels/{id}/placemarks/{placemarkId}
- GET /api/channels/{id}/placemarks
- GET /api/channels/{id}/placemarks/stream
- GET /api/channels/{id}/attributes/{attributeId}/placemarks
- POST /api/placemarks
- PUT /api/placemarks/:id
- DELETE /api/placemarks/:id

Esse aggiungono all'oggetto placemark (che può essere incapsulato in altri oggetti in base all'api specifica) il campo geometry:

```
{
  "geometry": {
    "type": "Point",
    "coordinates": [
      9.234625, 45.246787 // [longitudine, latitudine]
    ]
  }
}
```

Sono modificate, nella richiesta, le seguenti api:

- POST /api/placemarks
- PUT /api/placemarks/:id

Esse richiedono che nel body sia presente il campo geometry nella seguente forma:

```
{
  "geometry": {
    "type": "Point",
    "coordinates": [
      9.234625, 45.246787 // [longitudine, latitudine]
    ]
  }
}
```

#### AppToken

[![TASK](https://img.shields.io/badge/TASK-BAC%20232-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-232)

- L'header/query/param/field di default per l'inserimento dell'app token è ora `theater-app-token`. Per l'API REST questo è completamente case-insensitive mentre per socketio è case-insensitive se passato in query string. Per ora non breaking change perché ancora retro compatibile con `app_token` grazie ad un middleware. Prossimamente verrà reso definitivo.

#### Minori

- Cambiato il nome della strategy `CustomJWT` in `BasicJWT`

### Added

#### JWT con socketio

[![TASK](https://img.shields.io/badge/TASK-BAC%20242-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-242)

- Ora socketio è compatibile con token JWT. Il token può essere passato tramite la chiave in query string `jwt_access_token`.

#### Socketio su più nodi

[![TASK](https://img.shields.io/badge/TASK-BAC%20238-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-238)

- Aggiunta configurazione per abilitare socketio con redis e per permettere la propagazione degli eventi su tutti i server socketio nelle varie repliche del nodo.
- Aggiunta variabile d'ambiente per la configurazione di socketio-redis: `SOCKETIO_REDIS`.

## [4.0.1] - 2020-06-10

[![DOCS](https://img.shields.io/badge/DOCS-Breaking%20changes-blue.svg)](https://ctinnovation.atlassian.net/wiki/spaces/KAL/pages/1364459685/Breaking+changes+v4.0.1)

### Added

#### Swagger

[![TASK](https://img.shields.io/badge/TASK-BAC%20236-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-236)

- Aggiunte variabili d'ambiente per swagger: SWAGGER_BASE, SWAGGER_DOC_PATH

#### Landing page

[![TASK](https://img.shields.io/badge/TASK-BAC%20233-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-233)

- Aggiunta una landing page per l'API su `/`
- Aggiunta una cartella `public/` per contenere i file da distribuire nella route descritta all'interno di `routes/static`.

#### PUT /api/cache/tagSubject/renew

[![TASK](https://img.shields.io/badge/TASK-BAC%20221-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-221)

Aggiunta risorsa per far ricreare la cache della relazione tag-subject.

#### PUT /api/cache/tagAttribute/renew

[![TASK](https://img.shields.io/badge/TASK-BAC%20221-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-221)

Aggiunta risorsa per far ricreare la cache della relazione tag-attribute.

#### PUT /api/cache/subscriptions/renew

[![TASK](https://img.shields.io/badge/TASK-BAC%20221-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-221)

Aggiunta risorsa per far ricreare la cache delle sottoscrizioni.

#### Gestione alias con upload di file/s

[![TASK](https://img.shields.io/badge/TASK-BAC%20230-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-230)

- Sistemati i files delle rotte in modo da separare le rotte le principali (`routes/main.js`) dalle rotte con upload (`routes/upload.js`) e dalle rotte del nodo custom (`routes/custom.js`)

- File `routes/upload.js` per le rotte con caricamento di files.

- Sono state aggiunte le seguenti variabili globali: `UPLOAD_MAX_SIZE`,`UPLOAD_MAX_FILES_FIELDS`.

- Aggiunto endpoint `POST /attributesKeysFeatures/import/csv` per l'importazione di attributesKeysFeatures da un file CSV.

#### GET /attributes/:attributeId/attributesKeysFeatures/keys/:key

[![TASK](https://img.shields.io/badge/TASK-BAC%20222-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-222)

- Aggiunta route per attributeKeysFeatures.findByAttributeIdAndKey che dato un attributeId e una chiave ritorni tutti gli AKFs che hanno quelle proprietà. Utile per la UI. Struttura endpoint: GET /attributes/:attributeId/attributesKeysFeatures/keys/:key.

### Changed

#### Swagger

[![TASK](https://img.shields.io/badge/TASK-BAC%20236-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-236)

- Aggiunto un subpath `/swagger` su cui distribuire la documentazione swagger (UI) e `/swagger/resources` per la definizione JSON di OAS3.

### Fix

#### Swagger

[![TASK](https://img.shields.io/badge/TASK-BAC%20236-default.svg)](https://ctinnovation.atlassian.net/browse/BAC-236)

- Fix problematiche redirect del path `/swagger` per indirizzare verso `/swagger/`.

- Fix problematiche variabili d'ambiente di swagger parametrici.

## [4.0.0] - 2020-05-22

[![DOCS](https://img.shields.io/badge/DOCS-Breaking%20changes-blue.svg)](https://ctinnovation.atlassian.net/wiki/spaces/KAL/pages/1359314986/Breaking+changes+v4.0.0)
[![DOCS](https://img.shields.io/badge/DOCS-Migrations-purple.svg)](https://ctinnovation.atlassian.net/wiki/spaces/KAL/pages/1322319985/Migrazioni+v4.0.0)

### Changed

- GET /attributes/
  - Non più possibile passare nel querystring il campo `attributeId`
  - Campo `channelId` passato nel querystring in maniera differente rispetto a prima. Ora per fare una ricerca bisogna passare il campo query come da [specifiche di moleculer per il filtri](https://github.com/moleculerjs/moleculer-db/tree/master/packages/moleculer-db#find-).
  - Nel caso di risposta 200, ritorna un oggetto senza il campo `attributeId`.

  ```
  [{
    "id": 1,
    "channelId": 1,
    "name": "SmartParking",
    "description": "Sensori di Occupazione Parcheggio",
    "statusThresholds": {},
    "iconKey": "parking",
    "linkedObjects": [],
    "allowedKeys": null,
    "createdAt": "2019-09-16T12:51:19.558Z",
    "updatedAt": "2019-09-16T12:51:19.558Z"
  }]
  ```

- POST /attributes/
  - Non più necessario passare nel body il campo `attributeId`
  - Nel caso di risposta 200, ritorna un oggetto senza il campo `attributeId`.
- GET /attributes/{id}
  - Nel caso di risposta 200, ritorna un oggetto senza il campo `attributeId`.
- PUT /attributes/{id}
  - Non più necessario passare nel body il campo `attributeId`
  - Nel caso di risposta 200, ritorna un oggetto senza il campo `attributeId`.
- DELETE /attributes/{id}
  - Nel caso di risposta 200, ritorna un oggetto senza il campo `attributeId`.
- GET /attributes/list/{page}/{pageSize}
  - Nel caso di risposta 200, ritorna un oggetto senza il campo `attributeId`.
- GET /channels/{channelId}/attributes
  - Nel caso di risposta 200, ritorna un oggetto senza il campo `attributeId`.
- GET /tags/{tagIdKeyValue}/attributes
  - Nel caso di risposta 200, ritorna un oggetto senza il campo `attributeId`.
- GET /tagAttributes
  - Nel caso di risposta 200, ritorna un oggetto senza il campo `attributeId`.
- GET /tagAttributes/{tagAttributeId}
  - Nel caso di risposta 200, ritorna un oggetto senza il campo `attributeId`.
- GET /tagAttributes/list/{page}/{pageSize}
  - Nel caso di risposta 200, ritorna un oggetto senza il campo `attributeId`.

-------

- GET /placemarks
  - Nel caso di risposta 200, il campo `attributeId` è un intero. Si tratta della chiave primaria della tabella attribute.

  ```
  [{
    "id": 3884,
    "channelId": 51,
    "publicId": "26",
    "theaterPlacemarkId": "d7177d10-4f20-11ea-81f2-c509beaed576",
    "theaterObjectId": null,
    "attributeId": 81,
    "title": null,
    "description": null,
    "statusThresholds": null,
    "linkedObjects": [],
    "iconKey": null,
    "coordinates": {
      "lat": 45.263814443,
      "lng": 10.90627423457
    },
    "status": "SUCCESS",
    "createdAt": "2020-02-14T11:55:05.441Z",
    "updatedAt": "2020-05-20T15:25:05.609Z"
  }]
  ```

- POST /placemarks
  - nel body della richiesta, il campo `attributeId` deve essere un intero
  - Nel caso di risposta 200 il campo `attributeId` è un intero. Si tratta della chiave primaria della tabella attribute.
- GET /placemarks/{id}
  - Nel caso di risposta 200 il campo `attributeId` è un intero. Si tratta della chiave primaria della tabella attribute.
- PUT /placemarks/{id}
  - nel body della richiesta, il campo `attributeId` deve essere un intero
  - Nel caso di risposta 200 il campo `attributeId` è un intero. Si tratta della chiave primaria della tabella attribute.
- DELETE /placemarks/{id}
  - Nel caso di risposta 200 il campo `attributeId` è un intero. Si tratta della chiave primaria della tabella attribute.
- GET /placemarks/list/{page}/{pageSize}
  - Nel caso di risposta 200 il campo `attributeId` è un intero. Si tratta della chiave primaria della tabella attribute.
- GET /channels/{id}/placemarks
  - il campo `filter`, può contenere la chiave `attributes`, che è un array di interi (chiave primaria della tabella attribute).
  - Nel caso di risposta 200 il campo `attributeId` è un intero. Si tratta della chiave primaria della tabella attribute.
- GET /channels/{id}/placemarks/stream
  - il campo `filter`, può contenere la chiave `attributes`, che è un array di interi (chiave primaria della tabella attribute).
  - Nel caso di risposta 200 il campo `attributeId` è un intero. Si tratta della chiave primaria della tabella attribute.
- GET /channels/{id}/placemarks/{placemarkId}
  - Nel caso di risposta 200 il campo `attributeId` è un intero. Si tratta della chiave primaria della tabella attribute.
- GET /channels/{id}/placemarks/publicId/{publicId}
  - Nel caso di risposta 200 il campo `attributeId` è un intero. Si tratta della chiave primaria della tabella attribute.
- GET /channels/{id}/attributes/{attributeId}/placemarks
  - Nel caso di risposta 200 il campo `attributeId` è un intero. Si tratta della chiave primaria della tabella attribute.
- GET /tags/{tagIdKeyValue}/placemarks
  - Nel caso di risposta 200 il campo `attributeId` è un intero. Si tratta della chiave primaria della tabella attribute.
- GET /placemarks/tags
  - Nel caso di risposta 200 il campo `attributeId` è un intero. Si tratta della chiave primaria della tabella attribute.
- GET /tagPlacemarks
  - Nel caso di risposta 200 il campo `attributeId` è un intero. Si tratta della chiave primaria della tabella attribute.
- GET /tagPlacemarks/list/{page}/{pageSize}
  - Nel caso di risposta 200 il campo `attributeId` è un intero. Si tratta della chiave primaria della tabella attribute.
- GET /tagPlacemarks/{tagPlacemarkId}
  - Nel caso di risposta 200 il campo `attributeId` è un intero. Si tratta della chiave primaria della tabella attribute.

-------

- GET /subscriptions/
  - Nel campo `filter`, che è un oggetto json, la proprietà ritornata `attributeIds` è un array di interi.
  - Nel campo `filter`, che è un oggetto json, la proprietà ritornata `tags` è un array di stringhe che rappresentano i tag, composti come: `<key>+<value>`.

  ```
  [{
    "id": 1,
    "objectId": "string",
    "privateChannel": "86b0bd40-904e-11ea-868a-95539911ccb6",
    "host": "macmini",
    "filter": {
      "channels": [
        {
          "id": 54,
          "attributeIds": [ 76 ]
        }
      ],
      "bBox": ["43.343", "10.34", "45.345", "10.567"],
      "tags": [ "customer+comune_vr" ]
    },
    "createdAt": "2020-05-07T10:35:52.987Z",
    "updatedAt": "2020-05-18T15:15:19.188Z"
  }]
  ```

- POST /subscriptions/
  - Nella versione precedente nel campo `filter` del body erano inseriti in un array i valori del campo `attributeIds` della tabella attribute. Questo campo non esiste più e va sostituito con la chiave primaria di attribute. E' accettato un array di interi.
  - Nella versione precedente nel campo `filter` del body, alla chiave `tags`, erano inseriti in un array i valori del campo `name` della tabella tags. Questo campo non esiste più e va sostituito con la combinazione `<key>+<value>`.
    - Nella risposta, nel campo `filter`, che è un oggetto json, la proprietà ritornata `attributeIds` è un array di interi.
  - Nella risposta, nel campo `filter`, che è un oggetto json, la proprietà ritornata `tags` è un array di stringhe che rappresentano i tag, composti come: `<key>+<value>`.
- GET /subscriptions/{id}
  - Nella risposta, nel campo `filter`, che è un oggetto json, la proprietà ritornata `attributeIds` è un array di interi.
  - Nella risposta, nel campo `filter`, che è un oggetto json, la proprietà ritornata `tags` è un array di stringhe che rappresentano i tag, composti come: `<key>+<value>`.
- PUT /subscriptions/{id}
  - Nella versione precedente nel campo `filter` del body erano inseriti i valori del campo `attributeIds` della tabella attribute. Questo campo non esiste più e va sostituito con la chiave primaria di attribute. E' accettato un array di interi.
  - Nella versione precedente nel campo `filter` del body, alla chiave `tags`, erano inseriti in un array i valori del campo `name` della tabella tags. Questo campo non esiste più e va sostituito con la combinazione `<key>+<value>`.
    - Nella risposta, nel campo `filter`, che è un oggetto json, la proprietà ritornata `attributeIds` è un array di interi.
  - Nella risposta, nel campo `filter`, che è un oggetto json, la proprietà ritornata `tags` è un array di stringhe che rappresentano i tag, composti come: `<key>+<value>`.
- DELETE GET /subscriptions/{id}
  - Nella risposta, nel campo `filter`, che è un oggetto json, la proprietà ritornata `attributeIds` è un array di interi.
  - Nella risposta, nel campo `filter`, che è un oggetto json, la proprietà ritornata `tags` è un array di stringhe che rappresentano i tag, composti come: `<key>+<value>`.

-------

- GET /tags/
  - Nel caso di risposta 200, vengono ritornati i campi `key`, `value` e `keyValue` (composto come `<key>+<value>`). Non esiste più il campo `name`.

  ```
  [{
    "id": 10,
    "key": "device_type",
    "value": "algorab-pp",
    "createdAt": "2019-12-16T10:57:19.266Z",
    "updatedAt": "2019-12-16T10:57:19.266Z",
    "keyValue": "device_type+algorab-pp"
  }]
  ```

- POST /tags/
  - Necessario passare i campi `key`, `value`. Non necessario campo `name`.
  - Nel caso di risposta 200, vengono ritornati i campi `key`, `value` e `keyValue` (composto come `<key>+<value>`). Non esiste più il campo `name`.
- GET /tags/{id}
  - Nel caso di risposta 200, vengono ritornati i campi `key`, `value` e `keyValue` (composto come `<key>+<value>`). Non esiste più il campo `name`.
- PUT /tags/{id}
  - Campi facoltativi `key`, `value`. Non necessario campo `name`.
  - Nel caso di risposta 200, vengono ritornati i campi `key`, `value` e `keyValue` (composto come `<key>+<value>`). Non esiste più il campo `name`.
- DELETE /tags/{id}
  - Nel caso di risposta 200, vengono ritornati i campi `key`, `value` e `keyValue` (composto come `<key>+<value>`). Non esiste più il campo `name`.
- POST /tags/insert
  - Necessario passare i campi `key`, `value`. Non necessario campo `name`.
  - Nel caso di risposta 200, vengono ritornati i campi `key`, `value` e `keyValue` (composto come `<key>+<value>`). Non esiste più il campo `name`.
- GET /tags/list/{page}/{pageSize}
  - Nel caso di risposta 200, vengono ritornati i campi `key`, `value` e `keyValue` (composto come `<key>+<value>`). Non esiste più il campo `name`.
- GET ​/tags​/attributes
  - Nel caso di risposta 200, vengono ritornati i campi `key`, `value` e `keyValue` (composto come `<key>+<value>`). Non esiste più il campo `name`.
- GET /tags/keyvalue/{keyValue}
  - Nel caso di risposta 200, vengono ritornati i campi `key`, `value` e `keyValue` (composto come `<key>+<value>`). Non esiste più il campo `name`.
