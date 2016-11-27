Feature: Tests of the Universe functionality.
  See step internal_universe_test.js for detailed expectations.

  @InternalUniverseTest
  Scenario: Getting and setting of universe and world values.
    Then internal test of universe in the context of a world, scenario 1

  @InternalUniverseTest
  Scenario: Check that second scenario has a fresh world context
    Then internal test of universe in the context of a world, scenario 2
