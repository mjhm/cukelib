Feature: Cleaner Request/Response Steps

  Scenario: A basic PUT call echos its input body
    When PUT "/losers"
      | [ Sally Sad, Billy Bad ] |

    Then responded with status code 200
    And response matched pattern
      | [ _.isString, /\w+\s\w+/ ] |
