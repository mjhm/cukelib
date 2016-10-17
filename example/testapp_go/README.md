# Sample App using cucumber-api

* The following is a sample app that uses the cucumber-api integration testing framework
  * It includes a small user database that stores users names, ages, and unique ids

## Requirements
* [`go` version >1.6](https://golang.org/doc/install)
* C compiler (to compile the sqlite driver)
* [Node version >4.0](https://nodejs.org)
* [make](https://www.gnu.org/software/make/#download)

## Building, Running, Testing
* `cd src`
* `make` (or `make serv`) compiles.
* `make run` -- launches the server on localhost
* `make test` -- installs node modules and runs the cucumber features in `../apitest`
  * Note: the server defaults to port 3000, however, you can give the server an different port by specifying an option at the command line like so: `./serv --port 8080` and modifying the port in `support/scenario_hooks.js`

## Routes
  * GET `/users` will return a json array of all users
  * GET `/users?name=namefield&age=agefield` will return all users who have names that match namefield and age that matches agefield (you can omit either search parameter)
  * POST `/users` expects a body with a field `Name` with a name and a field `Age` with an integer.
  It will create a new user with those values and return to your the newly created user formatted with JSON.
    * You can post either json encoded or form encoded
  * DELETE '/users?id=idval' will delete the user with id idval. It will return a dummy
  json with a success field when the user is deleted. If such a user existed, success is true and false otherwise.
