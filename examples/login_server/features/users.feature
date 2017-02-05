Feature: User Endpoints

  Background:
    Given POST "/login"
      | { email: 'peggy@scdp.com', password: 'stanRizz0' } |

  Scenario: Test basic response of /users/current
