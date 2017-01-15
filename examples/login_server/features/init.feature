Feature: Verify database migration and seeds

  Scenario: Check that the database has its tables
    Given SQL query
      | SELECT * from information_schema.tables where table_name='users' |
    Then SQL query had 1 row

  Scenario: Check that the database is seeded
    Given SQL query
      | SELECT * from users |
    Then SQL query had 2 rows
