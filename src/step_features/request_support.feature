Feature: requestSupport: HTTP Requests sent to the "echo_server" using custom PUT and POST steps

  Background: Setup server
    Given launch "echo" test server

  Scenario: Custom PUT step with arguments
    Given putting "baby" bumpers on the "rubber" buggy
    Then response matched pattern
      | { buggy: 'rubber', bumpers: 'baby' } |

  Scenario: Custom POST step with arguments
    Given posting "baby" bumpers on the "rubber" buggy
    Then response matched pattern
      | { buggy: 'rubber', bumpers: 'baby' } |
