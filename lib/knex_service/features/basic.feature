Feature: Basic Knex Service

  Scenario: Each of the before hooks can connect to separate databases.
    Then user "before_features_user" was in the "before_features_db" database
    Then user "before_feature_user" was in the "before_feature_db" database
    Then user "before_scenario_user" was in the "before_scenario_db" database
    Then user "before_scenario_user" was in the "before_features_db" database. Not!

  Scenario: A step can connect to a database
    Given user database "udb1" is created
    Then user "udb1_user" was in the "udb1_db" database

  Scenario: The database connection from the previous step is gone
    Then user "udb1_user" was in the "udb1_db" database. Not!

  Scenario: Database migrations and seeds
    Given start "udb_seeded" database with migration and seeds
    Then user "Lazy Lanny" was in the "udb_seeded" database
