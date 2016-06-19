# Sample App using cucumber-api

* The following is a sample app that uses the cucumber-api integration testing framework
  * It includes a small user database that stores users names, ages, and unique ids

## Building
* Please make sure that you have `go` installed with at least version `1.0` or greater.
(version `1.6` or newer is recommended)
* You will also need a c compiler installed on your path to compile the sqlite code.
* To compile, run `cd src`
* Then, run `make` (if you don't have `make` then just run `go build -o serv`)

## Testing
* Once you build the binary, `cd example/testapp/apitest`
* run `npm i`
* run `node_modules/.bin/cucumberjs`

## Routes
  * GET `/users` will return a json array of all users
  * GET `/users?name=namefield&age=agefield` will return all users who have names that match namefield and age that matches agefield (you can omit either search parameter)
  * POST `/users` expects a body with a field `Name` with a name and a field `Age` with an integer.
  It will create a new user with those values and return to your the newly created user formatted with JSON.
    * You can post either json encoded or form encoded
  * DELETE '/users?id=idval' will delete the user with id idval. It will return a dummy
  json with a success field when the user is deleted. If such a user existed, success is true and false otherwise.
