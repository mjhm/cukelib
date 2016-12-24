Feature: SQL step tests

  Background: Set up a table
    Given user database "udb1" is created

  Scenario: Basic raw request
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

  Scenario: One line request and count rows
    Given SQL query
      | SELECT * FROM users |
    Then SQL query had 1 rows

  Scenario: One line request with 0 rows
    Given SQL query
      | SELECT * FROM users WHERE name='garbage' |
    Then SQL query had 0 rows

  Scenario: One line match pattern
    Given SQL query
      | SELECT id FROM users LIMIT 1 |
    Then SQL query result matched pattern
      | [{ id: _.isInteger }] |

  Scenario: Bad query
    Given SQL query. Throws!
      | SELECT id FROM abusers |

  Scenario: Missed match
    Given SQL query
      | SELECT id FROM users LIMIT 1 |
    Then SQL query result matched pattern. Not!
      | [{ id: _.isString }] |
