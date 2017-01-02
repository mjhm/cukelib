## Child Service

Launches shell executable servers as child processes of the cucumber process.

#### require via

```javascript
const { childService } = require('cukeserv');
```
... or standalone ...

```javascript
const childService = require('cukeserv/lib/child_service');
```


#### childService.launch(config: Object})

##### `config`

- `config` is an object that represents arguments to [`require('child_process').spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options). It's members are
   - `name: string` The name of the cukeserv service (required).
   - `cmd: string` Spawn command argument (required).
   - `args: [string]` Spawn args argument
   - `options: Object` Spawn options argument.
   - `isReady: (proc: childProcess) => Promise` the promise is resolved when the child process is ready. The default `isReady` is to resolves when the first output to stdout is received from `proc`
   - `stderrHandler: (data) =>` default is to print via `console.error(chalk.magenta(...))`
   - `stdoutHandler: (data) =>` default is to print via `console.log(chalk.magenta(...))`. Assign the function `(data) => null` for a "quiet" output.
   - `errorHandler: (err) =>` default is to print the err via `console.error(chalk.magenta(...))`

   ##### Return and side effects

   - Sets up event listeners to kill the child process when the parent process exits.
   - Returns a promise for a `cukeserv` service object:

   ```
   {
     proc: <childProcess>,
     stop: <stop Function>,
     config: <merged config object>
   }
   ```

   #### childService.initialize()

   Convenience method that wraps `serviceControl.initialize()`

   #### childService.getService(name: string)

   Returns the service object created by `childService.launch`
