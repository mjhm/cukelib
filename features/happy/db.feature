Feature: Knex DB queries -- happy paths

  Scenario: A basic raw request
    Given SQL query
      """
      SELECT * from users
      """
    Then query result matched pattern
      """
      _.isPrinted
      """
