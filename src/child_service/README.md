## Child Service

Launches shell executable servers as child processes of the cucumber process.

#### require via

```javascript
const { childService } = require('cukelib');
```
... or standalone ...

```javascript
const childService = require('cukelib/lib/child_service');
```


#### childService.launch(config: Object})

##### `config`

- `config` is an object that represents arguments to [`require('child_process').spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options). It's members are
   - `name: string` The name of the cukelib service (required).
   - `cmd: string` Spawn command argument (required).
   - `args: [string]` Spawn args argument
   - `options: Object` [Spawn options argument (env, cwd, etc.)](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)
   - `isReadyMatch: string|RegExp` Pattern that is matched from stdout or stderr to indicate the child process is ready. Default `/./`
   - `isReady: (proc: childProcess) => Promise` the promise is resolved when the child process is ready. The default `isReady`  resolves when data from stdout or stderr matches the `isReadyMatch` pattern.
   - `stderrHandler: Function(data: string)` default is to print via `console.error(chalk.magenta(...))`
   - `stdoutHandler: Function(data: string)` default is to print via `console.log(chalk.magenta(...))`. Assign the function `(data) => null` for a "quiet" output.
   - `errorHandler: Function(err: Error)` default is to print the err via `console.error(chalk.magenta(...))`

   ##### Return and side effects

   - Sets up event listeners to kill the child process when the parent process exits.
   - Returns a promise for a `cukelib` service object:

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
