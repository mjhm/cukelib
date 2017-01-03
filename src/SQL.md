## SQL Steps and Support Overview

The SQL steps provide a SQL interface to a `knexService` database.  The name of the database last connected through [`knexService`](knexService) will be in the universe property `currentDatabase`.  The associated connection is used for the SQL steps.  The result of the SQL query step is stashed in `_sql.responsePromise`. The response steps react to the result of the `_request.responsePromise`. In particular the `matchPattern` response function passes SQL result to the specified `lodash-match-pattern` template.
