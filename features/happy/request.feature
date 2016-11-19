Feature: HTTP Requests sent to the "echo_server" -- happy paths

  Scenario: A basic GET call
    Given GET "/users"
    Then responded with status code "200"


  Scenario: A basic PUT call matches a lodash-match-pattern
    Given PUT "/losers"
      """
      [
        "Sally Sad",
        "Billy Bad"
      ]
      """
    Then responded with status code "200"
    And response matched pattern
      """
      [
        _.isString,
        /B\w+\sB\w+/
      ]
      """
