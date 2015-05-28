var app = angular.module('myApp', ['ez.datetime', 'ez.modal', 'ez.dropdown']);

app.controller('myCtrl', function($scope) {
  $scope.form = {
    date1: moment().format('x'),

    date3Min: moment().subtract(5, 'days').format(),
    date3Max: moment().add(5, 'days').format(),
    date5Range: {
      from: moment().subtract(5, 'days').format(),
      to: moment().add(5, 'days').format()
    },
    time1: moment().format()
  };

  $scope.config1 = {
    format: 'MMMM Do YYYY, h:mma',
    ranges: [
      {
        name: 'Today',
        from: moment().startOf('day'),
        to: moment().endOf('day')
      }, {
        name: 'Yesterday',
        from: moment().subtract(1, 'days').startOf('day'),
        to: moment().subtract(1, 'days').endOf('day')
      }
    ]
  };

  $scope.config2 = {
    format: 'MMMM Do YYYY, h:mma'
  };

  $scope.$watch('form', function(newVal) {
    console.log('form changed');
    console.log(newVal);
  }, true);

  $scope.modelChanged = function() {
    console.log('ng-change called');
  };

  $scope.clear = function(property) {
    $scope.form[property] = null;
  };

  $scope.log = function(text) {
    console.log($scope);
    console.log(text);
  };
});
