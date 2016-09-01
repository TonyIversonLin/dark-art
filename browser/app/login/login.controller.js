'use strict';

app.controller('LoginCtrl', function ($scope, Auth, $state, $sanitize) {
  $scope.loginUser = function (credentials) {
    credentials.email = $sanitize(credentials.email);
    credentials.password = $sanitize(credentials.password);
    Auth.login(credentials)
    .then(function (loggedinUser) {
      $state.go('user', {id: loggedinUser.id});
    });
  };
});
