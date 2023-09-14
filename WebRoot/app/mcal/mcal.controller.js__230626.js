angular
.module('PAMSapp')
.controller('mcalController', 
['$rootScope', '$scope', '$window', '$interval', '$location', '$filter', 'mcalService', 'NgTableParams','$cookies',
	function ($rootScope, $scope, $window, $interval, $location, $filter, mcalService, NgTableParams,$cookies) {

		(function initController() {
			listQuizSession();
			getTimeTable(new Date().getFullYear(), new Date().getMonth()+1);//current month, as January=0
		})();


		function getTimeTable(year, month){
			var reqData = {};
			reqData.session_id = $cookies.get('session_id');
			reqData.year = year;
			reqData.month = month;
	 	    mcalService.GetTimeTableApi(reqData, function (respData) {
	    		if (respData.code == 200) {
	    			console.log(respData);
					$scope.tt_data = respData.ttb;//TODO
					console.log(respData.ttb);
					console.log($scope.tt_data);

					loadCalendar();
	    		}else if(respData.code == 700){
	    			Swal.fire({
					  type: 'error',
					  title: 'Phiên đăng nhập của bạn đã kết thúc.',
					  text: 'Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.'
					});
					$location.path('/login');
				}else{
					Swal.fire({
					  type: 'error',
					  title: 'Đã có lỗi xảy ra...',
					  text: 'Lỗi load lịch....'
					});
	    		}
	    	});
		}

		//-----------Quiz Sessions table-----------	
	    $scope.tableDisplayQuizSession = [];
	    $scope.tableDataQuizSession = [];
	    $scope.tableParamsQuizSession = new NgTableParams({
	    	page: 1, 
	        count: 5, 
	        sorting: {},
	        filter:{}
	    }, {
	        total: $scope.tableDataQuizSession.length, 
	        getData: function($defer,params) {
	        	if($scope.tableDataQuizSession != true){
	        		var filteredData = params.filter() ? 
	        			$filter('filter')(($scope.tableDataQuizSession), params.filter()) : 
	        			$scope.tableDataQuizSession;
	        		var orderedData = params.sorting() ? 
	        			$filter('orderBy')(filteredData, params.orderBy()) : 
	        			$scope.tableDataQuizSession;
	        		params.total(orderedData.length); // set total for recalc pagination
	                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
	        		$scope.tableDisplayQuizSession = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

	        	}
	        }
	    });

		function listQuizSession(){
			var reqData = {};
			reqData.session_id = $cookies.get("session_id");
			reqData.term_id = $cookies.get("current_term_id");

			console.log(reqData.term_id);
			mcalService.ListTeacherQuizSessionApi(reqData, function (respData) {
				console.log(respData);
				if(respData.code == 200){
					$scope.tableDataQuizSession = respData.quiz_session_list;
	                $scope.tableParamsQuizSession.reload();

	                loadCalendar($scope.tableDataQuizSession);
		    	}else if(respData.code == 700){
		    		Swal.fire({
					  type: 'error',
					  title: 'Phiên đăng nhập của bạn đã kết thúc.',
					  text: 'Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.'
					});
					$location.path('/login');
				}  else{
					Swal.fire({
					  type: 'error',
					  title: 'Đã có lỗi xảy ra...',
					  text: respData.description
					});
				} 
		    });
		}

		lessonPeriods = [
				{
					"id": 1,
					"name": "Kíp 1",
					"start": "07:30",
					"end": "09:20"
				},{
					"id": 2,
					"name": "Kíp 2",
					"start": "09:30",
					"end": "11:20"
				},{
					"id": 3,
					"name": "Kíp 3",
					"start": "12:30",
					"end": "14:20"
				},{
					"id": 4,
					"name": "Kíp 4",
					"start": "14:30",
					"end": "16:20"
				},{
					"id": 5,
					"name": "Kíp 5",
					"start": "16:30",
					"end": "18:20"
				},{
					"id": 6,
					"name": "Kíp 6",
					"start": "19:30",
					"end": "21:20"
				}
			];

		//-----------------------------------------------------------------------------
		$scope.ChangeProg = fnChangeRootProg;
		function fnChangeRootProg(prog){
			console.log(prog);
			$scope.modelProgSelected = prog;
			// listTemplate(prog.prog_id);
			// selectProgram(prog.prog_id);
		}
		
		//++=====================================================
		$scope.quizInfo = {};
		var calendarEl = document.getElementById('calendar');
		
		function loadCalendar(){
			var calendarEl = document.getElementById('m_calendar');
			if(calendarEl==undefined) alert('undefined')
			var calendar = new FullCalendar.Calendar(calendarEl, {
				// nextDayThreshold: '00:00:00',
				initialView: 'dayGridMonth',
				nowIndicator: true,
				defaultDate: new Date(),
				// initialDate: today,
				// initialDate: '2022-08-07',
				height: "auto",
				headerToolbar: {
					left: 'prev,next today',
					// center: 'title addEventButton',
					center: 'title',
					right: 'dayGridMonth,timeGridWeek,timeGridDay,agendaDay,listWeek'
				},
				views: {
				    timeGridDay: { // name of view
				    	// titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
				      	// other view-specific options here
				    	minTime: '09:00:00',
				    	maxTime: '22:00:00'
				    }
				},
				businessHours: {
				  // days of week. an array of zero-based day of week integers (0=Sunday)
				  daysOfWeek: [ 1, 2, 3, 4, 5], // Monday - Thursday

				  startTime: '06:00', // a start time (10am in this example)
				  endTime: '20:00', // an end time (6pm in this example)
				},
				locale:'vi',
				minTime: '07:00',
				maxTime: '22:00',
				scrollTime: '10:00',
				slotDuration: '00:15:00',
				slotLabelInterval: '00:15:00',
				slotLabelFormat: function (date)
				{
					for(var i=0; i<lessonPeriods.length; i++){
						let periodStart = lessonPeriods[i].start.split(":");
						let startHour = periodStart[0];
						if(date.date.hour==parseInt(periodStart[0])&&date.date.minute==parseInt(periodStart[1])){
							return lessonPeriods[i].name;break;
						}
					}

				    /*if ((date.date.hour>7&&date.date.hour<22) && date.date.minute == 30)
				        return 'Tiết '+(date.date.hour-7).toString();*/
				        // return date.date.hour.toString().padStart(2, '0') + ':00';

				    return '';
				    // return date.date.minute;
				},
				eventSources: [
				    {
				        events: $scope.tt_data,
				        color: 'yellow',
				        textColor: 'black'
				    },
				    {
				        // events: $scope.quiz_data,
				        events: $scope.tableDataQuizSession,
				        color: 'blue',
				        textColor: 'white'
				    }
			    ],
				eventClick: function(info) {

					console.log(info.event);
					console.log(info.event.start);
					$scope.selectedDate = info.event.start;
					// $scope.s_date = $scope.selectedDate.toISOString().split('T')[0];
					$scope.s_date = info.event.start.toISOString().split('T')[0];
					console.log($scope.s_date);
				    info.jsEvent.preventDefault(); // don't let the browser navigate
				    let type = info.event.extendedProps.type;
				    console.log(info.event.extendedProps)
				    console.log(type)
				    $scope.quizSession = info.event.extendedProps;
				    console.log($scope.quizSession);
				    console.log($scope.quizSession.prog_name);
				    console.log($scope.quizSession.template_name);
				    
				    if(type=='timetable'){
				    	$scope.ttbTitle = $scope.quizSession.subject_id +'.' +$scope.quizSession.subject_name ;
				    	console.log($scope.ttbTitle);
				    	fnGetRootProgs();
				    	if($scope.ttbTitle!=undefined){
				    		$("#time_table_detail").modal({
					            backdrop: 'static',
					            keyboard: true, 
					            show: true
							});
				    	}
				    	
				    }else if(type=='quiz'){
				    	console.log($scope.tableDataQuizSession)
				    	fnGetRootProgs();
				    	fnQuizSessionStudents($scope.quizSession.quizsession_id);
				    	$scope.quizTitle = $scope.quizSession.prog_name;
				    	console.log($scope.quizSession);
				    	console.log($scope.quizTitle);
				    	if($scope.quizTitle!=undefined){
				    		$("#quiz_session_detail").modal({
				            backdrop: 'true',
				            keyboard: true, 
				            show: true
						});
				    	}
				    }
				},
				select: 
					function(start,end){ 
						fnGetRootProgs();
						
						$scope.startStr = start.startStr;
						var dStart = start.start;
						// dStart.setDate(dStart.getDate());

						$scope.selectedDate = dStart;
						$scope.s_date = toISOLocal(dStart);
						// $scope.s_date = dStart.toISOString().split('T')[0];
						console.log('ooo')
						// console.log(dStart.setHours().toISOString());

						console.log($scope.selectedDate);
						console.log($scope.s_date);
				          // var selDate = new Date(start);
				          // add your function
						if($scope.selectedDate!=undefined){
							$("#create_quiz_session").modal({
								backdrop: 'static',
								keyboard: true, 
								show: true
							});
						}
					},
				selectable:true,
				editable: true,
				// addEvent( event ),
				/*eventDrop: function(info) {
				    alert(info.event.title + " được chuyển sang " + info.event.start.toISOString());
				    if (!confirm("Xác nhận thay đổi?")) {
				      info.revert();
				    }
				}*/
			});

			calendar.render();

		}

		//=====================================================================================
		function fnGetRootProgs(){
			var reqData = {};
			reqData.session_id = $cookies.get('session_id');
			reqData.user_type_id = $cookies.get('user_type_id');
			console.log(reqData);
			mcalService.GetRootProgsApi(reqData, function (respData) {
				console.log(respData);
				if (respData.code == 200) {
					$scope.optionProg = respData.rootprogs;
					$scope.modelProgSelected = $scope.optionProg[0];

					fnChangeRootProg($scope.modelProgSelected);
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
						  title: 'Đã có lỗi xảy ra',
						  text: 'Lỗi prog/listroot! '+ respData.description
						})
				}
			});
		}


	//-----------Student list table-----------	
    $scope.tblDisplayQuizSessionAttendee = [];
    $scope.tblDataQuizSessionAttendee = [];
    $scope.tableParamsQuizSessionAttendee = new NgTableParams({
    	page: 1, 
        count: 5, 
        sorting: {},
        filter:{}
    }, {
        total: $scope.tblDataQuizSessionAttendee.length, 
        getData: function($defer,params) {
        	if($scope.tblDataQuizSessionAttendee != true){
        		var filteredData = params.filter() ? 
        			$filter('filter')(($scope.tblDataQuizSessionAttendee), params.filter()) : 
        			$scope.tblDataQuizSessionAttendee;
        		var orderedData = params.sorting() ? 
        			$filter('orderBy')(filteredData, params.orderBy()) : 
        			$scope.tblDataQuizSessionAttendee;
        		params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        		$scope.tblDisplayQuizSessionAttendee = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        	}
        }
    });

	//=============================================================================
	function fnQuizSessionStudents(quizsession_id){
		var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		reqData.quizsession_id = quizsession_id;
		
		mcalService.QuizSessionStudentsApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				$scope.tblDataQuizSessionAttendee = respData.user_list;
                // $scope.tableParamsQuizSessionAttendee.reload();
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
					  title: 'Đã có lỗi xảy ra...',
					  text: respData.description
					})
			} 
	    });
	}


}]);