Feature: Single Scenario parent exits in an async process outside the scenario.

  Scenario: The parent exits in a set timeout. The post process check that the child is dead.
    Then parent exited later
