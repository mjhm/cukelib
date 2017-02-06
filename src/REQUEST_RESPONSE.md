## Request/Response Steps and Suppport Overview

The request steps and support functions wrap the standard [request](https://github.com/request/request) module. The request module provides a lot of flexibility constructing the request options. The default options are

```
{
  host: 'http://localhost:3000',
  method: 'GET',
  simple: false,
  body: {},
  resolveWithFullResponse: true,
  json: true,
  jar: true
}
```

This can be overridden first by members of the object passed to the `requestSupport.initialize` function. Typically this will execute in a cucumber "Before" hook and is stashed in the `_request.defaultOptions` universe property. Then in individual steps, parameters can be further overridden. In particular most of the steps allow for the specification of `method`, `body` and by a `routeStr`. The `routeStr` is parsed and combined with the `host` to create the request `url`.

The result of the request is a promise that is stored in the `_requestResponsePromise` and the actual options passed are stashed in `_requestOptions`.

The response steps react to the result of the `_requestResponsePromise`. In particular the `matchPattern` response function passes the response body to the specified `lodash-match-pattern` template.
