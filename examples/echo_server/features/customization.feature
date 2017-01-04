Feature: Scenario definitions with more natural English

  Scenario: A GET call just responds
    When making a GET request to "/users"
    Then the API responds with status code 200


  Scenario: A PUT call echos its input body
    When making a PUT to "/losers" with the payload:
      """
      [
        "Sally Sad",
        "Billy Bad"
      ]
      """
    Then the API responds with the status code 200 and the payload:
      """
      [
        "Sally Sad",
        "Billy Bad"
      ]
      """
