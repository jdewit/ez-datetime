angular.module('ez.datetime').directive('ezDatetimeControl', [
  'EzDatetimeConfigService',
  '$modal',
  function(
    ConfigService,
    $modal
  ) {
    return {
      restrict: 'EA',
      require: 'ngModel',
      replace: true,
      scope: {
        ngModel: '=?',
        from: '=?',
        to: '=?',
        config: '=?'
      },
      link: function(scope, $element, attrs, ngModel) {
        var template = 'ez_datetime_modal.html';

        scope.form = {};

        $element.addClass('ez-datetime-control');

        ConfigService.resolve(scope, attrs);

        if (!!attrs.from && !!attrs.to) {
          template = 'ez_datetime_range_modal.html';
        }

        ngModel.$formatters.push(function(v) {
          if (v) {
            v = moment(v).format(scope.options.viewFormat);
          }

          return v;
        });

        $element.bind('click', function() {

          scope.form.date = ngModel.$modelValue;
          scope.form.from = scope.from;
          scope.form.to = scope.to;

          $modal.open({
            templateUrl: template,
            controller: 'EzDatetimeModalController',
            scope: scope,
          }).result.then(function() {
            scope.from = scope.form.from;
            scope.to = scope.form.to;

            ngModel.$setViewValue({
              from: scope.from,
              to: scope.to
            });

            ngModel.$render();
          });
        });

      }
    };
  }
]);

