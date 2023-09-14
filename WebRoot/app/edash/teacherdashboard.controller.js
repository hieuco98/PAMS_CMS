angular
.module('PAMSapp')
.controller('TeacherDashboardController', 
		['$rootScope', '$scope', '$window', '$interval', '$location', '$localStorage', '$filter', 'TeacherDashboardService', 'NgTableParams','$cookies',
		 function ($rootScope, $scope, $window, $interval, $location, $localStorage, $filter, TeacherDashboardService, NgTableParams,$cookies) {
	
	const hot_time_span = 2*60*60*1000;	
	(function initController() {
		termList();
		

		// fnDashboardCounter();
    })();

    //--------------------------------------------------------------------------------------
	function fnDashboardCounter(){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.term_id = $scope.selectedTerm.id;
		
		console.log(reqData);
		TeacherDashboardService.TeacherDashboardCounterApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200 ) {
				
				$scope.counters=respData;
	            // amchartdiv_class_interactive.data=respData.class_interactive_list;
			}else if(respData.code == 700){
				Swal.fire({
					  type: 'error',
					  title: 'Phiên đăng nhập của bạn đã kết thúc.',
					  text: 'Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.'
					})
				$location.path('/login');
			}else{
				alert("fnDashboardCounter: Lỗi server!");
			} 
		});
	}

    function termList(){
    	console.log('aloha');
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
 	    TeacherDashboardService.TermlistApi(reqData, function (respData) {
    		if (respData.code == 200) {
    			console.log(respData);
				if(respData.term_list.length>0){
					$scope.terms = respData.term_list;
					var found = 0;
					for(var i=0; i<$scope.terms.length; i++){
						if($scope.terms[i].is_current==1) {
							$scope.selectedTerm = $scope.terms[i];
							found = 1;
							break;
						}
					}
					if(found==0) $scope.selectedTerm = $scope.terms[0];
					$cookies.put('current_term_id',$scope.selectedTerm.id);
					console.log($cookies.get('current_term_id'));
					listQuizSession($scope.selectedTerm.id);
					teacherClassList($scope.selectedTerm.id);
					fnDashboardCounter($scope.selectedTerm.id);
				}
    		}else if(respData.code == 700){
				Swal.fire({
					  type: 'error',
					  title: 'Phiên đăng nhập của bạn đã kết thúc.',
					  text: 'Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.'
					})
				$location.path('/login');
			}else{
    			alert("Lỗi termList!");
    		}
    	});
	}
	
	
	//-----------Student list table-----------	
    $scope.tableDisplayStudent = [];
    $scope.tableDataStudent = [];
    $scope.tableParamsStudent = new NgTableParams({
    	page: 1, 
        count: 5, 
        sorting: {},
        filter:{}
    }, {
        total: $scope.tableDataStudent.length, 
        getData: function($defer,params) {
        	if($scope.tableDataStudent != true){
        		var filteredData = params.filter() ? 
        			$filter('filter')(($scope.tableDataStudent), params.filter()) : 
        			$scope.tableDataStudent;
        		var orderedData = params.sorting() ? 
        			$filter('orderBy')(filteredData, params.orderBy()) : 
        			$scope.tableDataStudent;
        		params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        		$scope.tableDisplayStudent = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        	}
        }
    });

    var status_def = [{
	    "id": 1,
	    "name": "Chưa vào lớp",
	    "bgColor": 'yellow'
	}, {
		"id": 2,
	    "name": "Đang làm bài",
	    "bgColor": 'blue'
	}, {
		"id": 3,
	    "name": "Đã nộp bài",
	    "bgColor": 'green'
	}, {
		"id": 4,
	    "name": "Khóa",
	    "bgColor": 'red'
	}];


	function teacherClassList(term_id){
		var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		reqData.term_id = term_id;
		
		TeacherDashboardService.TeacherClassListApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				$scope.teacherClass = respData.class_list;
				console.log($scope.teacherClass);
				$scope.current_quiz_sessions =$scope.teacherClass;
	    	}else if(respData.code == 700){
				Swal.fire({
					  type: 'error',
					  title: 'Phiên đăng nhập của bạn đã kết thúc.',
					  text: 'Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.'
					})
				$location.path('/login');
			}else{
				Swal.fire({
					  type: 'error',
					  title: 'Đã xảy ra lỗi...',
					  text: respData.description
					})
			} 
	    });
	}

	function listQuizSession(term_id){
		var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		reqData.term_id = term_id;
		TeacherDashboardService.ListTeacherQuizSessionApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				$scope.all_test_sessions = [];
				// $scope.current_test_sessions = respData.quiz_session_list;

				var sessions = respData.quiz_session_list;

				var coming_sessions =[];
				var today_sessions =[];
				var hot_sessions =[];

				for (var i = 0; i < sessions.length; i++) {
					let session  = sessions[i];
					console.log(session.start_time);
					let start_time = session.start_time;
					let end_time = session.end_time;

					let dStart = new Date(start_time).getTime();
					let dEnd = new Date(end_time).getTime();

					let now = Date.now();
					var today_start = new Date().setHours(0, 0, 0, 0);
					var today_end = new Date().setHours(23, 59, 59, 999)+1;
					if(dEnd >now){
						if(dEnd<today_end){
							if(dStart<now){
								//happenning
								session.state = 'ongoing';
							}else if(dStart-now<= hot_time_span){
								//hot
								session.state = 'hot';
							}else{
								//incoming...
								session.state = 'cold';
							}
							coming_sessions.push(session);
						}else{
							session.state = 'far';
						}
						$scope.all_test_sessions.push(session);
					}else{
						session.state = 'over';
					}
					
					console.log(coming_sessions);
					$scope.coming_sessions =coming_sessions;
					$scope.current_test_sessions = $scope.coming_sessions;
					$localStorage.current_test_sessions = $scope.current_test_sessions;
				}
	    	}else if(respData.code == 700){
				Swal.fire({
					  type: 'error',
					  title: 'Phiên đăng nhập của bạn đã kết thúc.',
					  text: 'Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.'
					})
				$location.path('/login');
			}else{
	    		Swal.fire({
					  type: 'error',
					  title: 'Đã xảy ra lỗi...',
					  text: respData.description
					})
			} 
	    });
	}

	$scope.toQuizSession = function(session){
		console.log(session);
		$localStorage.selectedQuizSession = session;
		$localStorage.toQuizSession = true;
		$location.path('/t_session');
	}

	$scope.view_hot = true;
	$scope.viewHot = function(){
		$scope.current_test_sessions = $scope.coming_sessions;
		$scope.view_hot = true;
	}
	$scope.viewAll = function(){
		$scope.current_test_sessions = $scope.all_test_sessions;
		$scope.view_hot = false;
	}
	
}]);