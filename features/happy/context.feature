Feature: Context variable tests -- happy paths

  Scenario: Set and test context values
    When "myStringKey" is "myValue"
    And "myNumberKey" is (34.9)
    Then "myStringKey" was "myValue"
    And "myStringKey" was "someOtherValue" ... Not!
    And "myNumberKey" was (34.9)
    And "myNumberKey" was (43.7) ... Not!

  Scenario: Context is reset on a new scenario
    Then "myStringKey" was "myValue" ... Not!

  Scenario: "Not" variations
    Then "myStringKey" was "myValue"... not!
    Then "myStringKey" was "myValue" not!
    Then "myStringKey" was "myValue".   Not!
