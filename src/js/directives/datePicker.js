angular.module('ez.datetime').directive('ezDatePicker', [
  'EzDatetimeService',
  function datepickerDirective(
    DatetimeService
  ) {

    return {
      restrict: 'EA',
      require: 'ngModel',
      templateUrl: 'ez_datetime_date_picker.html',
      scope: {
        minDate: '=?',
        maxDate: '=?',
        from: '=?',
        to: '=?',
        options: '=?'
      },
      replace: true,
      link: function link(scope, element, attrs, ngModel) {

        scope.date = null;

        DatetimeService.resolveConfig(scope, attrs);

        var startOfDecade = function(unixDate) {
          var startYear = (parseInt(moment(unixDate).year() / 10, 10) * 10);

          return moment(unixDate).year(startYear).startOf('year');
        };

        var fixDate = function(d) {
          if (!d) {
            return;
          }

          if (!moment.isMoment(d)) {
            if (scope.options.modelFormat === 'x') {
              d = parseInt(d, 10);
            }

            d = moment(d);
          }

          return d;
        };

        // highlight items that are within the selected range
        var setStates = function(date, activeDateUnix, dateValue) {
          var dateUnix = date.unix();

          dateValue.highlight = false;
          dateValue.unselectable = false;

          var view = scope.view === 'setValue' ? scope.options.minView : scope.view;

          var minDate = scope.minDate || scope.from;
          if (!!minDate) {
            var minUnix = fixDate(minDate).startOf(view).unix();

            if (dateUnix < minUnix) {
              dateValue.unselectable = true;
            }
          }

          var maxDate = scope.maxDate || scope.to;
          if (maxDate) {
            var maxUnix = fixDate(maxDate).endOf(view).unix();

            if (dateUnix > maxUnix) {
              dateValue.unselectable = true;
            }
          }

          if (!activeDateUnix) {
            return;
          }

          if (!dateValue.unselectable && !dateValue.active) {
            if (!!scope.from) {
              var from = fixDate(scope.from).startOf(view).unix();

              if (dateUnix >= from && dateUnix < activeDateUnix) {
                dateValue.highlight = true;
              }
            }

            if (!!scope.to) {
              var to = fixDate(scope.to).endOf(view).unix();

              if (dateUnix <= to && dateUnix > activeDateUnix) {
                dateValue.highlight = true;
              }
            }
          }

        };

        var matchTime = function(d1, d2) {
          if (!d1) {
            return;
          }

          if (!d2) {
            d2 = moment();
          }

          d1.hours(d2.hours());
          d1.minutes(d2.minutes());
          d1.seconds(d2.seconds());

          return d1;
        };

        var dataFactory = {
          year: function(newDate, activeDate) {
            var todayDash = moment().format('YYYY');

            // View starts one year before the decade starts and ends one year after the decade ends
            // i.e. passing in a date of 1/1/2013 will give a range of 2009 to 2020
            // Truncate the last digit from the current year and subtract 1 to get the start of the decade
            var startDecade = (parseInt(moment(newDate).startOf('year').year() / 10, 10) * 10);
            var startDateMoment = moment(startOfDecade(newDate)).subtract(1, 'year').startOf('year');

            var activeYear;
            var activeDateUnix;
            if (!!activeDate) {
              activeYear = moment(activeDate).year();
              activeDateUnix = moment(activeDate).unix();
            }

            var result = {
              'currentView': 'year',
              'nextView': scope.options.minView === 'year' ? 'setValue' : 'month',
              'previousViewDate': {
                unselectable: true,
                dateValue: null,
                display: startDecade + '-' + (startDecade + 9)
              },
              'leftDate': {
                dateValue: moment(startDateMoment).subtract(9, 'year').unix()
              },
              'rightDate': {
                dateValue: moment(startDateMoment).add(11, 'year').unix()
              },
              'dates': []
            };

            for (var i = 0; i < 12; i += 1) {
              var yearMoment = moment(startDateMoment).add(i, 'years');
              var dateValue = {
                'dateValue': yearMoment,
                'display': yearMoment.format('YYYY'),
                'past': yearMoment.year() < startDecade,
                'future': yearMoment.year() > startDecade + 9,
                'active': !!ngModel.$modelValue && yearMoment.year() === activeYear,
                'isToday': yearMoment.format('YYYY') === todayDash
              };

              setStates(yearMoment, activeDateUnix, dateValue);

              result.dates.push(dateValue);
            }

            return result;
          },
          month: function(newDate, activeDate) {
            var todayDash = moment().format('YYYY-MM');
            var startDateMoment = moment(newDate).startOf('year');

            var activeMonthDash;
            var activeMonthUnix;

            if (!!activeDate) {
              activeMonthDash = moment(activeDate).format('YYYY-MM');
              activeMonthUnix = moment(activeDate).unix();
            }

            var result = {
              'previousView': 'year',
              'currentView': 'month',
              'nextView': scope.options.minView === 'month' ? 'setValue' : 'day',
              'previousViewDate': {
                dateValue: activeDate || moment(),
                display: startDateMoment.format('YYYY')
              },
              'leftDate': {
                dateValue: moment(startDateMoment).subtract(1, 'year').unix()
              },
              'rightDate': {
                dateValue: moment(startDateMoment).add(1, 'year').unix()
              },
              'dates': []
            };

            for (var i = 0; i < 12; i += 1) {
              var monthMoment = moment(startDateMoment).add(i, 'months');
              var monthDash = moment(monthMoment).format('YYYY-MM');

              var dateValue = {
                'dateValue': monthMoment,
                'display': monthMoment.format('MMM'),
                'active':  !!ngModel.$modelValue && monthDash === activeMonthDash,
                'isToday': monthDash === todayDash
              };

              setStates(monthMoment, activeMonthUnix, dateValue);

              result.dates.push(dateValue);
            }

            return result;
          },
          day: function(newDate, activeDate) {
            var todayDash = moment().format('YYYY-MM-DD');
            var monthStartMoment = moment(newDate).startOf('month');
            var monthEndMoment = moment(newDate).endOf('month');

            var activeDateDash;
            var activeDateUnix;

            if (!!activeDate) {
              activeDateDash = moment(activeDate).format('YYYY-MM-DD');
              activeDateUnix = moment(activeDate).unix();
            }

            monthStartMoment = matchTime(monthStartMoment, activeDate);

            var startDateMoment = moment(monthStartMoment).subtract(Math.abs(monthStartMoment.weekday()), 'days');

            var result = {
              'previousView': 'month',
              'currentView': 'day',
              'nextView': 'setValue',
              'previousViewDate': {
                dateValue: activeDate || moment(),
                display: monthStartMoment.format('YYYY-MMM')
              },
              'leftDate': {
                dateValue: moment(monthStartMoment).subtract(1, 'months')
              },
              'rightDate': {
                dateValue: moment(monthStartMoment).add(1, 'months')
              },
              'dayNames': [],
              'weeks': []
            };

            for (var dayNumber = 0; dayNumber < 7; dayNumber += 1) {
              result.dayNames.push(moment().weekday(dayNumber).format('dd'));
            }

            for (var i = 0; i < 6; i += 1) {
              var week = {
                dates: []
              };

              for (var j = 0; j < 7; j += 1) {
                var dayMoment = moment(startDateMoment).add((i * 7) + j, 'days');
                var dayDash = moment(dayMoment).format('YYYY-MM-DD');

                var dateValue = {
                  'dateValue': dayMoment,
                  'display': moment(dayMoment).format('D'),
                  'active': !!activeDate && dayDash === activeDateDash,
                  'isToday': dayDash === todayDash,
                  'past': dayMoment.isBefore(monthStartMoment),
                  'future': dayMoment.isAfter(monthEndMoment)
                };

                setStates(dayMoment, activeDateUnix, dateValue);

                week.dates.push(dateValue);
              }
              result.weeks.push(week);
            }

            return result;
          },
          setValue: function(date) {
            var v;

            if (!!date) {
              if (!moment.isMoment(date)) {
                date = fixDate(date);
              }

              v = date.format(scope.options.modelFormat);
            }

            ngModel.$setViewValue(v);

            return dataFactory[scope.options.minView](date, date);
          }
        };

        scope.changeView = function(viewName, dateObject, event) {
          if (event) {
            event.stopPropagation();
            event.preventDefault();
          }

          scope.view = viewName;

          if (!!scope.view && !!scope.view && !dateObject.unselectable && dataFactory[scope.view] && !!dateObject.dateValue) {

            var activeDate = fixDate(ngModel.$modelValue);

            if (viewName === 'setValue') {

              if (!!activeDate && dateObject.dateValue.unix() === activeDate.unix()) {
                ngModel.$setViewValue(undefined);
                ngModel.$render();

                return;
              }
            }

            scope.data = dataFactory[scope.view](dateObject.dateValue, activeDate);
          }
        };

        ngModel.$render = function() {
          if (!scope.view) {
            scope.view = scope.options.startView;
          }
          var d = fixDate(ngModel.$modelValue);

          scope.data = dataFactory[scope.view](d, d);
        };

        if (!!attrs.minDate) {
          scope.$watch('minDate', function(n, o) {
            if (n !== o) {
              ngModel.$render();
            }
          });
        }

        if (!!attrs.maxDate) {
          scope.$watch('maxDate', function(n, o) {
            if (n !== o) {
              ngModel.$render();
            }
          });
        }

        if (!!attrs.from) {
          scope.$watch('from', function(n, o) {
            if (n !== o) {
              ngModel.$render();
            }
          });
        }

        if (!!attrs.to) {
          scope.$watch('to', function(n, o) {
            if (n !== o) {
              ngModel.$render();
            }
          });
        }


      }
    };
  }
]);
