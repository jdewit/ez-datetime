angular.module('ez.datetime').directive('ezDatetimeRangeControl', [
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
      scope: {
        from: '=',
        to: '=',
        minDate: '=?',
        maxDate: '=?',
        config: '=?'
      },
      link: function(scope, $element, attrs) {
        var text;
        var setDirty = angular.noop;
        var parentForm = $element.inheritedData('$formController');

        $element.addClass('ez-datetime-control');

        DatetimeService.resolveConfig(scope, attrs);

        // implement input formatter
        if ($element.is('input')) {
          var from, to;

          var setInput = function() {
            if (scope.options.modelFormat === 'x') {
              from = parseInt(scope.from, 10);
              to = parseInt(scope.to, 10);
            } else {
              from = scope.from;
              to = scope.to;
            }

            if (!!from) {
              text = moment(from).format(scope.options.viewFormat);
            } else {
              text = scope.options.noValueText;
            }

            text += ' - ';

            if (!!to) {
              text += moment(to).format(scope.options.viewFormat);
            } else {
              text += scope.options.noValueText;
            }

            $element.val(text);
          };

          setDirty = function() {
            setInput();

            var parentForm = $element.inheritedData('$formController');

            parentForm.$setDirty();
          };

          setInput();
        }

        var render = function() {
          console.log('rend', attrs.required);
          if (attrs.required) {
            parentForm.$setValidity(attrs.name, null, {required: !!scope.from && !!scope.to});
          }

          console.log('foro', parentForm);
        };

        scope.clear = function() {
          scope.form.from = undefined; 
          scope.form.to = undefined; 
        };

        $element.bind('click', function() {
          if (attrs.disabled) {
            return;
          }

          scope.form = {
            min: scope.minDate,
            max: scope.maxDate,
            from: scope.from,
            to: scope.to
          };

          $modal.open({
            templateUrl:'ez_datetime_range_modal.html',
            controller: 'EzDatetimeModalController',
            scope: scope,
          }).result.then(function() {
            if (scope.form === scope.form.from && scope.to === scope.form.to) {
              return;
            }

            scope.from = scope.form.from;
            scope.to = scope.form.to;

            setDirty();
            render();

            if (!!attrs.onChange) {
              $timeout(function() {
                $parse(attrs.onChange)(scope.$parent);
              });
            }
          });
        });

        render();
      }
    };
  }
]);
