Feature: Login / Logout

  Scenario: Attempt to access /users/current before login
    When GET "/users/current"
    Then responded with status code 401
    And response matched text
      | Unauthorized |


  Scenario: Login request and verify cookie and last_login timestamp in database
    When SQL query
      | SELECT last_login FROM users WHERE email='peggy@scdp.com' |
    Then SQL query result matched pattern
      | [{ last_login: _.isSetAsMemo|last_login }] |
    When POST "/login"
      | { email: 'peggy@scdp.com', password: 'stanRizz0' } |
    Then responded with status code 200
    And response cookie "session" matched pattern
      | { value: /[\w\/+]*/, path: '/', httpOnly: true, creation: _.isDateString } |
    When SQL query
      | SELECT last_login FROM users WHERE email='peggy@scdp.com' |
    Then SQL query result matched pattern
      | [{ last_login: _.isNotEqualToMemo|last_login }] |

  Scenario: After login /users/current is accessible
    When POST "/login"
      | { email: 'peggy@scdp.com', password: 'stanRizz0' } |
    When GET "/users/current"
    Then responded with status code 200

  Scenario: Logout destroys the cookie
    When POST "/login"
      | { email: 'peggy@scdp.com', password: 'stanRizz0' } |
    And POST "/logout"
    When GET "/users/current"
    Then responded with status code 401


  Scenario: Login failure with wrong credentials
    When POST "/login"
      | { email: 'peggy@scdp.com', password: 'nonsense' } |
    Then responded with status code 401
    And GET "/users/current"
    Then responded with status code 401
