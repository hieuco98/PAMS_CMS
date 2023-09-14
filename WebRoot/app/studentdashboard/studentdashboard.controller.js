angular
.module('PAMSapp')
.controller('StudentDashboardController', 
	['$rootScope', '$scope', '$window', '$interval', '$timeout', '$localStorage' ,'$location', '$filter', 'NgTableParams','$cookies', 'StudentDashboardService',
	function ($rootScope, $scope, $window, $interval, $timeout, $localStorage, $location, $filter, NgTableParams,$cookies,StudentDashboardService) {


		$rootScope.elem=null ;		
		$scope.tableDisplayBookingOrder = [];
		$scope.tableDataBookingOrder = [];
		$scope.tableParamsBookingOrder = new NgTableParams({
			page: 1, 
			count: 5, 
			sorting: {},
			filter:{}
		}, {
			total: $scope.tableDataBookingOrder.length, 
			getData: function($defer,params) {
				if($scope.tableDataBookingOrder != true){
					var filteredData = params.filter() ? 
						$filter('filter')(($scope.tableDataBookingOrder), params.filter()) : 
						$scope.tableDataBookingOrder;
					var orderedData = params.sorting() ? 
						$filter('orderBy')(filteredData, params.orderBy()) : 
						$scope.tableDataBookingOrder;
					params.total(orderedData.length); // set total for recalc pagination
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					$scope.tableDisplayBookingOrder = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
	
				}
			}
		});
	//=============================================================================
	(function initController() {
		console.log('initController .............')
		fnListBookingOrder()
	})();
	function fnListBookingOrder(){
		var req= {};
		req.session_id =$cookies.get("session_id");
	
		
		StudentDashboardService.listBookingOrderApi(req, function(respData){
			console.log(respData);
			if(respData.code == 200 ) {
				$scope.tableDataBookingOrder= respData.booking_order_list;
				$scope.tableParamsBookingOrder.reload();
			}  else{
	    		alert("listBookingOrderApi: Lỗi server!");
			} 
			
		});
	}

}]);