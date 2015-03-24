angular.module('ez.datetime').filter('ezDate', [
  function(
  ) {
    return function(v, format) {
      if (!v) {
        return;
      }

      return moment(v).format(format);
    };
  }
]);

