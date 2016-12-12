Feature: Knex DB queries -- happy paths

  Scenario: A basic raw request
    Given SQL query
      """
      SELECT * FROM users ORDER BY id
      """
    Then query result matched pattern
      """
      [
        {
          id: _.isInteger,
          name: _.isString,
          access_count: 0,
          created_at: _.isDateString,
          updated_at: _.isDateString,
        }
        ...
      ]

      """
