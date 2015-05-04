angular.module('ez.datetime').filter('ezDate', [
  function(
  ) {
    return function(v, format) {
      if (!v) {
        return;
      }

      if (!isNaN(v)) {
        v = parseInt(v, 10);
      }

      return moment(v).format(format);
    };
  }
]);

