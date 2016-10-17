Feature: Basic Features of lodash-match-pattern for testing API endpoints and headers

  Background:
    The database is seeded with basic info

  Scenario: Check shell steps
    When this shell script runs
      """
      ls
      """
    Then STDOUT matched
      """
      features
      node_modules
      package.json
      """
    And the shell output is reset
    Then STDOUT matched
      """
      """
    And this shell script runs
      """
      pwd
      """
    Then STDOUT matched
      """
      /apitest/
      """

  Scenario: Check root request
    Given the client gets "/"
    Then the response had status code "404"

  Scenario: Check create users
    Given the database is reset
    And the client gets "/users"
    Then the response had status code "200"
    And the response matched the pattern
      """
      []
      """
    Then the client posts to "/users" with query string
      """
      name=alec&age=21
      """
    Then the response had status code "200"
    Then the response matched the pattern
      """
      {
        id: 1,
        name: "alec",
        age: 21
      }
      """
    Then the client posts to "/users" with JSON
      """
      {
        "name": "john",
        "age": 21
      }
      """
    Then the response had status code "200"

  Scenario: Check retrieve Users
    Give the database is populated with sample users
    When the client gets "/users"
    Then the response had status code "200"
    And the response matched the pattern
      """
      [
        {
          id: 1,
          name: "alec",
          age: 21
        },
        {
          id: 2,
          name: "john",
          age: 21
        }
      ]
      """

  Scenario: Check search users
    Given the database is populated with sample users
    When the client gets "/users?name=alec"
    Then the response had status code "200"
    And the response matched the pattern
      """
      [
        {
          id: 1,
          name: "alec",
          age: 21
        },
      ]
      """

      When the client gets "/users?age=21"
      Then the response had status code "200"
      And the response matched the pattern
        """
        [
          {
            id: 1,
            name: "alec",
            age: 21
          },
          {
            id: 2,
            name: "john",
            age: 21
          }
        ]
        """

      When the client gets "/users?age=23"
      Then the response had status code "200"
      And the response matched the pattern
        """
          []
        """

      When the client gets "/users?name=alec&age=22"
      Then the response had status code "200"
      And the response matched the pattern
        """
          []
        """

  Scenario: Users are deleted correctly
    Given the database is populated with sample users
    When the client deletes "/users?id=1"
    Then the response had status code "200"
    And the response matched the pattern
      """
      {
        Success: true
      }
      """
    When the client deletes "/users?id=9"
    Then the response had status code "200"
    And the response matched the pattern
      """
        {
          Success: false
        }
      """

    When the client gets "/users"
    Then the response had status code "200"
    And the response matched the pattern
      """
        [
          {
            id: 2,
            name: "john",
            age: 21
          }
        ]
     """

  Scenario: Db check
    Given the client posts to "/users" with JSON
      """
      {
        "name": "davy",
        "age": 47
      }
      """
    And the SQL query
      """
      SELECT * from users
      """
    Then the query result matched the pattern
      """
      {
        <-.sortBy|id: {
          <-.last: {
            name: 'davy',
            age: 47,
            ...
          }
        }
      }
      """
