#  Cucumber Service Library -- A Toolbox for API Testing
[![NPM](https://nodei.co/npm/cukelib.png?downloads=true)](https://www.npmjs.com/package/cukelib)

![CircleCI](https://circleci.com/gh/Originate/cukelib.svg?style=shield&circle-token=:circle-token)
[![David Dependencies](https://david-dm.org/Originate/cukelib.svg)](https://david-dm.org/Originate/cukelib)
[![David devDependencies](https://david-dm.org/Originate/cukelib/dev-status.svg)](https://david-dm.org/Originate/cukelib#info=devDependencies)

Related Module:
[![lodash-match-pattern](https://img.shields.io/npm/v/lodash-match-pattern.svg?label=lodash-match-pattern)](https://www.npmjs.com/package/lodash-match-pattern)



I want to help you test your API's **right now** without having to think too much about launching services and writing steps. So what you're looking at is a toolbox of services and steps for testing API's using Cucumber. Features include:

1. Starting multiple servers with automatic stopping and clean up
2. HTTP server request and response steps
3. SQL database queries
4. Shell script testing steps
6. ... and much more

All of these facilities are decoupled as much as possible. You can take what you like and leave the rest. So let's dive right in.

### [Simple Echo Server Example](examples/echo_server/features/echo.feature)

This tests a simple server that echos back it's request body. ([Apologies for Gherkin abuse.](customization.md#apology-for-my-gherkin-abuse))

```gherkin
Feature: Super Simple Echo Server

  Scenario: A basic GET call just responds
    Given GET "/users"
    Then responded with status code 200


  Scenario: A basic PUT call echos its input body
    Given PUT "/losers"
      """
      [
        "Sally Sad",
        "Billy Bad"
      ]
      """
    Then responded with status code 200
    And response matched pattern
      """
      [
        "Sally Sad",
        "Billy Bad"
      ]
      """
```

Here's all the [support code](examples/echo_server/features/support/index.js) that's needed:

```JavaScript

const { childService, requestSteps, responseSteps } = require('cukelib');

module.exports = function () {
  childService.initialize.call(this);

  requestSteps.call(this, {
    host: 'http://localhost:3001'
  });
  responseSteps.call(this);

  this.Before(() => {
    return childService.spawn({
      name: 'echo_server',
      cmd: 'node',
      args: [`${__dirname}/../../index.js`, '--port=3001'],
    });
  });
};

```

That's simple enough, but there's actually a lot going on under the hood here.

0. The `childService.spawn(...)` function launches the server, connects its output streams, and handles its errors.
0. Notice there's no need for an `After` hook to stop the server -- `childService.spawn(...)` also sets up its own cleanup hooks.
0. Furthermore you can launch the server in `BeforeFeatures` or `BeforeFeature` hooks or even in actual steps, and `cukelib` will stop and cleanup the server at the end of the run, at the end of the feature, or at the end of the scenario as appropriate.
0. The request text is actually parsed as YAML, and...
0. The response text is matched using the [lodash-match-pattern](https://github.com/Originate/lodash-match-pattern/blob/master/README.md) library, and...
0. Both the request and support interpret single cell tables as argument strings, so a similar scenario can be concisely expressed:

```gherkin
Feature: Cleaner Request/Response Steps

  Scenario: A basic PUT call echos its input body
    Given PUT "/losers"
      | [ Sally Sad, Billy Bad ] |

    Then responded with status code 200
    And response matched pattern
      | [ _.isString, /\w+\s\w+/ ] |
```

Interested? Yeah, we're just getting started, but before we get into some details, here's some ...

### Conventions

The library is generally organized around services and steps. Although it's mostly non-opinionated there are some organizational conventions. First the library avoids the Cucumber "World" object, and implements its own "Universe" mechanism under the covers. This leaves you free to manage the World as needed or access and use the Universe functionality as well.

#### Service conventions

All of the services are variations on the theme illustrated by `childService` in the support code snippet above. They all implement `launch` and `stop` functionality and automatically run their `stop` functions within an appropriate testing life-cycle hook. All of the services and most of the steps also have `initialize` functions. In most cases it's fine to just call any one of them at the beginning of a step definition file.

And yes, it's possible and in fact typical, to launch multiple concurrent services.

#### Step definitions conventions

For the purposes of getting you started with testing quickly, I've made some non-dogmatic choices about the included step definitions.

0. Step definitions are strictly decoupled from their support function code which are in separate respective `..._steps.js` and `..._support.js` files. This generally a good practice analogous to keeping views separate from business logic, but my main objective is to allow you to [customize](customization.md) your own more relevant and readable step definitions.
0. The step definitions are intentionally terse. This is just a choice of simplicity over readability. Terse definitions are easier to write and easier to find, but again, you're free to [customize](customization.md) your own.
0. The step definitions follow a strict convention with "Given" and "When" (setup) steps in present tense, and "Then" (assertion) steps in past tense. This is probably a good practice overall, but it's especially necessary for disambiguating terse definitions.
0. [Postfix ... Not!](https://en.wikipedia.org/wiki/..._Not!) steps. The module includes a [tool](src/step_mods) for creating a logical opposite assertion steps from assertion steps. The step definition is the same as the original with a suffix of '... Not!'. This is to be read out loud as if from [Wayne's World](https://youtu.be/BustEdWyqzk?t=2m34s).


### Library Details

1. [Universe](src/universe/README.md) manages a namespaced object which is copied from the "universe" scope to the feature scope for each new feature, and is copied from the feature scope to the scenario scope for each new scenario. Most of the steps and service make use of the Universe for their internal state.
2. [Service Control](src/service_control) is the abstract parent of all of the services.
3. [Child Service](src/child_service) launches shell executable servers as child processes of the cucumber process.
4. [Embed Service](src/embed_service) launches NodeJS servers (e.g. `http.Server`) embedded within the cucumber process.
5. [Knex Service](src/knex_service) connects to SQL databases via the [knex query builder](http://knexjs.org/).
5. [Create Database Service](src/create_database_service) is a convenience service to create (and drop) feature databases.
6. [Selenium Standalone Service](src/selenium_standalone_service) launches the selenium standalone server. This is included for completeness. Most likely you are managing your Selenium server separately.
7. [WebdriverIO Service](src/webdriverio_service) launches the [WebdriverIO](http://webdriver.io/guide.html) Selenium interface as an embedded service within the cucumber process.
8. [GetSet Steps](src/getset_steps.js) exposes access to the "universe" objects as cucumber steps.
9. [Request Steps](src/request_steps.js) provides cucumber steps for issuing http requests, usually to servers launched by the Child or Embed services.
9. [Request Response Overview](src/REQUEST_RESPONSE.md)
10. [Response Steps](src/response_steps.js) are for interpreting the results of Request Steps.
10. [SQL Overview](src/SQL.md)
11. [SQL Steps](src/sql_steps.js) provides steps for issuing and interpreting results of SQL commands issued through Knex Services.
12. [Shell Steps](src/shell_steps.js) for running and interpreting output of shell scripts.
12. [Not! and Throw! Steps](src/step_mods) wrappers for generating logical "Not!" steps (Throw! steps are useful for testing the development of step libraries such as this one. They aren't useful for general library usage.)
13. [Diagnostic Steps](src/diagnostic_steps.js) for inspecting the state of the universe and debugging potential confusion.

### Examples

0. [Simple Echo Server](examples/echo_server) -- Child Service, Request Steps, Response Steps.
0. [Ad Server](examples/ad_server) -- Child Service, Create Database Service, Knex Service, SQL Steps, Request Steps, Response Steps

### Diagnostic Tips

1. Run with environment variable cukelib_VERBOSITY set to 1, 2, or 3

### Contributing

**Thank You in Advance.**  By all means submit issues, bug reports, suggestions, etc. to the [github issues](https://github.com/Originate/cukelib/issues).
