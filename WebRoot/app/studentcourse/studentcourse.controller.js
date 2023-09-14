angular
.module('PAMSapp')
.controller('StudentCourseController', 
	['$rootScope', '$scope', '$window', '$interval', '$timeout' ,'$location', '$filter', 'NgTableParams','$cookies',
	function ($rootScope, $scope, $window, $interval, $timeout, $location, $filter, NgTableParams,$cookies) {


		$rootScope.elem=null ;		

	//=============================================================================
	(function initController() {

	})();


	$scope.go_to_course = function(c){
		console.log(c);
		// direct_to_test_page(1002033);
	}

	async function direct_to_test_page(quiz_id){
		console.log('holly.......................');
		$timeout(function () {
			$location.path('/s_q');
		}, 200);
	}

	$scope.go_to_test = function(quiz_id){
		console.log('Go to test AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA......');
		// openFullscreen();
		direct_to_test_page(quiz_id);
	}


	$scope.quizzes = [
	{
		Name: "Bài kiểm tra chương 1",
		Occupation: "Butler",
		Teacher: "Nguyễn Nguyễn",
		Color: "red"
	},
	{
		Name: "Bài kiểm tra chương 2",
		Occupation: "Queen of Jungle",
		Teacher: "Lê Trần Phát",
		Color: "green"
	},
	{
		Name: "Bài kiểm tra chương 3",
		Occupation: "Beggar Prince",
		Teacher: "Phạm Châu Quỳnh Anh"
	},
	{
		Name: "Bài kiểm tra chương 4",
		Occupation: "Bajillionaire",
		Teacher: "Đỗ Thị Hằng",
		Color: "orange"
	},
	{
		Name: "Bài kiểm tra chương 5",
		Occupation: "Code Monkey",
		Teacher: "Nguyễn Văn Dũng",
		Color: "yellow"
	}];


}]);