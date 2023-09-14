angular
.module('PAMSapp')
.controller('TeacherCalendarController', 
		['$rootScope', '$scope', '$window', '$modal','$interval', '$location', '$filter', 'TeacherCalendarService','TeacherQuizService', 'NgTableParams','$cookies',
		 function ($rootScope, $scope, $window, $modal, $interval, $location, $filter, TeacherCalendarService,TeacherQuizService, NgTableParams,$cookies) {
	
	(function initController() {
		termList();
		// fnGetRootProgs();
    })();

    function termList(){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
 	    TeacherCalendarService.TermlistApi(reqData, function (respData) {
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
				}
				myCalendar($scope.selectedTerm.id);
				listQuizSession($scope.selectedTerm.id);
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
					  title: 'Đã xảy ra lỗi...',
					  text: 'Lỗi termList: '+ respData.description
					})
    		}
    	});
	}

	function myCalendar(term_id){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.term_id = term_id;
 	    TeacherCalendarService.TeacherCalendarApi(reqData, function (respData) {
    		if (respData.code == 200) {
    			console.log(respData);
				$scope.tt_data = $scope.tt_data;//TODO
				$scope.quiz_data = $scope.quiz_data;//TODO

				loadCalendar($scope.tt_data, $scope.quiz_data);
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
					  text: 'Lỗi myCalendar: '+ respData.description
					})
    		}
    	});
	}


	$scope.tt_data = [
		{
			title: 'Kỹ thuật âm thanh',
			start: '2022-08-12T10:30:00',
			end: '2022-08-12T12:30:00', 
			type: 'timetable'
		},{
			title: 'An toàn thông tin',
			start: '2022-08-15T10:30:00',
			end: '2022-08-15T12:30:00', 
			type: 'timetable'
		},{
			title: 'Nhập môn ĐPT',
			start: '2022-08-20T10:30:00',
			end: '2022-08-20T12:30:00', 
			type: 'timetable'
		},{
			title: 'Triết học',
			start: '2022-08-20T14:30:00',
			end: '2022-08-20T16:30:00', 
			type: 'timetable'
		},{
			title: 'Kỹ năng mềm',
			start: '2022-08-25T10:30:00',
			end: '2022-08-25T12:30:00', 
			type: 'timetable'
		}
	];


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
	function loadCalendar(){
		var calendarEl = document.getElementById('t_calendar');

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
			    
			    if(type=='timetable'){
			    	if(info.event.start >new Date()) {
						$("#create_quiz_session").modal({
							backdrop: 'static',
							keyboard: true, 
							show: true
						});
					}else{
						Swal.fire({
							type: 'warning',
							title: 'Không tạo được ca thi vào ngày đã chọn',
							text: 'Không tạo được ca thi vào khoảng thời gian đã xảy ra'
						});
						return;
					}
			    }else if(type=='quiz'){
			    	console.log($scope.tableDataQuizSession)
			    	fnGetRootProgs();
			    	fnQuizSessionStudents($scope.quizSession.quizsession_id);
			    	
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
					console.log('is it??????');
					console.log(start); 
					console.log(start.start);

					console.log(end); 

					console.log(start.start.toISOString());
					console.log(start.startStr);
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
						if(start.start.setHours(23, 59, 59, 999)>=Date.now()) {
							$("#create_quiz_session").modal({
								backdrop: 'static',
								keyboard: true, 
								show: true
							});
						}else{
							Swal.fire({
								type: 'warning',
								title: 'Không tạo được ca thi vào ngày đã chọn',
								text: 'Không tạo được ca thi vào khoảng thời gian đã xảy ra'
							});
							return;
						}
						
					}
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

	function toISOLocal(d) {
		var z  = n =>  ('0' + n).slice(-2);
		var zz = n => ('00' + n).slice(-3);
		var off = d.getTimezoneOffset();
		var sign = off > 0? '-' : '+';
		off = Math.abs(off);

		return d.getFullYear() + '-'
		+ z(d.getMonth()+1) + '-' +
		z(d.getDate()) + ' ' +
		z(d.getHours()) + ':'  + 
		z(d.getMinutes()) + ':' +
		z(d.getSeconds()) /*+ '.' +
		zz(d.getMilliseconds()) +
		sign + z(off/60|0) + ':' + z(off%60);*/ 
	}

	function toIsoString(date) {
		var tzo = -date.getTimezoneOffset(),
		dif = tzo >= 0 ? '+' : '-',
		pad = function(num) {
			return (num < 10 ? '0' : '') + num;
		};

		return date.getFullYear() +
		'-' + pad(date.getMonth() + 1) +
		'-' + pad(date.getDate()) +
		'T' + pad(date.getHours()) +
		':' + pad(date.getMinutes()) +
		':00' /*+ pad(date.getSeconds()) +
		dif + pad(Math.floor(Math.abs(tzo) / 60)) +
		':' + pad(Math.abs(tzo) % 60);*/
	}

	function displaySessionDetail(_s){
		// alert('hhhh')
		console.log(_s);
		$("#quiz_session_detail").modal({
			            backdrop: 'true',
			            keyboard: true, 
			            show: true
					});
	}

	function myClasses(term_id, prog_id){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.term_id = term_id;
		if(prog_id!=undefined){
			reqData.prog_id = prog_id;
		}
		
 	    TeacherCalendarService.TeacherClassesApi(reqData, function (respData) {
    		if (respData.code == 200) {
    			console.log(respData);
				$scope.myClasses = respData.class_list;
    			$scope.selectedClass = $scope.myClasses[0];

    			// fnListClassStudent($scope.selectedClass.class_id);

    			// getListofQuiz();
    			//CLEAR THE LIST
    			$scope.selected_ids = [];
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
					  text: 'Lỗi myClasses: '+ respData.description
					})
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
	//=============================================================================

	//=====================================================================================
	function fnGetRootProgs(){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.user_type_id = $cookies.get('user_type_id');
		console.log(reqData);
 	    TeacherCalendarService.GetRootProgsApi(reqData, function (respData) {
 	    	console.log(respData);
    		if (respData.code == 200) {
    			$scope.optionProg = respData.rootprogs;
    			$scope.modelProgSelected = $scope.optionProg[0];
    			if($scope.modelProgSelected!=undefined){
    				fnChangeRootProg($scope.modelProgSelected);
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
					  text: 'Lỗi listroot: '+ respData.description
					})
    		}
    	});
    }
	//-----------------------------------------------------------------------------
	$scope.changeRootProg = fnChangeRootProg;
	function fnChangeRootProg(progSelected){
		console.log("In fnChangeRootProg:"+progSelected.prog_id);
		getListofQuizBatch(progSelected.prog_id);

		//get list of prog class
		myClasses($scope.selectedTerm.id, progSelected.prog_id);
    }

    //=====================================================================================
	function fnGetProgClassList(prog_id){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.prog_id = prog_id;
		console.log(reqData);
 	    TeacherCalendarService.ListClassApi(reqData, function (respData) {
 	    	console.log(respData);
    		if (respData.code == 200) {
    			$scope.optionProg = respData.rootprogs;
    			$scope.modelProgSelected = $scope.optionProg[0];
    			if($scope.modelProgSelected!=undefined){
    				fnChangeRootProg($scope.modelProgSelected);
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
					  text: 'Lỗi ListClassApi: '+ respData.description
					})
    		}
    	});
    }

    $scope.tableDisplayQuizBatch = [];
    $scope.tableDataQuizBatch = [];
    $scope.tableParamsQuizBatch = new NgTableParams({
    	page: 1, 
        count: 5, 
        sorting: {},
        filter:{}
    }, {
        total: $scope.tableDataQuizBatch.length, 
        getData: function($defer,params) {
        	if($scope.tableDataQuizBatch != true){
        		var filteredData = params.filter() ? 
        			$filter('filter')(($scope.tableDataQuizBatch), params.filter()) : 
        			$scope.tableDataQuizBatch;
        		var orderedData = params.sorting() ? 
        			$filter('orderBy')(filteredData, params.orderBy()) : 
        			$scope.tableDataQuizBatch;
        		params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        		$scope.tableDisplayQuizBatch = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        	}
        }
    });

	//-----------------------------------------------------------------------------
	//tra ve danh sach cac dot tao quiz
    function getListofQuizBatch(prog_id){
    	var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.prog_id = prog_id;
		console.log(reqData);
 	    TeacherQuizService.getListofQuizApi(reqData, function (respData) {
 	    	console.log(respData);
    		if (respData.code == 200) {
    			// $scope.filteredQuizs = respData.quiz_list;

    			$scope.tableDataQuizBatch = respData.quiz_list;

    			$scope.tableParamsQuizBatch.reload();

    			$scope.selectedQuizBatch = $scope.tableDataQuizBatch[0];
    			changeQuizBatch($scope.selectedQuizBatch);
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
					  text: 'Lỗi getListofQuizApi: '+ respData.description
					})
    		}
    	});
    }

    //-----------------------------------------------------------------------------
    $scope.changeQuizBatch = changeQuizBatch;
	function changeQuizBatch(b){
		// console.log("Selected batch ID:"+b.id+"; selected batch name: "+b.name);
		//TODO
		
    }

	//=============================================================================
	$scope.selected_class_ids = [];
	$scope.selected_ids = [];

    $scope.classCollection = function(_class){
    	console.log('ppppppppppppppppppppppppppppppppppppp');
    	console.log(_class);
    	var class_id = _class.class_id;
    	if(_class.selected){
    		$scope.selected_class_ids.push(class_id);
    		//lấy ds sv của lớp
			var reqData = {};
			reqData.session_id = $cookies.get("session_id");
			reqData.class_id=class_id;
			TeacherCalendarService.ListClassStudentApi(reqData, function (respData) {
				console.log(respData);
				if(respData.code == 200){
					var students = respData.user_list;
					students.forEach(student => {
						console.log(student);
						console.log($scope.selected_ids);
						student.selected=true;
						if(!$scope.selected_ids.includes(student.ID)){
							console.log('YAYYYYYYY')
							$scope.tableDataStudent.push(student);
							// $scope.selected_ids.push(student.ID);
							// console.log($scope.selected_ids);
						}

						/*for(let h=0; h<$scope.tableDataStudent.length; h++){
							console.log($scope.tableDataStudent[h]);
							if($scope.tableDataStudent[h].ID == student.ID){
								$scope.tableDataStudent.push(student);break;
							}
						}*/
						$scope.tableParamsStudent.reload();
					})
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
					  title: 'Xảy ra lỗi khi lấy danh sách sinh viên!',
					  text: ''
					})
				} 
		    });
    	}else if(!_class.selected){
    		for(let z=0; z<$scope.selected_class_ids.length; z++){
				if($scope.selected_class_ids[z] == class_id){
					$scope.selected_class_ids.splice(z,1);
				} 
			}

    		//lấy ds sv của lớp
			var reqData = {};
			reqData.session_id = $cookies.get("session_id");
			reqData.class_id=class_id;
			TeacherCalendarService.ListClassStudentApi(reqData, function (respData) {
				console.log(respData);
				if(respData.code == 200){
					var students = respData.user_list;
					// students.forEach(student => {
					// 	console.log(student);
					// 	$scope.selected_ids.forEach(function(item, index, object){
					// 		if(item == student.ID){
					// 			alert('chk1')
					// 			object.splice(index, 1);
					// 		}else alert('chk2')
					// 	})
					// })

					for(let i=0; i<students.length; i++){
						for(let j=0; j<$scope.selected_ids.length; j++){
							console.log(students[i]);
							console.log($scope.selected_ids[j]);
							if($scope.selected_ids[j] == students[i].ID){
								$scope.selected_ids.splice(j,1);
							} 
						}

						for(let k=0; k<$scope.tableDataStudent.length; k++){
							console.log($scope.tableDataStudent[k]);
							if($scope.tableDataStudent[k].ID == students[i].ID){
								$scope.tableDataStudent.splice(k,1);
								$scope.tableParamsStudent.reload();
							}
						}
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
					  title: 'Xảy ra lỗi khi lấy danh sách sinh viên!',
					  text: ''
					})
				} 
		    });
    	}
		console.log($scope.selected_ids);
		$scope.tableParamsStudent.reload();
    }

    function quizsessionNameExisted(session_name, quiz_session_list){
		let isExisted = false;
		console.log(quiz_session_list);
		let found = 0;
		for (let i=0; i<quiz_session_list.length; i++){
			if(quiz_session_list[i].title==session_name
				&& quiz_session_list[i].prog_id==$scope.modelProgSelected.prog_id){
				found = 1; break;
			}
		}
		return found;
	}

	//=============================================================================
	$scope.quizInfo ={};
	$scope.createQuizSession = function(){
		if($scope.quizStartTime==undefined){
			$scope.quizStartTime = new Date();
		}

		var session_name = $scope.quizInfo.title;
		console.log(session_name);
		//Kiểm tra hợp lệ tên
		if(session_name==undefined){
			$scope.isQuizSessionNameInvalid = true;
			Swal.fire({
			  type: 'error',
			  title: 'Chưa nhập tên ca thi hoặc tên không hợp lệ!!',
			  text: ''
			})
			return;
		}else if(quizsessionNameExisted(session_name, $scope.tableDataQuizSession)==1){
			Swal.fire({
			  type: 'error',
			  title: 'Tên ca thi đã được sử dụng!!',
			  text: ''
			})
			return;
		}

		//Kiểm tra đã chọn tập đề thi
		console.log($scope.tableDataQuizBatch);
		if($scope.tableDataQuizBatch==undefined || $scope.tableDataQuizBatch.length==0){
			Swal.fire({
				type: 'error',
				title: 'Cần thiết lập đề thi cho môn học trước khi tạo ca thi!',
				text: ''
			})
			return;
		}else if($scope.selectedQuizBatch ==undefined){
			Swal.fire({
			  type: 'error',
			  title: 'Chưa chọn đề thi!',
			  text: ''
			})
			return;
		}

		//Kiểm tra danh sách sinh viên
		/*if($scope.selected_ids==undefined||$scope.selected_ids.length==0){
			Swal.fire({
				type: 'error',
				title: 'Chưa có sinh viên trong danh sách!',
				text: 'Vui lòng kiểm tra tích chọn lớp hoặc nhập danh sách sinh viên!'
			})
			return;
		}*/

		if($scope.tableDisplayStudent.length==0){
			Swal.fire({
				type: 'error',
				title: 'Chưa có sinh viên trong danh sách!',
				text: 'Vui lòng kiểm tra tích chọn lớp hoặc nhập danh sách sinh viên!'
			})
			return;
		}else{
			$scope.selected_ids = [];
			var students = $scope.tableDisplayStudent;
			students.forEach(student => {
				if(!$scope.selected_ids.includes(student.ID)){
					$scope.selected_ids.push(student.ID);
					console.log($scope.selected_ids);
				}

				/*for(let h=0; h<$scope.tableDataStudent.length; h++){
					console.log($scope.tableDataStudent[h]);
					if($scope.tableDataStudent[h].ID == student.ID){
						$scope.tableDataStudent.push(student);break;
					}
				}*/
				// $scope.tableParamsStudent.reload();
			})			
		}

		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.session_name = session_name;
		reqData.quiz_id = $scope.selectedQuizBatch.id;
		reqData.student_lists = $scope.selected_ids;
		reqData.term_id = $scope.selectedTerm.id;
		console.log($scope.selectedDate);
		console.log(new Date($scope.selectedDate));
		console.log(new Date().toISOString());
		console.log(new Date().toLocaleString());
		
		
		// reqData.start_time = toIsoString($scope.selectedDate);
		var d = changed($scope.quizStartTime, $scope.selectedDate);
		reqData.start_time = new Date(d.getTime() - d.getTimezoneOffset()*60000);
		console.log(reqData);
		TeacherCalendarService.CreateQuizSessionApi(reqData, function (respData) {
			if(respData.code == 200){
				Swal.fire(
				  'Thành công!',
				  'Ca thi đã được tạo thành công!',
				  'success'
				)
				// listSet(reqData.prog_id);

				listQuizSession($scope.selectedTerm.id);

				//reset selected list 
				$scope.tableDataStudent = [];
				$scope.tableParamsStudent.reload();
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
					title: respData.description,
					text: ''
				})
			} 
		});
		resetCreateQuizSessionForm();
	}

	//=============================================================================
	$scope.deleteQuizSession = function(quizsession_id){

		Swal.fire({
			title: 'Xác nhận xóa ca thi?',
			text: "Ca thi bị xóa sẽ không phục hồi lại được!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Xóa!'
		}).then((result) => {
			if (result.value) {
				var reqData = {};
				reqData.session_id = $cookies.get('session_id');
				reqData.quizsession_id = quizsession_id;
				TeacherCalendarService.DeleteQuizSessionApi(reqData, function (respData) {
					if(respData.code == 200){
						Swal.fire({
							type: 'success',
							title: 'Thành công',
							text: 'Đã xóa ca thi'
						})

						listQuizSession($scope.selectedTerm.id);
					}else if(respData.code == 700){
						Swal.fire({
							type: 'info',
							title: "Phiên đăng nhập của bạn đã kết thúc",
							text: 'Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ'
						})
						$location.path('/login');
					}
					else{
						Swal.fire({
							type: 'error',
							title: respData.description,
							text: ''
						})
					} 
				});
			}
		})
		
	}
	//---------------------------------------------

	function resetCreateQuizSessionForm(){
		//reset list
		$scope.selected_ids=[];
		$("#create_quiz_session").modal('hide');
		$scope.isClassSelected = false;			
		$scope.currentClassId = -1;
		$scope.quizInfo = {};
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

	function listQuizSession(term_id){
		var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		reqData.term_id = term_id;
		TeacherCalendarService.ListTeacherQuizSessionApi(reqData, function (respData) {
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
					})
				$location.path('/login');
			}else{
				Swal.fire({
					  type: 'error',
					  title: 'Đã xảy ra lỗi...',
					  text: 'Lỗi ListTeacherQuizSessionApi: '+ respData.description
					})
			} 
	    });
	}

	//---------------------------------------------------------------------
	$scope.clickViewStudentList= function (_class){
		if($scope.currentClassId == _class.class_id){
			console.log('case 1')
			$scope.isClassSelected = false;			
			$scope.currentClassId = -1;
		}else{
			$scope.currentClassId = _class.class_id;
			$scope.isClassSelected = true;	

			fnListClassStudent($scope.currentClassId);	
		}
	};

	//-----------Quiz Sessions table-----------	
    $scope.tableDisplaySS = [];
    $scope.ssStudent = [];
    $scope.tableParamsSS = new NgTableParams({
    	page: 1, 
        count: 5, 
        sorting: {},
        filter:{}
    }, {
        total: $scope.ssStudent.length, 
        getData: function($defer,params) {
        	if($scope.ssStudent != true){
        		var filteredData = params.filter() ? 
        			$filter('filter')(($scope.ssStudent), params.filter()) : 
        			$scope.ssStudent;
        		var orderedData = params.sorting() ? 
        			$filter('orderBy')(filteredData, params.orderBy()) : 
        			$scope.ssStudent;
        		params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        		$scope.tableDisplayQuizSession = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        	}
        }
    });

	//=============================================================================
	function fnListQuizSessionStudent(quizsession_id){
		var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		// $scope.isCreateNewStudent = false;
		
		reqData.quizsession_id = quizsession_id;
		
		TeacherCalendarService.QuizSessionStudentsApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				$scope.tblDataQuizSessionAttendee = respData.user_list;
				$scope.tableParamsQuizSessionAttendee.reload();
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
					  text: 'Lỗi QuizSessionStudentsApi: '+ respData.description
					})
			} 
	    });
	}

	//=============================================================================
	function fnListClassStudent(class_id){
		var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		$scope.isCreateNewStudent = false;
		
		reqData.class_id = class_id;//TODO
		// reqData.class_id=$scope.modelClassSelected.class_id;
		
		TeacherCalendarService.ListClassStudentApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				$scope.tableDataStudent = respData.user_list;
                $scope.tableParamsStudent.reload();
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
					  text: 'Lỗi ListClassStudentApi: '+ respData.description
					})
			} 
	    });
	}

	$scope.showAddStudent =false;
	$scope.addStudent = function(ids){
		if(ids==undefined||ids.length==0){
			Swal.fire({
				type: 'error',
				title: 'Chưa nhập mã số sinh viên!'
			})	
			return;		
		}
		$scope.showAddStudent =true; 

		var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		// reqData.ids = $scope.ids2add;
		reqData.ids = ids;
		reqData.quizsession_id = $scope.quizSession.quizsession_id;
		
		TeacherCalendarService.AddStudentstoQuizSessionApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				$scope.result = respData.result;
				$("#add_student_result_popup").modal({
		            backdrop: 'static',
		            keyboard: true, 
		            show: true
				});
				fnListQuizSessionStudent($scope.quizSession.quizsession_id);
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
					  text: 'Lỗi AddStudentstoQuizSessionApi: '+ respData.description
					})
			} 
	    });
	}

	//----------------------------------------------------------------------------------------------
    $scope.clickDeleteStudent =  function(s) {
    	var reqData = {};
    	if (!confirm("Xóa sinh viên "+ s.student_name+ " khỏi danh sách ca thi?")) {return;}
    	
    	reqData.session_id = $cookies.get('session_id'); 
		reqData.student_id = s.student_id;
		reqData.doquiz_id= s.doquiz_id;
		
		TeacherCalendarService.RemoveStudentFromQuizApi(reqData, function (respData) {
			if(respData.code == 200){
				fnListQuizSessionStudent($scope.quizSession.quizsession_id);
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
					  text: 'Lỗi RemoveStudentFromQuizApi: '+ respData.description
					})
			} 
	    });
    };


    //=============================================================================
	function fnQuizSessionStudents(quizsession_id){
		var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		reqData.quizsession_id = quizsession_id;
		
		TeacherCalendarService.QuizSessionStudentsApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				$scope.tblDataQuizSessionAttendee = respData.user_list;
                $scope.tableParamsQuizSessionAttendee.reload();
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
					  text: 'Lỗi QuizSessionStudentsApi: '+ respData.description
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

    
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //Time picker options
    $scope.quizStartTime = new Date();
    $scope.hstep = 1;
    $scope.mstep = 5;
    $scope.ismeridian = true;
 
    $scope.changed = changed;
    function changed (date1, date2) {
    	var d = toISOLocal(date1);
    	// var d = $scope.quizStartTime;
    	// console.log('Time changed to: ' + $scope.quizStartTime);
    	// d = toISOLocal(d);
    	console.log(d);
    	var t = d.split(' ')[1].split('.')[0].split(':');
    	console.log(t);
    	// g = new Date(d.getTime() - d.getTimezoneOffset()*60000);
    	// console.log(g);
    	// var t = d.toISOString().split('T')[1].split('.')[0].split(':');
    	// // var t = $scope.quizStartTime.toISOString().split('T')[1].split('.')[0].split(':');
    	// console.log($scope.quizStartTime.toISOString());
    	// console.log($scope.quizStartTime.toLocaleString());
    	// console.log($scope.quizStartTime.toISOString().split('T')[1]);
    	// console.log($scope.quizStartTime.toISOString().split('T')[1].split('.')[0]);
    	// console.log(t);
    	// console.log($scope.selectedDate);
    	// l = new Date($scope.selectedDate);
    	l = new Date(date2);
    	l.setHours(parseInt(t[0]),parseInt(t[1]),0);
    	// $scope.selectedDate
    	// $scope.selectedDate = toISOLocal($scope.selectedDate);

    	// console.log($scope.selectedDate);
    	// console.log(l);
    	// $scope.selectedDate = l;
    	// outputdate = l;
    	return l;
    	// console.log($scope.selectedDate.toISOString());
    };

    function addQuizStarttimeToDate(time, date){
    	console.log(time);
    	console.log(date);
    	time = new Date(time.getTime() - time.getTimezoneOffset()*60000);
    	var t = time.toISOString().split('T')[1].split('.')[0].split(':');
    	date.setHours(parseInt(t[0]),parseInt(t[1]),parseInt(t[2]));
    	console.log(date);
    	return date;
    }


}]);
