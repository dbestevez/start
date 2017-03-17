(function () {
  'use strict';

  /**
   * @ngdoc module
   * @name  weather
   *
   * @requires require
   *
   * @description
   *   The `weather` module includes a service and a directive to show a weather
   *   forecast.
   */
  angular.module('weather', [])
    /**
     * @ngdoc service
     * @name  weather
     *
     * @description
     *   The `weather` service provides a method to configure and display a
     *   weather forecast.
     */
    .service('Weather', [ '$http', '$window', function ($http, $window) {
      /**
       * @memberOf Weather
       *
       * @description
       *  The weather configuration.
       *
       * @type {Array}
       */
      this.config = {
        days:     5,
        enabled:  true,
        location: 'Madrid, Spain',
        units:    'c',
      };

      /**
       * @function isEnabled
       * @memberOf Weather
       *
       * @description
       *   Checks if the clock is enabled.
       *
       * @return {Boolean} True if the clock is enabled. False otherwise.
       */
      this.isEnabled = function () {
        return this.config.enabled;
      };

      this.refresh = function () {
        this.updated = null;
        this.update();
      };

      /**
       * @function start
       * @memberOf Weather
       *
       * @description
       *   Loads weather configuration and starts the weather.
       */
      this.start = function () {
        var weather = $window.store.get('weather');

        if (!weather) {
          return;
        }

        this.config   = angular.extend(this.config, weather.config);
        this.location = weather.location;
        this.updated  = weather.updated;
        this.forecast = weather.forecast;
      };

      /**
       * @function update
       * @memberOf Weather
       *
       * @description
       *   Updates the weather.
       */
      this.update = function () {
        var w       = this;
        var now     = new Date();
        var updated = null;

        if (this.updated) {
          updated = new Date(this.updated).getTime();
        }

        var diff = (now.getTime() - updated)/1000;

        if (updated && diff < 3600) {
          return;
        }

        var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' +
          encodeURI(this.config.location) +
          encodeURI(this.config.units) +
          '%22)%20and%20u=%22' + this.config.units +
          '%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

        $http.get(url).then(function(response) {
          w.location = response.data.query.results.channel.location;
          w.forecast = response.data.query.results.channel.item.forecast;
          w.updated  = new Date();
        });
      };
    }])

    /**
     * @ngdoc directive
     * @name  weather
     *
     * @requires $compile
     * @requires $interval
     * @requires weather
     *
     * @description
     *   The `weather` directive displays time and date.
     */
    .directive('weather', [
      '$compile', '$interval', '$window', 'Weather',
      function($compile, $interval, $window, Weather) {
        return {
          restrict: 'E',
          scope: {
            ngModel: '='
          },
          link: function($scope, $e) {
            var html = '<div class="weather">' +
              '<ul class="weather-forecast" id="weather-forecast">' +
                '<li class="weather-forecast-day" ng-repeat="day in ngModel.forecast" ng-if="$index < ngModel.config.days">' +
                  '<i class="weather-icon icon-{{ day.code }}"></i>' +
                  '<div class="weather-temp">' +
                    '<span class="weather-temp-max">{{ day.high }}&deg;</span>' +
                    '<span class="weather-temp-min">{{ day.low }}&deg;</span>' +
                  '</div>' +
                  '<div class="weather-day">{{ $index === 0 ? "Now" : day.day }}</div>' +
                '</li>' +
              '</ul>' +
              '<div class="weather-location">' +
                '<span id="weather-city">{{ ngModel.location.city }}</span>,' +
                '<span class="bold" id="weather-region">{{ ngModel.location.region }}</span>' +
              '</div>' +
            '</div>';

            $scope.ngModel = Weather;

            Weather.start();
            Weather.update();

            $interval(function() {
              Weather.update();
            }, 3600000);

            // Save config on change
            $scope.$watch('ngModel', function (nv, ov) {
              if (nv === ov) {
                return;
              }

              $window.store.set('weather', $scope.ngModel);
            }, true);

            var e = $compile(html)($scope);
            $e.replaceWith(e);
          }
        };
      }
    ]);
})();
