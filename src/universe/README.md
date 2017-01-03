## Universe

#### Overview

The universe module manages a namespaced object which is copied from the "universe" scope to the feature scope for each new feature, and is copied from the feature scope to the scenario scope for each new scenario. Most of the steps and service make use of the Universe for their internal state. So for example values that are set in a "universe" context persist in all steps unless they are masked by value set in a "feature" or "scenario" context. Values that are set in a "scenario" context are not persisted into other scenarios.

The universe module is comparable to the Cucumber World object, but it's entirely independent. The `cukeserv` module uses the `_cukeserv` namespace, so for example all of it's active services are in the universe's `_cukeserv._services` object. You may directly use GetSet [steps](../getset_steps.js) and [support](../getset_support.js) for general access to the `_cukeserv` universe namespace and associated steps. Alternatively you can define and use your own namespaces. [Although.](https://notalwaysright.com/wp-content/uploads/2014/01/Common-Sense-just-because-you-can-doesnt-mean-you-should.jpg)

If you're ever confused about the state of the Universe you can insert [diagnostic steps](../diagnostic_steps.js) into your feature files to inspect all or part of the universe/feature/scenario state.

Use GetSet [steps](../getset_steps.js) and [support](src/getset_support.js) for general access to the `_cukeserv` universe namespace and associated steps.

**Note.** The universe should be initialized before any any hooks or steps that use the `cukeserv` facilities.
You mostly don't need to worry about this because this is generally done automatically by the service's `initialize` functions, and they will complain if it isn't initialized.

#### Details

##### require('cukeserv').universe.namespaceFactory(namespace: string)

Typical usage:
```javascript
const { get, set } = require('cukeserv').universe..namespaceFactory(`_cukeserv`);
```
This example exposes `get` and `set` for the `_cukeserv` namespace.

The complete list of `namespaceFactory` functions are:

##### getCukeContext() => string (universe|feature|scenario)

This returns the current execution context. Essentially it will be 'universe' within a `BeforeFeatures/AfteFeatures` hook, 'feature' within a `BeforeFeature/AfterFeature` hook and `scenario` within `Before/After` hooks and step functions.


#### Scenario context functions

The following operate in on the current scenario's copy of the namespace object in a "scenario" context. They operate on the "feature" or "universe" copy of the object when in they are used in the respective "feature" or "universe" context.

##### get(path: string)

Essentially a wrapper around [lodash get](https://lodash.com/docs/4.17.4#get) as `_.get(<scenario object>, path)`

##### set(path: string, value: any)

Essentially a wrapper around [lodash set](https://lodash.com/docs/4.17.4#set) as `_.set(<scenario object>, path, value)`

##### hasKey(path: string)

Essentially a wrapper around [lodash has](https://lodash.com/docs/4.17.4#has) as `_.has(<scenario object>, path)`

##### unset(path: string)

Essentially a wrapper around [lodash unset](https://lodash.com/docs/4.17.4#unset) as `_.unset(<scenario object>, path)`

#### Context specific functions

##### featureGet(path: string)

Like `get` but reaches into the containing "feature" context object.

##### universeGet(path: string)

Like `get` but reaches into the containing "universe" context object.

##### initializeWith(initObj: Object)

This initializes the universe namespace and copies `initObject` onto the universe context object.

##### inspect(arg1, arg2)

Wrapper for node `util.inspect`.  If `arg1` is a string the context object at that path will be inspected, Otherwise the whole object will be inspected. If the second argument is supplied then that will be passed to `util.inspect` as an options argument.


#### require via

```javascript
const { universe } = require('cukeserv');
```
... or standalone ...

```javascript
const universe = require('cukeserv/lib/universe');
```
