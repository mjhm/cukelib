Feature: Demo of basics of lodash-match-pattern
Shows the workflow from printing out the results of HTTP request
to the construction of non-brittle tests.

  Background:
    When POST "/login"
      | { email: 'peggy@scdp.com', password: 'stanRizz0' } |


  Scenario: Test basic response of /users/current (just printing variation A)
    When GET "/users/current"
    Then response matched pattern
      | _.isPrinted |


  Scenario: Test basic response of /users/current (just printing variation B)
    When GET "/users/current"
    Then response matched pattern
      """
      _.isPrinted
      """

  Scenario: Test basic response of /users/current (copy of _.isPrinted output)
    Fails test is over specified because date is not deterministic
    When GET "/users/current"
    Given PENDING
    Then response matched pattern
      """
      {
        id: 3,
        name: 'Peggy Olson',
        email: 'peggy@scdp.com',
        boss_id: 1,
        last_login: '2017-02-05T18:11:12.000Z',
        created_at: '2017-02-05T18:11:11.000Z',
        updated_at: '2017-02-05T18:11:11.000Z',
        boss: { id: 1, name: 'Don Draper', email: 'don@scdp.com' }
      }
      """

  Scenario: Test basic response of /users/current (use matchers for non deterministic values)
    When GET "/users/current"
    Then response matched pattern
      """
      {
        id: _.isInteger,
        password_hash: _.isOmitted,
        name: 'Peggy Olson',
        email: 'peggy@scdp.com',
        boss_id: _.isInteger,
        last_login: _.isDateString,
        created_at: _.isDateString,
        updated_at: _.isDateString,
        boss: {              ## also try boss: _.isObject or boss: _.isPrinted
          id: _.isInteger,
          name: _.isString,
          email: _.isEmail
         }
      }
      """

# ---------

  Scenario: Change user's name (printed)
    When PUT "/users/current"
      | { name: 'Peggy Rizzo' } |
    Then responded with status code 200
    When GET "/users/current"
    Then response matched pattern
      | _.isPrinted |


  Scenario: Change user's name (copy of _.isPrinted output)
    When PUT "/users/current"
      | { name: 'Peggy Rizzo' } |
    Then responded with status code 200
    Given PENDING
    When GET "/users/current"
    Then response matched pattern
      """
      {
        id: 3,
        name: 'Peggy Rizzo',
        email: 'peggy@scdp.com',
        boss_id: 1,
        last_login: '2017-02-05T22:25:08.000Z',
        created_at: '2017-02-05T22:25:08.000Z',
        updated_at: '2017-02-05T22:25:08.000Z',
        boss: { id: 1, name: 'Don Draper', email: 'don@scdp.com' }
      }
      """

  Scenario: Change user's name (Just the essentials)
    When PUT "/users/current"
      | { name: 'Peggy Rizzo' } |
    Then responded with status code 200
    When GET "/users/current"
    Then response matched pattern
      """
      {
        name: 'Peggy Rizzo',
        email: 'peggy@scdp.com'
        ...
      }
      """

  Scenario: Change user's name (Just the essentials one liner)
    When PUT "/users/current"
      | { name: 'Peggy Rizzo' } |
    Then responded with status code 200
    When GET "/users/current"
    Then response matched pattern
      | { name: 'Peggy Rizzo', email: 'peggy@scdp.com', ... } |
