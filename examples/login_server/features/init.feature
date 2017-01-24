Feature: Verify database migration and seeds

  Scenario: Check that the database has its tables
    Given SQL query
      | SELECT * FROM information_schema.tables WHERE table_name='users' AND table_schema='login_server_features' |
    Then SQL query had 1 row

  Scenario: Check that the database is seeded
    Given SQL query
      | SELECT * FROM users |
    Then SQL query result matched pattern
      """
      [
        {
          id: _.isInteger,
          name: 'Don Draper',
          email: 'don@scdp.com',
          password_hash: /\$2\w\$\d\d\$[\w\/\.\:\-\=]{53}$/,
          boss_id: null,
          last_login: _.isDate,
          created_at: _.isDate,
          updated_at: _.isDate
       },
       { id: _.isInteger, name: 'Peggy Olson', ... }
      ]
      """
    Then SQL query had 2 rows
