var app = angular.module('myApp', ['ez.datetime', 'ez.modal', 'ez.dropdown']);

app.controller('myCtrl', function($scope) {
  $scope.form = {
    //date3: moment().format()
  };

  $scope.config1 = {
    format: 'MMMM Do YYYY, h:mma',
    ranges: {
       'Today': [moment(), moment()],
       'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
       'Tomorrow': [moment().add(1, 'days'), moment().add(1, 'days')],
       'This Week': [moment().startOf('week'), moment().endOf('week')],
       'Last Week': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
       'This Month': [moment().startOf('month'), moment().endOf('month')],
       'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    }
  };

  $scope.config2 = {
    format: 'MMMM Do YYYY, h:mma'
  };

  $scope.$watch('form', function(newVal) {
    console.log('form changed');
    console.log(newVal);
  }, true);

  $scope.clear = function(property) {
    $scope.form[property] = null;
  };
});
