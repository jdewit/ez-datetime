angular.module('ez.datetime').directive('ezTimePicker', [
  'EzDatetimeConfigService',
  function(
    ConfigService
  ) {
    return {
      restrict: 'EA',
      require: 'ngModel',
      templateUrl: 'ez_datetime_time_picker.html',
      scope: {
        ngModel: '=',
        options: '=?'
      },
      link: function(scope, $element, attrs, ngModel) {

        ConfigService.resolve(scope, attrs);

        function init() {
          scope.data = {
            hours: [],
            minutes: [],
            seconds: []
          };

          // set hour options
          var h = scope.options.meridiemEnabled ? 1 : 0;
          var limitH = scope.options.meridiemEnabled ? 12 : 23;
          while (h <= limitH) {
            scope.data.hours.push(h);

            h = h + scope.options.hourStep;
          }

          // set minute options
          var m = 0;
          while (m <= 60) {
            scope.data.minutes.push(m);

            m = m + scope.options.minuteStep;
          }

          // set second options
          var s = 0;
          while (s <= 60) {
            scope.data.seconds.push(s);

            s = s + scope.options.secondStep;
          }

          ngModel.$render = function() {
            if (!ngModel.$viewValue) {
              scope.ngModel = moment().format(scope.options.modelFormat);
            }
          };

        }

        function update(date) {
          ngModel.$setViewValue(date.format(scope.options.modelFormat));
          ngModel.$render();
        }

        scope.setHour = function(v) {
          var date = moment(scope.ngModel);

          date.hours(v);

          update(date);
        };

        scope.setMinute = function(v) {
          var date = moment(scope.ngModel);

          date.minutes(v);

          update(date);
        };

        scope.setSecond = function(v) {
          var date = moment(scope.ngModel);

          date.seconds(v);

          update(date);
        };

        scope.toggleMeridiem = function() {
          var date = moment(scope.ngModel);

          if (date.hours() > 12) {
            date.hours(date.hours() - 12);
          } else {
            date.hours(date.hours() + 12);
          }

          update(date);
        };

        init();
      }
    };
  }
]);


