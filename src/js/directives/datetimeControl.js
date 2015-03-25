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
        ngModel: '=',
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
            if (rangeEnabled && scope.options.modelBinding === 'default') {
              v = moment(v.from).format(scope.options.viewFormat) + ' - ' + moment(v.to).format(scope.options.viewFormat);
            } else {
              v = moment(v).format(scope.options.viewFormat);
            }
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
          if (!scope.form.from && !scope.from) {
            scope.form.from = moment().format(scope.options.modelFormat);
          } else {
            scope.form.from = scope.from;
          }

          if (!scope.form.to && !scope.to) {
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

            if (rangeEnabled) {
              switch(scope.options.modelBinding) {
              case 'default':
                scope.ngModel = {
                  from: scope.from,
                  to: scope.to
                };
                break;
              case 'from':
                scope.ngModel = scope.from;
                break;
              case 'to':
                scope.ngModel = scope.to;
                break;
              }
            } else {
              scope.ngModel = scope.form.date;
            }

            ngModel.$setDirty();
          });
        });

      }
    };
  }
]);

