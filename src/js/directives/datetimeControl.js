angular.module('ez.datetime').directive('ezDatetimeControl', [
  'EzDatetimeService',
  '$parse',
  '$timeout',
  '$modal',
  function(
    DatetimeService,
    $parse,
    $timeout,
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
        scope.form = {};

        $element.addClass('ez-datetime-control');

        DatetimeService.resolveConfig(scope, attrs);

        ngModel.$formatters.push(function(v) {
          if (v) {
            if (typeof v === 'string' && !isNaN(v)) {
              v = parseInt(v, 10);
            }

            if (scope.options.rangeEnabled && scope.options.modelBinding === 'default') {
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
          //
          scope.form.from = scope.from;
          scope.form.to = scope.to;

          scope.form.isFrom = !!attrs.to && !!scope.form.to;
          scope.form.isTo = !!attrs.from && !!scope.form.from;

          $modal.open({
            templateUrl: scope.options.rangeEnabled ? 'ez_datetime_range_modal.html' : 'ez_datetime_modal.html',
            controller: 'EzDatetimeModalController',
            scope: scope,
          }).result.then(function() {
            scope.from = scope.form.from;
            scope.to = scope.form.to;

            if (scope.options.rangeEnabled) {
              switch (scope.options.modelBinding) {
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

            if (!!attrs.ngChange) {
              $timeout(function() {
                $parse(attrs.ngChange)(scope.$parent);
              });
            }

            ngModel.$setDirty();
          });
        });

      }
    };
  }
]);
