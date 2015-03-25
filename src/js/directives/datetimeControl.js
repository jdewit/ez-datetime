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
      scope: {
        ngModel: '=?',
        from: '=?',
        to: '=?',
        config: '=?'
      },
      link: function(scope, $element, attrs, ngModel) {
        var rangeEnabled = false;

        scope.form = {};

        $element.addClass('ez-datetime-control');

        ConfigService.resolve(scope, attrs);

        if (!!attrs.from && !!attrs.to) {
          rangeEnabled = true;
        }

        ngModel.$formatters.push(function(v) {
          if (v) {
            v = moment(v).format(scope.options.viewFormat);
          }

          return v;
        });

        $element.bind('click', function() {

          scope.form.date = ngModel.$modelValue;

          // try to init from ngModel value first
          if (!!scope.form.date) {
            if (!!scope.form.date.from) {
              scope.form.from = scope.form.date.from;
            }

            if (!!scope.form.date.to) {
              scope.form.to = scope.form.date.to;
            }
          }

          // try to init from from/to scope attributes
          if (!scope.form.from) {
            scope.form.from = moment().format(scope.options.modelFormat);
          } else {
            scope.form.from = scope.from;
          }

          if (!scope.form.to) {
            scope.form.to = moment().format(scope.options.modelFormat);
          } else {
            scope.form.to = scope.to;
          }

          $modal.open({
            templateUrl: rangeEnabled ? 'ez_datetime_range_modal.html' : 'ez_datetime_modal.html',
            controller: 'EzDatetimeModalController',
            scope: scope,
          }).result.then(function() {
            scope.from = scope.form.from;
            scope.to = scope.form.to;

            // timeout needed to let scope update before ng-change is fired
            setTimeout(function() {
              if (rangeEnabled) {
                ngModel.$setViewValue({
                  from: scope.from,
                  to: scope.to
                });
              } else {
                ngModel.$setViewValue(scope.form.date);
              }

              ngModel.$render();
            });
          });
        });

      }
    };
  }
]);

