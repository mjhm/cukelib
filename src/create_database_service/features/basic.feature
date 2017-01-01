Feature: Basic Create Database Service

  Scenario: A database is created and a table is added
    Given "pg" database "pgdb" is created
    And "pg" database "pgdb" is connected
    And user "pgdb_user" is created in "pgdb" users table
    Then user "pgdb_user" was in the "pgdb" database

  Scenario: The database from the previous scenario no longer exists
    Given "pg" database "pgdb" is connected
    Given user "pgdb_user" is created in "pgdb" users table... Throws!
