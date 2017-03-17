(function () {
  'use strict';

  angular.module('Start')
    .controller('MasterCtrl', [ '$scope', '$window',
      function($scope) {
        $scope.config = false;

        /**
         * @function toggleConfig
         * @memberOf MasterCtrl
         *
         * @description
         *   Shows or hides configuration section.
         */
        $scope.toggleConfig = function() {
          $scope.config = !$scope.config;
        };

        /**
         * @function save
         * @memberOf MasterCtrl
         *
         * @description
         *   Hides configuration section and forces weather refreshing.
         */
        $scope.save = function() {
          $scope.weather.refresh();
          $scope.toggleConfig();
        };
      }
    ]);
})();
