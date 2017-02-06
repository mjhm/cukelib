Feature: Lots of Sorting and filtering

  Scenario: List all users
    Given SQL query
      | SELECT * FROM users |
    Then SQL query result matched pattern
      | _.isPrinted |


  Scenario: List all users and print each
    Given SQL query
      | SELECT * FROM users |
    Then SQL query result matched pattern
      """
      {
        <=: _.isPrinted
      }
      """

  Scenario: Check that each has an email address
    Given SQL query
      | SELECT * FROM users |
    Then SQL query result matched pattern
      """
      {
        <=: {
          email: _.isEmail
          ...
        }
      }
      """

  Scenario: List names and emails
    Given SQL query
      | SELECT * FROM users |
    Then SQL query result matched pattern
      """
      {
        <=.pick|name|email: _.isPrinted
      }
      """

  Scenario: Sort by email
    Given SQL query
      | SELECT * FROM users |
    Then SQL query result matched pattern
      """
      {
        <-.sortBy|email: _.isPrinted
      }
      """

  Scenario: Sort by name and pluck name
    Given SQL query
      | SELECT * FROM users |
    Then SQL query result matched pattern
      """
      {
        <-.sortBy|name: {
          <-.map|name: _.isPrinted
        }
      }
      """

  Scenario: Filter by boss_id
    Given SQL query
      | SELECT * FROM users |
    Then SQL query result matched pattern
      """
      {
        <-.filter|boss_id: {
          <-.map|name: _.isPrinted
        }
      }
      """
