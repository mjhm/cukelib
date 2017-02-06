Feature: Verify database migration and seeds

  Scenario: Check that the database has its tables
    When SQL query
      | SELECT * from information_schema.tables where table_name='users' |
    Then SQL query had 1 row

    When SQL query
      | SELECT * from information_schema.tables where table_name='ads' |
    Then SQL query had 1 row

    When SQL query
      | SELECT * from information_schema.tables where table_name='user_ad_map' |
    Then SQL query had 1 row


  Scenario: Check that the database is seeded
    When SQL query
      | SELECT * from users |
    Then SQL query had 3 rows

    When SQL query
      | SELECT * from ads |
    Then SQL query had 10 rows

    When SQL query
      | SELECT * from user_ad_map |
    Then SQL query had 0 rows
