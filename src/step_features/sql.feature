Feature: SQL step tests

  Background: Set up a table
    Given user database "udb1" is created

  Scenario: Basic raw request
    When SQL query
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

  Scenario: One line request and count rows
    When SQL query
      | SELECT * FROM users |
    Then SQL query had 1 rows

  Scenario: One line request with 0 rows
    When SQL query
      | SELECT * FROM users WHERE name='garbage' |
    Then SQL query had 0 rows

  Scenario: One line match pattern
    When SQL query
      | SELECT id FROM users LIMIT 1 |
    Then SQL query result matched pattern
      | [{ id: _.isInteger }] |

  Scenario: Bad query
    When SQL query. Throws!
      | SELECT id FROM abusers |

  Scenario: Missed match
    When SQL query
      | SELECT id FROM users LIMIT 1 |
    Then SQL query result matched pattern. Not!
      | [{ id: _.isString }] |
