Feature: HTTP Requests sent to the "echo_server" -- sad paths

  Scenario: A basic GET call with 401 status code doesn't match the step
    Given GET "/users?statusCode=401"
    Then responded with status code "402"... Throws!


  Scenario: A basic PUT call doesn't match a pattern
    Given POST "/mismatch"
      """
      {
        "female": "Sally Sad",
        "male": "Billy Bad"
      }
      """
    Then response matched pattern ... Throws!
      """
      {
        male: "Sally Sad",
        female: "Billy Bad"
      }
      """
