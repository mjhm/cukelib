Feature: WebdriverIO sanity check

  Scenario: Check that selenium server and webdriverio are working
    Given browser url is "/ping"
    Then header was "PING"
    When click header
    Then header was "PONG"
