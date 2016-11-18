Feature: HTTP Requests sent to the default echo server

  Scenario: A basic GET call
    Given GET "/users"
    Then responded with status code "200"


  Scenario: A basic PUT call
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
        /\w+\s\w+/
      ]
      """

  Scenario: A basic GET call with 401 status code
    Given GET "/users?statusCode=401"
    Then responded with status code "402"... Throws!
