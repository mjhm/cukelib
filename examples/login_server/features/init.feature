Feature: Verify database migration and seeds

  Scenario: Check that the database has its tables
    Given SQL query
      | SELECT * FROM information_schema.tables WHERE table_name='users' AND table_schema='login_server_features' |
    Then SQL query had 1 row

  Scenario: Check that the database is seeded
    Given SQL query
      | SELECT * from users |
    Then SQL query result matched pattern
      | _.isPrinted |
    Then SQL query result matched pattern
      | [ {id: 1, name: 'Don Draper', ...}, {id: 2, ...}]  |
    Then SQL query had 2 rows
