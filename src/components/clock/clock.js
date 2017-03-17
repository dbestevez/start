(function () {
  'use strict';

  /**
   * @ngdoc module
   * @name  clock
   *
   * @requires require
   *
   * @description
   *   The `clock` module includes a service and a directive to show a clock
   *   with time and date.
   */
  angular.module('clock', [])
    /**
     * @ngdoc service
     * @name  Clock
     *
     * @description
     *   The `Clock` service provides a method to display and format time and
     *   date.
     */
    .service('Clock', [ '$window', function ($window) {
      /**
       * @memberOf Clock
       *
       * @description
       *  The clock configuration.
       *
       * @type {Array}
       */
      this.config = {
        date:    true,
        enabled: true,
        seconds: true
      };

      /**
       * @memberOf Clock
       *
       * @description
       *  The list of months.
       *
       * @type {Array}
       */
      this.months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
      ];

      /**
       * @function format
       * @memberOf Clock
       *
       * @description
       *   Adds a zero to the left when the value is lessed than 10.
       *
       * @param {String} The value to format.
       *
       * @return {String} The formated value.
       */
      this.format = function (s) {
        return s >= 10 ? s : '0' + s;
      };

      /**
       * @function isEnabled
       * @memberOf Clock
       *
       * @description
       *   Checks if the clock is enabled.
       *
       * @return {Boolean} True if the clock is enabled. False otherwise.
       */
      this.isEnabled = function () {
        return this.config.enabled;
      };

      /**
       * @function showDate
       * @memberOf Clock
       *
       * @description
       *   Checks if the clock is enabled.
       *
       * @return {Boolean} True if the date is enabled. False otherwise.
       */
      this.showDate = function () {
        return this.config.date;
      };

      /**
       * @function showSeconds
       * @memberOf Clock
       *
       * @description
       *   Checks if the seconds in the clock are enabled.
       *
       * @return {Boolean} True if the seconds in the clock are enabled. False
       *                   otherwise.
       */
      this.showSeconds = function () {
        return this.config.seconds;
      };

      /**
       * @function start
       * @memberOf Clock
       *
       * @description
       *   Loads clock configuration and starts the clock.
       */
      this.start = function () {
        this.config = angular.extend(this.config, $window.store.get('clock'));
      };

      /**
       * @function update
       * @memberOf Clock
       *
       * @description
       *   Updates the Clock.
       */
      this.update = function () {
        var date = new Date();

        this.hours   = this.format(date.getHours());
        this.minutes = this.format(date.getMinutes());
        this.seconds = this.format(date.getSeconds());
        this.month   = this.months[date.getMonth()];
        this.day     = date.getDate();
        this.year    = date.getFullYear();
      };
    }])

    /**
     * @ngdoc directive
     * @name  clock
     *
     * @requires $compile
     * @requires $interval
     * @requires Clock
     *
     * @description
     *   The `clock` directive displays time and date.
     */
    .directive('clock', [
      '$compile', '$interval', '$window','Clock',
      function($compile, $interval, $window, Clock) {
        return {
          restrict: 'E',
          scope: {
            ngModel: '='
          },
          link: function($scope, $e) {
            var html = '<div class="clock" ng-if="ngModel.isEnabled()">' +
              '<span class="clock-value" id="clock-hours">{{ ngModel.hours }}</span>' +
              '<span class="clock-separator">:</span>' +
              '<span class="clock-value" id="clock-minutes">{{ ngModel.minutes }}</span>' +
              '<span class="clock-separator" ng-if="ngModel.showSeconds()">:</span>' +
              '<span class="clock-value" id="clock-seconds" ng-if="ngModel.showSeconds()">{{ ngModel.seconds }}</span>' +
            '</div>' +
            '<div class="date" ng-if="ngModel.showDate()">' +
              '<span class="date-month" id="date-month">{{ ngModel.month }}</span>' +
              '<span class="date-day" id="date-day">{{ ngModel.day }}</span>, ' +
              '<span class="date-year" id="date-year">{{ ngModel.year }}</span>' +
            '</div>';

            $scope.ngModel = Clock;

            Clock.start();
            Clock.update();

            $interval(function() {
              Clock.update();
            }, 1000);

            // Save config on change
            $scope.$watch('ngModel.config', function (nv, ov) {
              if (nv === ov) {
                return;
              }

              $window.store.set('clock', $scope.ngModel.config);
            }, true);

            var e = $compile(html)($scope);
            $e.replaceWith(e);
          }
        };
      }
    ]);
})();
