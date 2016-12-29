Feature: Basic Embed Service

  Scenario: Start an embed service.
    Given "embed_service1" is started
    Then "embed_service1" was alive

  Scenario: Previous scenario service is dead
    Then "embed_service1" was killed
    Given "embed_service1" is started
    Then "embed_service1" was alive
