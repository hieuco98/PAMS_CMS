angular
.module('PAMSapp')
.controller('mcalController', 
['$rootScope', '$scope', '$window', '$interval', '$location', '$filter', 'mcalService', 'NgTableParams','$cookies',
	function ($rootScope, $scope, $window, $interval, $location, $filter, mcalService, NgTableParams,$cookies) {

	$rootScope.elem=null ;
	var lessonPeriods = [
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

	$scope.campusLocations = [
		{
			"id": 0,
			"name": "Tất cả"
		},{
			"id": 1,
			"name": "A1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA ssssssssssssssssssss"
		},{
			"id": 2,
			"name": "A2"
		},{
			"id": 3,
			"name": "A3"
		}
	];
	$scope.mSelectedLoc = $scope.campusLocations[1];

	$scope.roomTypes = [
		{
			"id": 0,
			"name": "Tất cả"
		},{
			"id": 1,
			"name": "Phòng học"
		},{
			"id": 2,
			"name": "Giảng đường"
		},{
			"id": 3,
			"name": "Hội trường"
		},{
			"id": 4,
			"name": "Ngoài trời"
		}
	];
	$scope.mSelectedRoomTye = $scope.roomTypes[0];

	$scope.roomCapacities = [
		{
			"id": 0,
			"name": "Tất cả"
		},{
			"id": 1,
			"name": "0-15"
		},{
			"id": 2,
			"name": "30"
		},{
			"id": 3,
			"name": "50"
		},{
			"id": 4,
			"name": "75"
		},{
			"id": 5,
			"name": ">100"
		}
	];	
	$scope.mSelectedCap = $scope.roomCapacities[0];
			

	//=============================================================================
	(function initController() {
		// listQuizSession();
		// f1();
		listCampusArea(3);//default for CS1 HD
		// loadCalendar();

		listRoom(116);//Tang 4 nha A2

		getTimeTable(2023, new Date().getMonth()+1);//current month, as January=0

		loadX();
	})();

	function listCampusArea(area_id){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.user_type_id = $cookies.get('user_type_id');
		reqData.area_id = area_id; //TODO
		console.log(reqData);
		mcalService.GetAreaByParentApi(reqData, function (respData) {
			console.log(respData);
			if (respData.code == 200) {
				$scope.campusLocations = respData.campus_area_list;
				$scope.mSelectedLoc = $scope.campusLocations[0];

				// fnChangeRootProg($scope.modelProgSelected);
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
					text: 'Lỗi GetAreaByParentApi! '+ respData.description
				})
			}
		});
	}

	function listRoom(area_id){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.user_type_id = $cookies.get('user_type_id');
		reqData.area_id = area_id;
		console.log(reqData);
		mcalService.GetAreaByParentApi(reqData, function (respData) {
			console.log(respData);
			if (respData.code == 200) {
				$scope.roomLists=[];
				if(respData.campus_area_list.length==0){
					$scope.roomLists=[];
				}else{
					respData.campus_area_list.forEach(e =>{
						let r= {};
						r.id = e.id;
						r.title = e.name;
						$scope.roomLists.push(r);
					})
				}
				if($scope.roomLists!=undefined&&$scope.roomLists.length>0){
					console.log($scope.roomLists);
					loadCalendar();
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
					title: 'Đã có lỗi xảy ra',
					text: 'Lỗi GetAreaByParentApi! '+ respData.description
				})
			}
		});
	}

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


	function loadCalendar(){
		var calendarEl = document.getElementById('m_calendar');

		var calendar = new FullCalendar.Calendar(calendarEl, {
			schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
			// nextDayThreshold: '00:00:00',
			initialView: 'resourceTimelineDay',
			// initialView: 'dayGridMonth',
			nowIndicator: true,
			defaultDate: new Date(),

			// initialDate: today,
			// initialDate: '2022-08-07',
			height: "auto",
			headerToolbar: {
				left: 'prev,next today',
				// center: 'title addEventButton',
				center: 'title',
				right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth'
				// right: 'dayGridMonth,timeGridWeek,timeGridDay,agendaDay,listWeek'
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

			editable: true,
          	resourceAreaHeaderContent: 'Phòng',
          	resources: $scope.roomLists,
          	// resources: 'https://fullcalendar.io/api/demo-feeds/resources.json?with-nesting&with-colors',
          	events: 'https://fullcalendar.io/api/demo-feeds/events.json?single-day&for-resource-timeline',

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

				//reset student list
				$scope.tableDataStudent = [];
    			$scope.tableParamsStudent.reload();

				console.log(info.event);
				console.log(info.title);
				console.log(info.event.start);
				$scope.selectedDate = info.event.start;
				// $scope.s_date = $scope.selectedDate.toISOString().split('T')[0];
				$scope.s_date = info.event.start.toISOString().split('T')[0];
				console.log($scope.s_date);
			    info.jsEvent.preventDefault(); // don't let the browser navigate
			    let type = info.event.extendedProps.type;
			    console.log(info.event.extendedProps)
			    $scope.quizTitle = info.event.extendedProps.prog_code + '--' + info.event.extendedProps.quizsession_title;
			    console.log($scope.quizTitle);
			    console.log(type)
			    $scope.quizSession = info.event.extendedProps;
			    console.log($scope.quizSession);
			    console.log($scope.quizSession.prog_name);
			    console.log($scope.quizSession.template_name);
			},
			select: 
				function(start,end){ 
					// fnGetRootProgs();
					console.log('is it??????');
					console.log(start); 
					console.log(start.start);

					console.log(end); 

					$("#abc").modal({
								backdrop: 'static',
								keyboard: true, 
								show: true
							});

				},
			selectable:true,
			editable: true,
			// addEvent( event ),
			eventDrop: function(info) {
			    alert(info.event.title + " được chuyển sang " + info.event.start.toISOString());
			    if (!confirm("Xác nhận thay đổi?")) {
			      info.revert();
			    }
			}
		});

		calendar.render();

}


function loadX(){
	console.log('X calendar called....')
	var calendarEl = document.getElementById('calendar1');

	var calendar = new FullCalendar.Calendar(calendarEl, {
		schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
		timeZone: 'UTC',
		initialView: 'resourceTimelineDay',
		aspectRatio: 1.5,
		headerToolbar: {
			left: 'prev,next today custom1',
			center: 'title',
			right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth'
		},
		customButtons: {
	      custom1: {
	        text: 'Tới ngày tiếp',
	        click: function() {
	          alert('Tới ngày tiếp theo có phòng trống!');
	        }
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
		editable: true,
		resourceAreaHeaderContent: 'Phòng',
		resources: 'https://fullcalendar.io/api/demo-feeds/resources.json?with-nesting&with-colors',
		events: 'https://fullcalendar.io/api/demo-feeds/events.json?single-day&for-resource-timeline'
	});

	calendar.render();
}


	
}]);