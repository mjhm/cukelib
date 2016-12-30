#  Cucumber Service Library -- A Starter Kit for API Testing in Cucumber

This is toolbox of Cucumber "services", "steps", and "hooks" for testing API's from Cucumber. The intent is to get you started testing your API's right now. Features include:

1. Starting multiple servers with automatic stopping and clean up
2. HTTP server request and response steps
3. SQL database manipulation
4. Shell script testing steps
5. [Get/Set access to namespaced parameters](UNIVERSE.md)
6. ... and much more

All of these facilities are decoupled as much as possible, so you can take what you like and leave the rest. Contributions are of course welcome.

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
