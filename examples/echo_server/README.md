
## `echo_server` Example

The `echo_server` echo back a json response of any HTTP json request.

This demonstrates cukelib features:

0. [Simple launching of a server](./features/support/index.js#L13) using the `childService` sub-module.
0. [Set up of request and response steps](./features/support/index.js#L7)
0. [Basic usage of request response steps](./features/echo.feature)
0. [Shorthand usage of request response steps](./features/cleaner.feature)
0. Customization of step definitions: [./features/support/customization.js](./features/support/customization.js) and [./features/customization.feature](./features/customization.feature)
