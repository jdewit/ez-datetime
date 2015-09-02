angular.module('ez.datetime').controller('EzDatetimeModalController', [
  '$scope',
  '$modalInstance',
  function(
    $scope,
    $modalInstance
  ) {
    var min, max, shortcut;

    $scope.shortcuts = [];

    // add quick shortcuts that fall between min & max
    $scope.options.shortcuts.forEach(function(shortcut) {
      if (!!$scope.form.min) {
        min = moment($scope.form.minDate);

        if (shortcut.from < min || shortcut.to < min) {
          return;
        }
      }

      if (!!$scope.form.max) {
        max = moment($scope.form.maxDate);

        if (shortcut.from > max || shortcut.to > max) {
          return;
        }
      }

      $scope.shortcuts.push(shortcut);
    });

    $scope.select = function(index) {
      shortcut = $scope.$parent.options.shortcuts[index];

      $scope.form.shortcut = shortcut.id;
      $scope.form.shortcutName = shortcut.name;

      if (!!shortcut.from) {
        $scope.form.from = shortcut.from.format();
      } else {
        $scope.form.from = null;
      }

      if (!!shortcut.to) {
        $scope.form.to = shortcut.to.format();
      } else {
        $scope.form.to = null;
      }
    };

    $scope.dismiss = function() {
      $modalInstance.dismiss();
    };

    $scope.ok = function() {
      $modalInstance.close();
    };
  }
]);
