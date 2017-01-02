Feature: AdsController CRUD operations

  Scenario: Verify all ads
    When GET "/ads"
    Then responded with status code "200"
    And response matched pattern
      | _.isSize\|10 |
    And response matched pattern
      """
      {
        <=: {
          id: _.isInteger,
          brand: _.isString,
          created_at: _.isDateString,
          updated_at: _.isDateString,
        }
      }
      """


  Scenario: Verify one ad
    When GET "/ads/1"
    Then responded with status code "200"
    And response matched pattern
      | { id: 1, brand: 'Lucky Strike', ... } |


  Scenario: Update an ad
    When PUT "/ads/1"
      | { brand: 'American Cancer Society' } |
    Then responded with status code "200"
    And response matched pattern
      | { id: 1, brand: 'American Cancer Society', ... } |


  Scenario: Create an ad
    When POST "/ads"
      | { brand: 'Virginia Slims' } |
    Then responded with status code "200"
    And response matched pattern
      | { id: 11, brand: 'Virginia Slims' ... } |
    When SQL query
      | SELECT * FROM ads |
    Then SQL query had 11 rows


  Scenario: Destroy an ad
    When DELETE "/ads/3"
    Then responded with status code "200"
    And response matched pattern
      | { id: 3, brand: 'Clearasil' ... } |
    When SQL query
      | SELECT * FROM ads |
    Then SQL query had 9 rows


  Scenario: Try to verify an unknown ad
    When GET "/ads/99999"
    Then responded with status code "404"
    And response matched pattern
      | null |


  Scenario: Update an ad with garbage
    When PUT "/ads/1"
      | { garbage: 'huh' } |
    Then responded with status code "500"
    And response matched pattern
      | null |


  Scenario: Create an ad with garbage
    When POST "/ads"
      | { garbage: 'huh' } |
    Then responded with status code "500"
    And response matched pattern
      | null |


  Scenario: Update an ad
    When PUT "/ads/1"
      | { brand: 'Dick Whitman' } |
    Then responded with status code "200"
    And response matched pattern
      | { id: 1, brand: 'Dick Whitman', ... } |


  Scenario: Try to update an unknown ad
    When PUT "/ads/9999"
      | { brand: 'Pete Campbell' } |
    Then responded with status code "404"
    And response matched pattern
      | null |


  Scenario: Try to delete an unknown ad
    When DELETE "/ads/99999"
    Then responded with status code "404"
    And response matched pattern
      | null |
