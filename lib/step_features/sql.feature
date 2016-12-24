Feature: SQL step tests

  Background: Set up a table
    Given user database "udb1" is created

  Scenario: A basic raw request
    Given SQL query
      """
      SELECT * FROM users ORDER BY id
      """
    Then SQL query result matched pattern
      """
      [
        {
          id: _.isInteger,
          name: _.isString,
          access_count: 0,
          created_at: _.isDateString,
          updated_at: _.isDateString,
        }
      ]
      """
  #
  # Scenario: A basic raw request
  #   Given SQL query
  #     | SELECT id FROM users LIMIT 1 |
