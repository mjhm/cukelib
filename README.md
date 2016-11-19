# cucumber-api -- A Starter Kit for API Testing in Cucumber

This is toolbox of Cucumber "steps" and "hooks" for testing API's in Cucumber. The intent is to get you started testing your API's right now, so the steps and hooks include:

1. Starting / Stopping multiple servers
2. HTTP server requests and responses
3. Independent SQL database manipulation (via knex)
4. Steps for running shell and testing scripts
5. Get/Set access to namespaces in the cucumber "world"

All of these facilities are decoupled as much as possible, so you can take what you like and leave the rest. Contributions are of course welcome.

### Note about the step definitions.

For the purposes of getting you started with testing quickly, I've made some non-dogmatic choices about the included step definitions.

# Step definitions are strictly decoupled from their support function code which are in separate respective `..._steps.js` and `..._support.js` files. This generally a good practice along the lines of keeping views separate from business logic, but the main objective is encourage you to create your own more relevant and readable step definitions.
# The step definitions are intentionally terse. This is just a choice of simplicity over readability. Terse definitions are easier to write and easier to find, but you are again encouraged to write your own.
# The step definitions use a strict convention with "Given" and "When" (setup) steps in present tense, and "Then" (assertion) steps in past tense. This is probably a good practice overall, but it's especially necessary for disambiguating terse definitions.
# [Postfix "... Not!"]https://en.wikipedia.org/wiki/..._Not!) steps. The module includes a tool for creating a logical opposite assertion step from a given assertion step. The step definition is the same as the original with a suffix of '... Not!'. This is to be read out loud as if from [Wayne's World](https://youtu.be/BustEdWyqzk?t=2m34s).


This is Cucumber JS step definitions for API testing
