Feature: Demo of more advanced uses of lodash-match-pattern


  Scenario: Check the login session cookie (print)
    When POST "/login"
      | { email: 'peggy@scdp.com', password: 'stanRizz0' } |
    Then response cookie "session" matched pattern
      | _.isPrinted |

  Scenario: Check the login session cookie (print)
    When POST "/login"
      | { email: 'peggy@scdp.com', password: 'stanRizz0' } |
    Then response cookie "session" matched pattern
      """
      {
        value: _.isBase64,
        path: '/',
        httpOnly: true,
        creation: _.isDateString
      }
      """

  Scenario: Check that the login cookie changes after second login
    When POST "/login"
      | { email: 'peggy@scdp.com', password: 'stanRizz0' } |
    Then response cookie "session" matched pattern
      | { value: _.isSetAsMemo|session_cookie, ... } |
    When POST "/logout"
    And POST "/login"
      | { email: 'peggy@scdp.com', password: 'stanRizz0' } |
    Then response cookie "session" matched pattern
      | { value: _.isNotEqualToMemo|session_cookie, ... } |


  Scenario: Check that the user's last_login timetamp changes after login (print all)
    When SQL query
      | SELECT * FROM users WHERE email='peggy@scdp.com' |
    Then SQL query result matched pattern
      | _.isPrinted |


  Scenario: Check that the user's last_login timetamp changes after login (print last_login)
    Given SQL query
      | SELECT last_login FROM users WHERE email='peggy@scdp.com' |
    Then SQL query result matched pattern
      | _.isPrinted |


  Scenario: Check that the user's last_login timetamp changes after login (print last_login)
    Given SQL query
      | SELECT last_login FROM users WHERE email='peggy@scdp.com' |
    Then SQL query result matched pattern
      | _.isPrinted |

  Scenario: Check that the user's last_login timetamp changes after login (print)
    Given SQL query
      | SELECT last_login FROM users WHERE email='peggy@scdp.com' |
    Then SQL query result matched pattern
      | [ { last_login: _.isSetAsMemo|last_login } ] |
    When POST "/login"
      | { email: 'peggy@scdp.com', password: 'stanRizz0' } |
    Then SQL query result matched pattern
      | [ { last_login: _.isNotEqualToMemo|last_login } ] |


  Scenario: Check that change password changes the password hash (print password_hash)
    Given SQL query
      | SELECT password_hash FROM users WHERE email='peggy@scdp.com' |
    Then SQL query result matched pattern
      | _.isPrinted |

  Scenario: Check that change password changes the password hash (regex)
    Given SQL query
      | SELECT password_hash FROM users WHERE email='peggy@scdp.com' |
    Then SQL query result matched pattern
      | [ { password_hash: /^\$2[aby]?\$[\d]+\$[.\/A-Za-z0-9]{53}$/ } ] |


  Scenario: Check that change password changes the password hash (custom _.isBcryptHash)
    Given SQL query
      | SELECT password_hash FROM users WHERE email='peggy@scdp.com' |
    Then SQL query result matched pattern
      | [ { password_hash: _.isBcyrptHash } ] |


  Scenario: Check that change password changes the password hash (custom _.isBcryptHash)
    Given SQL query
      | SELECT password_hash FROM users WHERE email='peggy@scdp.com' |
    Then SQL query result matched pattern
      """
      [{
        password_hash: {
          <-: _.isBcyrptHash,
          <-: _.isSetAsMemo|passwordHash
        }
      }]
      """
    When POST "/login"
      | { email: 'peggy@scdp.com', password: 'stanRizz0' } |
    And POST "/users/change_password"
      | { newPassword: 'teach the world to sing', oldPassword: 'stanRizz0' } |
    Then responded with status code 200
    Given SQL query
      | SELECT password_hash FROM users WHERE email='peggy@scdp.com' |
    Then SQL query result matched pattern
      """
      [{
        password_hash: {
          <-: _.isBcyrptHash,
          <-: _.isNotEqualToMemo|passwordHash
        }
      }]
      """
