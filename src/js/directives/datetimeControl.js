angular.module('ez.datetime').directive('ezDatetimeControl', [
  'EzDatetimeService',
  '$timeout',
  '$modal',
  function(
    DatetimeService,
    $timeout,
    $modal
  ) {
    return {
      restrict: 'EA',
      require: 'ngModel',
      scope: {
        ngModel: '=',
        minDate: '=?',
        maxDate: '=?',
        from: '=?',
        to: '=?',
        config: '=?'
      },
      link: function(scope, $element, attrs, modelCtrl) {
        $element.addClass('ez-datetime-control');

        DatetimeService.resolveConfig(scope, attrs);

        modelCtrl.$formatters.push(function(v) {
          if (!v) {
            return;
          }

          if (scope.options.modelFormat === 'x') {
            v = parseInt(v, 10);
          }

          return moment(v).format(scope.options.viewFormat);
        });

        scope.clear = function() {
          scope.form.value = undefined;
        };

        modelCtrl.$render = function() {
          console.log('rend', attrs.required);
          if (attrs.required) {
            modelCtrl.$setValidity('required', !!modelCtrl.$modelValue);
          }
        };

        $element.bind('click', function() {
          if (attrs.disabled) {
            return;
          }

          scope.form = {
            value: modelCtrl.$modelValue,
            minDate: scope.minDate,
            maxDate: scope.maxDate,
            from: scope.from,
            to: scope.to
          };

          $modal.open({
            templateUrl: 'ez_datetime_modal.html',
            controller: 'EzDatetimeModalController',
            scope: scope,
          }).result.then(function() {
            scope.ngModel = scope.form.value;
            modelCtrl.$setDirty();
          });
        });

      }
    };
  }
]);
