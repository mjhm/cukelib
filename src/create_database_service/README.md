## Create Database Service -- PostgreSQL only

This is a convenience service that creates (and drops) an SQL database using the [Knex Query Builder module](http://knexjs.org/).

**Important Note** Before creating this "Drops" any existing database with the target database name. So you should be sure to point the name to a specific "features" database. At this time only PostgresSQL and MySQL flavors of databases are supported.

#### require via

```javascript
const { createDatabaseService } = require('cukeserv');
```
... or standalone ...

```javascript
const createDatabaseService = require('cukeserv/lib/create_database_service');
```

#### createDatabaseService.launch(config: Object})

##### `config`

- `config` is an object that can be passed to `knex(...)` to create a knex client. This is the same config object that is passed to `knex` to create a connection.
- `config.name` can be specified as an explicit name for the `cukeserv` service identifier, otherwise the service name defaults to the database name from `config.connection.database` or a sequentially named identifier.
- `config` should include at least
```
  {
    client: <(pg|mysql)>,
    connection: {
      database: <database name>
    }
  }
```

##### Return

- Returns a promise for a `cukeserv` service object:

```
{
  name: <name from the config>,
  stop: <stop Function>,
  config: <merged config object>
}
```

#### knexService.initialize()

Convenience method that wraps `serviceControl.initialize()`

#### knexService.getService(name: string)

Returns the service object created by `knexService.launch`
