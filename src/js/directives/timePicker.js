angular.module('ez.datetime').directive('ezTimePicker', [
  'EzDatetimeService',
  function(
    DatetimeService
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

        DatetimeService.resolveConfig(scope, attrs);

        function init() {
          scope.data = {
            minuteStep: 15,
            secondStep: 15,
            hours: [],
            minutes: [],
            seconds: []
          };

          setOptions();
        }

        function setOptions() {
          scope.data.minutes = [];
          scope.data.seconds = [];

          if (!scope.data.hours.length) {
            // set hour options
            var h = scope.options.meridiemEnabled ? 1 : 0;
            var limitH = scope.options.meridiemEnabled ? 12 : 23;
            while (h <= limitH) {
              scope.data.hours.push(h);

              h = h + 1;
            }
          }

          // set minute options
          var m = 0;
          while (m < 60) {
            scope.data.minutes.push(m);

            m = m + scope.data.minuteStep;
          }

          // set second options
          var s = 0;
          while (s < 60) {
            scope.data.seconds.push(s);

            s = s + scope.data.secondStep;
          }
        }

        function update(date) {
          ngModel.$setViewValue(date.format(scope.options.modelFormat));
          ngModel.$render();
        }

        function getDate() {
          if (!scope.ngModel) {
            return;
          }

          if (scope.options.modelFormat === 'x') {
            return moment(parseInt(scope.ngModel, 10));
          } else {
            return moment(scope.ngModel);
          }
        }

        scope.setHour = function(v) {
          var date = getDate();

          if (!date) {
            return;
          }

          date.hours(v);

          update(date);
        };

        scope.setMinute = function(v) {
          var date = getDate();

          if (!date) {
            return;
          }

          date.minutes(v);

          update(date);
        };

        scope.setSecond = function(v) {
          var date = getDate();

          if (!date) {
            return;
          }

          date.seconds(v);

          update(date);
        };

        scope.toggleMeridiem = function() {
          var date = getDate();

          if (!date) {
            return;
          }

          if (date.hours() > 12) {
            date.hours(date.hours() - 12);
          } else {
            date.hours(date.hours() + 12);
          }

          update(date);
        };

        scope.increaseMinuteStep = function($event) {
          $event.preventDefault();
          $event.stopPropagation();

          switch(scope.data.minuteStep) {
            case 15:
              scope.data.minuteStep = 5;
            break;
            case 5:
              scope.data.minuteStep = 1;
            break;
          }

          setOptions();
        };

        scope.increaseSecondStep = function($event) {
          $event.preventDefault();
          $event.stopPropagation();

          switch(scope.data.secondStep) {
            case 15:
              scope.data.secondStep = 5;
            break;
            case 5:
              scope.data.secondStep = 1;
            break;
          }

          setOptions();
        };

        init();
      }
    };
  }
]);
