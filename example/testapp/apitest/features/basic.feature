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

  Scenario: Check request steps
    Given the client gets "/videos"
    Then the response had status code "400"
    And the response matched the pattern
      """
      {
        error: {
          errors: [
            {
              reason: 'required',
              ...
            }
          ],
          ...
        }
      }
      """
