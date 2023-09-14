(function(app) {


  var routeLoadingIndicator = function($rootScope) {

    return {

      restrict: 'E',

      template: "<div class='col-lg-12' ng-if='isRouteLoading'><h1>Loading <i class='fa fa-cog fa-spin'></i></h1></div>",

      link: function(scope, elem, attrs) {

        scope.isRouteLoading = false;


//        $rootScope.$on('$locationChangeStart', function() {
        	$rootScope.$on('$routeChangeStart', function() {
        		console.log('$routeChangeStart');
        		

          scope.isRouteLoading = true;
          console.log(scope.isRouteLoading);

        });


//        $rootScope.$on('$locationChangeSuccess', function() {
        	$rootScope.$on('$routeChangeSuccess', function() {

          scope.isRouteLoading = false;

        });

      }

    };

  };

  routeLoadingIndicator.$inject = ['$rootScope'];


  app.directive('routeLoadingIndicator', routeLoadingIndicator);


}(angular.module('clipApp')));