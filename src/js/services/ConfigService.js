angular.module('ez.datetime').service('EzDatetimeConfigService', [
  '$parse',
  'EzDatetimeConfig',
  function(
    $parse,
    EzDatetimeConfig
  ) {
    return {

      /**
       * Resolve options passed into "config" attr or any options set via attrs
       */
      resolve: function(scope, attrs) {
        if (attrs.options) {
          return scope.options;
        } else {
          scope.options = angular.extend({}, EzDatetimeConfig, scope.config);

          for (var option in EzDatetimeConfig) {
            if (attrs.hasOwnProperty(option)) {
              if (typeof EzDatetimeConfig[option] === 'boolean') {
                scope.options[option] = $parse(attrs[option])(scope.$parent);
              } else {
                scope.options[option] = attrs[option];
              }
            }
          }
        }
      }
    };
  }
]);

