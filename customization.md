## Customization of Steps

The strong decoupling of steps and their support code makes customization of steps easy.  Suppose you want the feature file from the [README](README.md) to look like this:

```cucumber
Feature: Scenario definitions with more natural English

  Scenario: A GET call just responds
    When making a GET request to "/users"
    Then the API responds with status code 200


  Scenario: A PUT call echos its input body
    When making a PUT to "/losers" with the payload:
      """
      [
        "Sally Sad",
        "Billy Bad"
      ]
      """
    Then the API responds with the status code 200 and the payload:
      """
      [
        "Sally Sad",
        "Billy Bad"
      ]
      """
```

Then you can use `request_support.js` and `response_support.js` directly in your support file instead of the predefined steps.


```javascript
const { childService, requestSupport, responseSupport } = require('cukelib');

module.exports = function () {
  childService.initialize.call(this);

  this.When(/^making a GET request to "([^"]+)"$/, requestSupport.requestGET);
  this.When(/^making a PUT to "([^"]+)" with the payload:$/, requestSupport.requestPUT);
  this.Then(/^the API responds with status code (\d+)$/, responseSupport.statusCode);
  this.Then(/^the API responds with the status code (\d+) and the payload:$/, (code, payload) =>
      responseSupport.statusCode(code)
      .then(() =>
        responseSupport.matchPattern(payload)
      )
  );

  this.Before(() => {
    return childService.spawn({
      name: 'echo_server',
      cmd: 'node',
      args: [`${__dirname}/../../index.js`, '--port=3001'],
    });
  });
};

// Boilerplate to make this file compatible with cucumber versions 1 or 2
const cucumber = require('cucumber');

if (cucumber.defineSupportCode) {
  cucumber.defineSupportCode((context) => {
    module.exports.call(context);
  });
}
```

### Note on exceptionally terse Gherkin.

One of the strengths of Gherkin is the extremely flexible step specification language which can easily be adapted for a target context and audience. This context for `cukelib` is a general purpose API library whose audience is primarily developers. The traditional grammatical Gherkin for this context turned out to be a slippery slope toward inconsistent, overly general step definitions, and cluttered with regexes (e.g. `/^(?:I|they|user) requests (?:the|a|an) ([^\s]+) token$/`).

In contrast paring down the step definitions to their barest minimum (mostly by killing articles, prepositions, and pronouns), focusing on cleanly separating the step definitions from the support code, and making customization as easy as possible, turned out to be a cleaner simpler route. Furthermore IMHO think the documentation function of the steps for the intended audience of developers is actually improved by the terse style.

However your context is surely different, so you are encouraged to use the support code to customize your step definitions for your needs as shown above.
