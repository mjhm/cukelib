## Knex Service

Connects to SQL databases through the [Knex Query Builder module](http://knexjs.org/).

#### require via

```javascript
const { knexService } = require('cukelib');
```
... or standalone ...

```javascript
const knexService = require('cukelib/lib/knex_service');
```

#### knexService.launch(config: Object})

##### `config`

- `config` is an object that can be passed to `knex(...)` to create a knex client with a few additional parameters and conventions.
- `config.name` can be specified as an explicit name for the `cukelib` service identifier, otherwise the service name defaults to the database name from `config.connection.database` or a sequentially named identifier.
- If `config.migrations.directory` or `config.seeds.directory` are specified the respective migrations or seeds are applied to the database when the service is launched, and the migrations are rolled back when the service stops.
- `config` is merged with the following via `_.defaultdDeep`, so be sure to specify these values explicitly as needed
- `config.debug` Set this to `true` to get a dump of attempted SQL commands
```javascript
  {
    client: 'sqlite3',
    connection: {
      filename: ':memory:',
    },
    useNullAsDefault: true,
  }
```

##### Return and side effect

- Sets universe variable `_cukelib.currentDatabase` to the name from the config.

- Returns a promise for a `cukelib` service object:

```
{
  name: <name from the config>,
  dbConn: <knex database connection object>,
  stop: <stop Function>,
  config: <merged config object>
}
```

#### knexService.initialize()

Convenience method that wraps `serviceControl.initialize()`

#### knexService.getService(name: string)

Returns the service object created by `knexService.launch`
