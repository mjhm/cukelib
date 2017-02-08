
## `login_server` Example

The `login_server` implements a simple login flow API using a cookie session. The primary demonstration in this example is the [`lodash-match-pattern`](https://github.com/Originate/lodash-match-pattern) workflow.

To install modules and run tests

```
npm install
npm test
```

To run an individual scenario

```
npm run features features/demo1_users.feature:10
```

0. [demo1_users.feature](./features/demo1_users.feature) shows the workflow from printing out the results of HTTP request to the construction of non-brittle tests. The key ideas are printing the results of a request, using matcher functions in response patterns, and partial matches.
0. [demo2_users.feature](./features/demo2_users.feature) shows the use of `lodash-match-pattern` on other JSON objects -- [parsed cookie objects](./features/demo2_users.feature#L13) and [SQL query results](./features/demo2_users.feature#L35). It also shows the use of the ["memo" functionality](./features/demo2_users.feature#L58), and the [definition](./features/support/index.js#L15) and [use of a custom matcher](./features/demo2_users.feature#L83)
0. [demo2_users.feature](./features/demo2_users.feature) shows a variety of examples of using filtering and sorting transforms within a match pattern.

Features demonstrated for cukelib include

0. [Connecting to a MySQL database](./features/support/index.js#L35)
0. [Launching a server via the childService]((./features/support/index.js#L37)
0. [Setup of request, response, and SQL steps]((./features/support/index.js#L24)
