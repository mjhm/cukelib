Feature: UsersController CRUD operations

  Scenario: Verify all users
    When GET "/users"
    Then responded with status code "200"
    And response matched pattern
      | _.isSize\|3 |
    And response matched pattern
      """
      {
        <=: {
          id: _.isInteger,
          name: _.isString,
          created_at: _.isDateString,
          updated_at: _.isDateString,
        }
      }
      """


  Scenario: Verify one user
    When GET "/users/1"
    Then responded with status code "200"
    And response matched pattern
      | { id: 1, name: 'Don Draper', ... } |


  Scenario: Update a user
    When PUT "/users/1"
      | { name: 'Dick Whitman' } |
    Then responded with status code "200"
    And response matched pattern
      | { id: 1, name: 'Dick Whitman', ... } |


  Scenario: Create a user
    When POST "/users"
      | { name: 'Burt Cooper' } |
    Then responded with status code "200"
    And response matched pattern
      | { id: 4, name: 'Burt Cooper' ... } |
    When SQL query
      | SELECT * FROM users |
    Then SQL query had 4 rows


  Scenario: Destroy a user
    When DELETE "/users/3"
    Then responded with status code "200"
    And response matched pattern
      | { id: 3, name: 'Roger Sterling' ... } |
    When SQL query
      | SELECT * FROM users |
    Then SQL query had 2 rows


  Scenario: Try to verify an unknown user
    When GET "/users/99999"
    Then responded with status code "404"
    And response matched pattern
      | null |


  Scenario: Update a user with garbage
    When PUT "/users/1"
      | { garbage: 'huh' } |
    Then responded with status code "500"
    And response matched pattern
      | null |


  Scenario: Create a user with garbage
    When POST "/users"
      | { garbage: 'huh' } |
    Then responded with status code "500"
    And response matched pattern
      | null |


  Scenario: Update a user
    When PUT "/users/1"
      | { name: 'Dick Whitman' } |
    Then responded with status code "200"
    And response matched pattern
      | { id: 1, name: 'Dick Whitman', ... } |


  Scenario: Try to update an unknown user
    When PUT "/users/9999"
      | { name: 'Pete Campbell' } |
    Then responded with status code "404"
    And response matched pattern
      | null |


  Scenario: Try to delete an unknown user
    When DELETE "/users/99999"
    Then responded with status code "404"
    And response matched pattern
      | null |
