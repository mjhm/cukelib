Feature: Tests of the Universe functionality.
  Through internal_universe_test.js this tests the Universe functionality within the life cycle
  of a test run. See that file for detailed expectations.

  @InternalUniverseTest
  Scenario: Getting and setting of universe and world values.
    Then internal test of universe in the context of a world, scenario 1

  @InternalUniverseTest
  Scenario: Check that second scenario has a fresh world context
    Then internal test of universe in the context of a world, scenario 2
