Feature: Finding and Counting Ads for Users

  Scenario: simplest ad request
    When POST "/users/1/ads"
      | count: 1 |
    Then response matched pattern
      | [ { user_id: 1, ad_id: 1, view_count: 1 } ] |


  Scenario: multiple ad request
    Given POST "/users/1/ads"
      | count: 9 |
    And POST "/users/2/ads"
      | count: 4 |=
    Given POST "/users/1/ads"
      | count: 9 |
    And SQL query
      | SELECT user_id, SUM(view_count) AS view_sum FROM user_ad_map GROUP BY user_id |
    Then SQL query result matched pattern
      | [ {user_id: 1, view_sum: '18'}, {user_id: 2, view_sum: '4'} ] |


  Scenario: request more ads than exists in db
    Given POST "/users/1/ads"
      | count: 11 |
    Then responded with status code 400
