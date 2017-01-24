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

One of the main strengths of Gherkin is that the step specification language is extremely flexible, and can be adapted for the target context and a target audience. The context here is a general purpose API library whose audience is primarily developers. I discovered that writing the traditional grammatical Gherkin for this context put me on a slippery slope toward inconsistent and overly general step definitions, cluttered with regexes (e.g. `/^(?:I|they|user) requests (?:the|a|an) ([^\s]+) token$/`).

So I went in the other direction and pared down the step definitions to their barest minimum (mostly by killing articles, prepositions, and pronouns), focused on cleanly separating the step definitions from the support code, and made customization as easy as possible. I'm pretty happy with the result, and I think the documentation function of the steps for the intended audience of developers is actually improved by the terse style.

However your context is surely different, so you are encouraged to use the support code to customize your step definitions for your needs as shown above.
