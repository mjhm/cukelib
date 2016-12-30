#  Cucumber Service Library -- A Starter Kit for API Testing in Cucumber

This is toolbox of Cucumber "services" and "steps" for testing API's from Cucumber. The intent is to get you started testing your API's **right now**. Features include:

1. Starting multiple servers with automatic stopping and clean up
2. HTTP server request and response steps
3. SQL database queries
4. Shell script testing steps
6. ... and much more

All of these facilities are decoupled as much as possible, so take what you like and leave the rest. So let's dive right in.

### [Simple Echo Server Example](examples/echo_server/features/echo.feature)

This tests a server that echos back it's request body

```gherkin
Feature: Super Simple Echo Server

  Scenario: A basic GET call just responds
    Given GET "/users"
    Then responded with status code "200"


  Scenario: A basic PUT call echos its input body
    Given PUT "/losers"
      """
      [
        "Sally Sad",
        "Billy Bad"
      ]
      """
    Then responded with status code "200"
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

const { childService, requestSteps, responseSteps } = require('cukeserv');

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

That's simple enough, but there's actually a lot more going on under the hood here.

0. The `childService.spawn(...)` function launches the echo server, connects its output streams, and handles its errors.
0. Notice there's no need for an `After` hook to stop the server -- `childService.spawn(...)` also sets up its own cleanup hooks. Furthermore you can launch the server in `BeforeFeatures` or `BeforeFeature` hooks or even in actual steps and `cukeserv` will stop the server at the end of the run, at the end of the feature, at the end of the scenario as appropriate.
0. The request text is actually parsed as YAML, and...
0. The response text is matched using the [lodash-match-pattern](https://github.com/Originate/lodash-match-pattern/blob/master/README.md) library, and...
0. Both the request and support interpret single cell tables as argument strings, so features tests can be alternatively expressed:

```gherkin
Feature: Cleaner Request/Response Steps

  Scenario: A basic PUT call echos its input body
    Given PUT "/losers"
      | [ Sally Sad, Billy Bad ] |

    Then responded with status code "200"
    And response matched pattern
      | [ _.isString, /\w+\s\w+/ ] |
```


### Note about the step definitions.

For the purposes of getting you started with testing quickly, I've made some non-dogmatic choices about the included step definitions.

0. Step definitions are strictly decoupled from their support function code which are in separate respective `..._steps.js` and `..._support.js` files. This generally a good practice analogous to keeping views separate from business logic, but the main objective is encourage you to create your own more relevant and readable step definitions.
0. The step definitions are intentionally terse. This is just a choice of simplicity over readability. Terse definitions are easier to write and easier to find, but you are again encouraged to write your own.
0. The step definitions use a strict convention with "Given" and "When" (setup) steps in present tense, and "Then" (assertion) steps in past tense. This is probably a good practice overall, but it's especially necessary for disambiguating terse definitions.
0. [Postfix "... Not!"]https://en.wikipedia.org/wiki/..._Not!) steps. The module includes a tool for creating a logical opposite assertion step from a given assertion step. The step definition is the same as the original with a suffix of '... Not!'. This is to be read out loud as if from [Wayne's World](https://youtu.be/BustEdWyqzk?t=2m34s).



## Testing the repo

```
npm install
npm test
```
