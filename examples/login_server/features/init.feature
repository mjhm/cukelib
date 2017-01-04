Feature: Verify database migration and seeds

  Scenario: Check that the database has its tables
    Given SQL query
      | SELECT * from information_schema.tables where table_name='users' |
    Then SQL query had 1 row

    Given SQL query
      | SELECT * from information_schema.tables where table_name='ads' |
    Then SQL query had 1 row

    Given SQL query
      | SELECT * from information_schema.tables where table_name='user_ad_map' |
    Then SQL query had 1 row


  Scenario: Check that the database is seeded
    Given SQL query
      | SELECT * from users |
    Then SQL query had 3 rows

    Given SQL query
      | SELECT * from ads |
    Then SQL query had 10 rows

    Given SQL query
      | SELECT * from user_ad_map |
    Then SQL query had 0 rows
