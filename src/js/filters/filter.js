angular.module('ez.datetime').filter('ezDate', [
  'EzDatetimeConfig',
  function(
    EzDatetimeConfig
  ) {
    return function(v, viewFormat, isUtc) {
      if (!v) {
        return;
      }

      if (viewFormat === undefined) {
        viewFormat = EzDatetimeConfig.viewFormat;
      }

      if (isUtc === undefined) {
        isUtc = EzDatetimeConfig.isUtc;
      }

      if (moment.isMoment(v)) {
        return v.format(viewFormat);
      } else {
        if (!isNaN(v)) {
          v = parseInt(v, 10);
        }

        if (isUtc) {
          return moment.utc(v).format(viewFormat);
        } else {
          return moment(v).format(viewFormat);
        }
      }
    };
  }
]);
