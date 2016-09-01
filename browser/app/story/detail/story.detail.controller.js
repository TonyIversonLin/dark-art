'use strict';

app.controller('StoryDetailCtrl', function ($scope, story, users, $sanitize) {
  $scope.story = story;
  $scope.users = users;
  $scope.$watch('story', function () {
    $scope.story.title = $sanitize(story.title);
    $scope.story.content = $sanitize(story.content);
    $scope.story.save();
  }, true);
});
