Feature: Basic Features for lodash-match-pattern

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

  Scenario: Check create and retrieve users
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
        Id: 1,
        Name: "alec",
        Age: 21
      }
      """
    Then the client posts to "/users" with JSON
      """
      {
        "Name": "john",
        "age": 21
      }
      """
    Then the response had status code "200"

    When the client gets "/users"
    Then the response had status code "200"
    And the response matched the pattern
      """
      [
        {
          Id: 1,
          Name: "alec",
          Age: 21
        },
        {
          Id: 2,
          Name: "john",
          Age: 21
        }
      ]
      """

  Scenario: Users are searched correctly
    When the client gets "/users?name=alec"
    Then the response had status code "200"
    And the response matched the pattern
      """
      [
        {
          Id: 1,
          Name: "alec",
          Age: 21
        },
      ]
      """

      When the client gets "/users?age=21"
      Then the response had status code "200"
      And the response matched the pattern
        """
        [
          {
            Id: 1,
            Name: "alec",
            Age: 21
          },
          {
            Id: 2,
            Name: "john",
            Age: 21
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

  Scenario: Users are delted correctly
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
            Id: 2,
            Name: "john",
            Age: 21
          }
        ]
     """
