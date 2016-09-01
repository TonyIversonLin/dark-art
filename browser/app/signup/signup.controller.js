'use strict';

app.controller('SignupCtrl', function ($scope, Auth, $state, $sanitize) {
  $scope.signupUser = function (credentials) {
    credentials.email = $sanitize(credentials.email);
    credentials.password = $sanitize(credentials.password);
    Auth.signup(credentials)
    .then(function (loggedinUser) {
      $state.go('user', {id: loggedinUser.id});
    });
  };
});
