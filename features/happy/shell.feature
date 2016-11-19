Feature: Shell execution tests

  Scenario: test the output of a shell script
    When shell script runs
      """
      echo abc 123
      echo def 456 | cat
      echo ghi 789 1>&2
      """
    Then STDERR equaled
      """
      ghi 789
      """
    And STDOUT equaled
      """
      abc 123
      def 456
      """

  Scenario: Catch error from a shell script
    When shell script error is caught
      """
      exit 47
      """
    Then shell error code was "47"
    Then shell error code was "0" ... Not!

  Scenario: Match output by a regex
    When shell script runs
      """
      echo abc 123
      """
    Then STDOUT matched /^\w+ \d+$/


  Scenario: Match output by a template
    Given "myStringKey" is "abc"
    And "myNumberKey" is (456)
    When shell script runs
      """
      echo abc 123
      echo def 456
      """
    Then STDOUT matched
      """
      {{myStringKey}} 123
      def {{myNumberKey}}
      """
