
# Universe and it's relation to Cucumber World

The `lib/util/universe.js` code creates namespace objects that are comparable to the Cucumber "World", but are a bit more general and functional.  essentially independent of the Cucumber API. It enables the creation of a namespace object within a universe and that uniinto the Cucumber World object in every scenario. It is most useful for step libraries (such as Cucumber API) to isolate persistent library values.  The cool thing is that it uses the same `get/set` interface functions anywhere in a definition file, and it automatically switches its cukeContext depending on whether it is being called from setup code or within a step.

To use it, you just need to initialize it with `universe.initialize.call(this)` within any step or hook wrapper function. This sets up the mechanics of copying the universe values to corresponding values in each scenario's world.

The two main functions of the universe library are `get` and `set`. These wrap the Lodash [`_.get`](https://lodash.com/docs/#get) and [`_.set`](https://lodash.com/docs/#set) and use the same key/value semantics.

The `get` and `set` functions are specific to namespace so it is most convenient to define them at the top of a file via

```
const universe = require('cucumber-api/lib/util/universe');
const { get, set, universeGet } = universe.namespaceFactory('_my_namespace');
```

Then `get` and `set` can be used anywhere in the file. But keep in mind that `get/set` act on the currently executing world within steps and the Before/After hooks, and act on the the universe before it is copied to the world everywhere else.

The `universeGet` function can be used to access the values in the universe directly that are shadowed by values in the cucumber world.

Finally note that `initialize` can take an optional object that can be used to initialize default values into a universe namespace.

See the `features/support/internal_universe_test.js` file for example usage details.
