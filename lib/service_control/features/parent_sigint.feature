Feature: Single Scenario SIGINT in parent

  Scenario: Triggers a SIGINT in parent, later check that the child server is dead
    Then parent had SIGINT signal
