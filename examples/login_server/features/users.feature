Feature: User Endpoints

  Background:
    Given POST "/login"
      | { email: 'peggy@scdp.com', password: 'stanRizz0' } |

  Scenario: Attempt to access /users/current before login
