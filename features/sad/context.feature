Feature: Context variable tests -- sad paths

  Scenario: Reserved words throw
    When "shell" is "nautilus" Throws!
    When "request" is (9) Throws!
    When "servers" is "waiter" Throws!
