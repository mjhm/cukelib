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
      {
        <=: {
          id: _.isInteger,
          name: _.isString,
          email: _.isEmail,
          password_hash: /^\$2[aby]?\$[\d]+\$[.\/A-Za-z0-9]{53}$/,
          boss_id: _.isDefined,
          last_login: _.isDate,
          created_at: _.isDate,
          updated_at: _.isDate
       }
     }
      """
    Then SQL query had 3 rows
