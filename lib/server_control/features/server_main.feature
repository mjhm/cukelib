Feature: Basic tests of server spawning and killing

  Scenario: First Scenario
    Given spawn server
    Then check server "localhost:3001"
    Then check server "localhost:3002"
    Then check server "localhost:3003"
    Then check server "localhost:3004"
    Then check embedded server "localhost:3005"

  Scenario: Second Scenario
    Given spawn server
    Then check server "localhost:3001"
    Then check server "localhost:3002"
    Then check server "localhost:3003"
    Then check server "localhost:3004"
    Then check embedded server "localhost:3005"
