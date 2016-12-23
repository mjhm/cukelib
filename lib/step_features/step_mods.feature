Feature: Not and Throw tests

  Scenario: "Not!" variations
    Then "myStringKey" was "myValue"... not!
    Then "myStringKey" was "myValue" not!
    Then "myStringKey" was "myValue".   Not!

  Scenario: "Throw!" variations
    Given "_illegalKey" is "whatever" Throws!
    Given "_illegalKey" is "whatever" throws!
    Given "_illegalKey" is "whatever"... Throws!
    # Note that compound "Not! Then! steps as below are not constructed
    # Then "_illegalKey" was "whatever" Not! Throws!
