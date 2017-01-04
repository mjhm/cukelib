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

#### Apology for my Gherkin abuse.

Everything below is arguable -- which is why this library puts a high priority on making the above customization as easy as possible.

I like Gherkin for the purpose for which it was designed -- business readable test specification. However this library runs into three problems with Gherkin.

0. Gherkin step language conventions vary from project to project. For example some prefer steps like "Given I do ..." over "When doing ...".
0. The main business target of API steps are developers And technical product managers that have a higher need of precision and unambiguity over readability and language fluidity.
0. Trying to cover language variations in step definitions can create a mess of hard to read step definitions. (e.g. `/^(?:I|they|user) requests (?:the|a|an) ([^\s]+) token$/`)

Defining (or even suggesting) best practices for step definitions is way, way out-of-scope of my expertise and this library's intent. Hence I decided to just make the [step definitions as concise and unambiguous as possible](README.md#step-definitions-conventions), and let library users freely customize. However I apologize for any offense to true Gherkinistas.
