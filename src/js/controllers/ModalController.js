angular.module('ez.datetime').controller('EzDatetimeModalController', [
  '$scope',
  '$modalInstance',
  function(
    $scope,
    $modalInstance
  ) {

    $scope.dismiss = function() {
      $modalInstance.dismiss();
    };

    $scope.ok = function() {
      $modalInstance.close();
    };
  }
]);
