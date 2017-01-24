Feature: HTTP Requests sent to the "echo_server"

  Background: Setup server
    Given launch "echo" test server

  Scenario: A basic GET call
    When GET "/users"
    Then responded with status code 200


  Scenario: Default headers
    Given GET "/bounce"
    Then response headers matched pattern
      """
      {
        'x-powered-by': 'Express',
        'content-type': 'application/json; charset=utf-8',
        'content-length': '2',
        etag: _.isString,
        date: _.isDateString,
        connection: 'close'
      }
      """

  Scenario: Set a cookie
    Given POST "/set_cookie"
      | [ 'test_cookie', 'test_cookie_value' ] |
    Then response headers matched pattern
      | { 'set-cookie': [ 'test_cookie=test_cookie_value; Path=/', ], ... } |
    Then response cookies matched pattern
      """
      [
        {
          key: 'test_cookie',
          value: 'test_cookie_value',
          path: '/',
          creation: _.isDateString
        },
      ]
      """
    Then response cookie "test_cookie" matched pattern
      | { value: 'test_cookie_value', path: '/', creation: _.isDateString } |
    Then response cookie "no_cookie" matched pattern
      | null |



  Scenario: Set multiple copies of a cookie
    Given POST "/set_cookies"
      """
      [
        [ 'test_cookie', 'test_cookie_value' ],
        [ 'test_cookie', 'test_cookie_value2' ]
      ]
      """
    Then response cookies matched pattern
      """
      [
        { key: 'test_cookie', value: 'test_cookie_value', ... },
        { key: 'test_cookie', value: 'test_cookie_value2', ... },
      ]
      """
