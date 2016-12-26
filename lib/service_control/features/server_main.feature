Feature: Basic tests of server spawning and killing

  Scenario: First Scenario
    Given spawn server
    Then check server "pidServer3001"
    Then check server "pidServer3002"
    Then check server "pidServer3003"
    Then check server "pidServer3004"
    Then check embedded server "localhost:3005"

  Scenario: Second Scenario
    Given spawn server
    Then check server "pidServer3001"
    Then check server "pidServer3002"
    Then check server "pidServer3003"
    Then check server "pidServer3004"
    Then check embedded server "localhost:3005"
