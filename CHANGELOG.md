
#### 0.5.0

* JSdoc
* Fixes for unwanted persistence of some support variables
* Fixes for a cookie bug
* Demo features in login_server example
* Misc cleanup in features

#### 0.4.0

* Clarified shell steps.

#### 0.3.2

* Update isReadyMatch to watch stderr as well as stdout

#### 0.3.1

* Add child_process isReadyMatch

#### 0.3.0

* Change `requestSupport` code to attach the request result to the universe instead of just a promise.
* Implement the `login_server` example.
* Add to `responseSupport` for headers and cookies steps.
* Fix bug with single line patterns with matchers that used "|" arguments.
* Allow `requestPUT` and `requestPOST` to take an empty body.
* Better support for MySQL
