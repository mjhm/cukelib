Feature: Super Simple Echo Server

  Scenario: A basic GET call just responds
    When GET "/users"
    Then responded with status code 200


  Scenario: A basic PUT call echos its input body
    Given PUT "/losers"
      """
      [
        "Sally Sad",
        "Billy Bad"
      ]
      """
    Then responded with status code 200
    And response matched pattern
      """
      [
        "Sally Sad",
        "Billy Bad"
      ]
      """
