Feature: HTTP Requests sent to the "echo_server"

  Background: Setup server
    Given launch "echo" test server

  Scenario: A basic GET call
    When GET "/users"
    Then responded with status code 200


  Scenario: A basic PUT call matches a lodash-match-pattern
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
        _.isString,
        /B\w+\sB\w+/
      ]
      """

  Scenario: One line request and response
    Given POST "/bounce"
      | { rubber: 'buggy', baby: 'bumpers' } |
    Then response matched pattern
      | { rubber: _.isString, baby: /b\w+/ } |

  Scenario: Template request
    Given "replaceBuggy" is "bubby"
    Given POST "/bounce"
      | { rubber: '{{replaceBuggy}}', baby: 'bumpers' } |
    Then response matched pattern
      | { rubber: 'bubby', baby: /b\w+/ } |

  Scenario: Template response
    Given "replaceBuggy" is "bubby"
    Given POST "/bounce"
      | { rubber: 'bubby', baby: 'bumpers' } |
    Then response matched pattern
      | { rubber: '{{replaceBuggy}}', baby: /b\w+/ } |

  Scenario: Matching a literal text response
    Given POST "/text/bounce"
      | A line of text |
    Then response matched text
      | A line of text |

  Scenario: Matching a text response with a regex
    Given POST "/text/bounce"
      | A line of text |
    Then response matched text
      | /.*\stext/ |


  Scenario: Matching a literal text response Not!
    Given POST "/text/bounce"
      | A line of text |
    Then response matched text. Not!
      | A line of tex |

  Scenario: Matching a text response with a regex Not!
    Given POST "/text/bounce"
      | A line of tex |
    Then response matched text. Not!
      | /.*\stext/ |



  Scenario: A basic GET call with 401 status code doesn't match the step
    When GET "/users?statusCode=401"
    Then responded with status code 402... Not!


  Scenario: A basic PUT call doesn't match a pattern
    Given POST "/mismatch"
      """
      {
        "female": "Sally Sad",
        "male": "Billy Bad"
      }
      """
    Then response matched pattern ... Not!
      """
      {
        male: "Sally Sad",
        female: "Billy Bad"
      }
      """
