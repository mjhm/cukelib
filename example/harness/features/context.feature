Feature: Context variable tests

  Scenario: Set and test context values
    When "myStringKey" is "myValue"
    And "myNumberKey" is (34.9)
    Then "myStringKey" was "myValue"
    And "myStringKey" was not "someOtherValue"
    And "myNumberKey" was (34.9)
    And "myNumberKey" was not (43.7)

  Scenario: Context is reset on a new scenario
    Then "myStringKey" was not "myValue"
