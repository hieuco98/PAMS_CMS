angular
.module('PAMSapp')
.controller('mtimetableController', 
['$rootScope', '$scope', '$window', '$interval', '$location', '$filter', 'mTimetableService', 'NgTableParams','$cookies',
 function ($rootScope, $scope, $window, $interval, $location, $filter, mTimetableService, NgTableParams,$cookies) {
	
	$scope.optionYear=[];
	var year = new Date().getFullYear();
	
	$scope.semesterList = [
		{
			"id": 1,
			"name": "2022-2023"
		},{
			"id": 2,
			"name": "2023-2024"
		}
	];


	for (var i = 5; i >=0; i--) {
		var x={};x.id=i-5;
		x.value=year - i;
    	$scope.optionYear.push(x);
    }
	
	//-----------Bảng TKB ngày-----------	
    $scope.tableDisplayDayTimeTable = [];
    $scope.tableDataDayTimeTable = [];
    $scope.tableParamsDayTimeTable = new NgTableParams({
    	page: 1, 
        count: 5, 
        sorting: {},
        filter:{}
    }, {
        total: $scope.tableDataDayTimeTable.length, 
        getData: function($defer,params) {
        	if($scope.tableDataDayTimeTable != true){
        		var filteredData = params.filter() ? 
        			$filter('filter')(($scope.tableDataDayTimeTable), params.filter()) : 
        			$scope.tableDataDayTimeTable;
        		var orderedData = params.sorting() ? 
        			$filter('orderBy')(filteredData, params.orderBy()) : 
        			$scope.tableDataDayTimeTable;
        			
        		params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        		$scope.tableDisplayDayTimeTable = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        	}
        }
    });
	//================================================================================
	(function initController() {
		console.log("mTimetable initController");
		//GetDayTimeTable(2022,11,15)
		// fnListSchoolYear();
		// fnListSemester();
		// fnListWeek();
		// fnListBuilding();
		// fnListClassRoom();
		// fnListFaculty();
		// fnListClass();
		// fnListSubject();
		// fnListLecturer();
		// fnClickThoikhoabieulop();
		listBuilding()
	})();

	//===================================================================================
	$scope.isUploadTKB=false;
	
	$scope.clickViewTKB=function(){
		$scope.isUploadTKB=false;
	}
    $scope.clickUploadTKB=function(){
		$scope.isUploadTKB=true;
		
    }
	$scope.SelectFile = function (file) {
		console.log('SelectFile called....');
		$scope.SelectedFile = file;
	};
	//-----------------------------------------------------------------------------------
	$scope.UploadTKB = function () {
		console.log('Upload called....');

		var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
		
		// if (regex.test($scope.SelectedFile.name.toLowerCase())) {
			if (typeof (FileReader) != "undefined") {
				var reader = new FileReader();
      			//For Browsers other than IE.
				if (reader.readAsBinaryString) {
					reader.onload = function (e) {
						console.log('doom');
						console.log(e);
						$scope.ProcessExcel(e.target.result);
					};
					reader.readAsBinaryString($scope.SelectedFile);
				} else {
          			//For IE Browser.
					reader.onload = function (e) {
						var data = "";
						var bytes = new Uint8Array(e.target.result);
						for (var i = 0; i < bytes.byteLength; i++) {
							data += String.fromCharCode(bytes[i]);
						}
						$scope.ProcessExcel(data);
					};
					reader.readAsArrayBuffer($scope.SelectedFile);
				}
			} else {
				$window.alert("This browser does not support HTML5.");
			}
		// } else {
		// 	$window.alert("Please upload a valid Excel file.");
		// }
	};
	//------------------------------------------------------------------------------------
	$scope.ProcessExcel = function (data) {
		console.log('ProcessExcel called....');

		//Read the Excel File data.
		var workbook = XLSX.read(data, {
			type: 'binary'
		});

		var miscData=XLSX.utils.sheet_to_row_object_array(workbook.Sheets["MISC"]);
		if(miscData.length<=0){
			alert("File không hợp lệ, không thấy trang thông tin MISC");
			return;
		}

		var misc=miscData[0];
		console.log(misc);
		if(misc.school_year==undefined || misc.semester==undefined){
			alert("Thiếu thông tin school_year hoặc  semester");
			return;
		}
		
		//return;
		
			//Fetch the name of First Sheet.
		var firstSheet = workbook.SheetNames[0];

			//Read all rows from First Sheet into an JSON array.
		var timeTableData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

		console.log(timeTableData);

		
		
		var reqData = {};
		reqData.sheet_name=firstSheet;
		reqData.school_year=misc.school_year;
		reqData.semester=misc.semester;
		
		
		reqData.time_table_data=timeTableData;
		console.log(reqData)
		// mTimetableService.UploadTimeTable_new_Api(reqData, function (respData) {
		// 	console.log('chk1');
		// 	if(respData.code == 200){
		// 		alert('Upload TKB thành công');
		// 	}else if(respData.code == 700){
		// 		alert("Phiên đăng nhập của bạn đã kết thúc. Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ");
		// 		$location.path('/login');
		// 	}else{
		// 		alert("Đã xảy ra lỗi:"+respData);
		// 	} 
		// });
		//console.log('chk2');

	      /*$scope.$apply(function () {
	          $scope.Customers = excelRows;
	          $scope.IsVisible = true;
	      });*/
	};
	function listBuilding(){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		//reqData.user_type_id = $cookies.get('user_type_id');
		 //TODO
		console.log(reqData);
		mTimetableService.GetBuildingApi(reqData, function (respData) {
			console.log(respData);
			if (respData.code == 200) {
				$scope.optionBuilding = respData.list_building;
				$scope.modelBuildingSelected = $scope.optionBuilding[0];
				//listFloor($scope.mSelectedBuild.id)
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
	//------------------------------------------------------------------------------------------------
	$scope.modelYear=2022;
	$scope.modelMonth=11;
	$scope.modelDay=13;
	//-------------------------------------------------------------------------------------------------
	$scope.clickViewDayTimeTable=function(day, month,year,subject_code,class_id,lecture_code){
		if(day==undefined){ alert("Chưa nhập ngày"); return;}
		
		if(month==undefined){ alert("Chưa nhập tháng"); return;}
		if(year==undefined){ alert("Chưa nhập năm"); return;}
		
		
		GetDayTimeTable(year, month, day,subject_code,class_id,lecture_code);
	}
	//-------------------------------------------------------------------------------------------------
	function GetDayTimeTable(year,month,day,subject_code,class_id,lecture_code){
		var req= {};
		req.session_id =$cookies.get("session_id");
		req.year=year;
		req.month=month;
		req.day=day;
		if(subject_code!=undefined) req.subject_code=subject_code;
		if(class_id!=undefined) req.class_id=class_id;
		if(lecture_code!=undefined) req.lecture_code=lecture_code;
		
		
		mTimetableService.GetDayTimeTableApi(req, function(respData){
			console.log(respData);
			
			$scope.tableDataDayTimeTable= respData.daytimetable_list;
			$scope.tableParamsDayTimeTable.reload();
		});
	}
	//--------------------------------------------------
	/*$scope.selected_dat="gggggggggggggggggggggg";
	$scope.show_dat=function(){
		alert($scope.selected_dat);
	}*/
	/*$scope.fields = {
            "guid": "ddc4b945-c5cd-4ea0-8374-b00853a5d54c",
            "isActive": true,
            "balance": "$3,012.52",
            "picture": "http://placehold.it/32x32",
            "age": 27,
            "eyeColor": "green",
            "name": "Brooke Salas",
            "gender": "female",
            "company": "TROPOLI",
            "email": "brookesalas@tropoli.com",
            "phone": "+1 (914) 411-3339",
            "address": "498 Exeter Street, Neahkahnie, Mississippi, 8057",
            "about": "Elit qui id minim in magna. Duis est laboris commodo dolore nostrud Lorem sunt incididunt cillum aliquip. Consequat et anim adipisicing quis incididunt reprehenderit fugiat adipisicing ut consectetur do. Aliqua adipisicing quis sint duis nostrud sint consectetur fugiat sint. Labore velit aliqua occaecat do nostrud sit eiusmod laborum proident. Irure duis sit dolore adipisicing laborum.\r\n",
            "registered": "2015-04-29T09:54:48 -06:-30",
            "latitude": 46.191052,
            "longitude": -98.416315
    }
	*/
	//----------------------------------------------------------------------------
	$scope.findRoomMode=true;
	
	function fnClickThoikhoabieulop(){
		//$scope.thoikhoabieulop_click();
	}
	//----------------------------------------------------------------------------
	$scope.thoikhoabieulop_click=function() {
        $("#divThoiKhoiBieu").html("");
        $(".tkbLop").show();
        $(".tkbGiangVien").hide();
        $(".tkbPhong").hide();
        $(".tkbTimPhong").hide();
        $(".tkbKhoa").hide();
        //$(".pnCompensation").hide();
        $scope.findRoomMode=false;
    }

    $scope.thoikhoabieugiangvien_click=function() {
        $("#divThoiKhoiBieu").html("");
        $(".tkbLop").hide();
        $(".tkbGiangVien").show();
        $(".tkbPhong").hide();
        $(".tkbKhoa").hide();
        $(".tkbTimPhong").hide();
        //$(".pnCompensation").hide();
        $scope.findRoomMode=false;
    }

    $scope.thoikhoabieuphong_click=function() {
        $(".tkbLop").hide();
        $(".tkbGiangVien").hide();
        $(".tkbTimPhong").hide();
        $(".tkbPhong").show();
        $(".tkbKhoa").hide();
       // $(".pnCompensation").hide();
        $scope.findRoomMode=false;
    }

    /*$scope.btnCompensation_click=function() {
        $(".tkbLop").hide();
        $(".tkbGiangVien").hide();
        $(".tkbTimPhong").hide();
        $(".tkbPhong").hide();
        $(".tkbKhoa").hide();
        $(".pnCompensation").show();
        $('#divThoiKhoiBieu').empty();
        $scope.findRoom=false;
    }*/
    $scope.thoikhoabieukhoa_click=function() {
    	
        $("#divThoiKhoiBieu").html("");
        $(".tkbLop").hide();
        $(".tkbGiangVien").hide();
        $(".tkbTimPhong").hide();
        $(".tkbKhoa").show();
        $(".tkbPhong").hide();
        //$(".pnCompensation").hide();
        $scope.findRoomMode=false;
    }
    $scope.timphongtrong_click=function() {
        $("#divThoiKhoiBieu").html("");
        $(".tkbLop").hide();
        $(".tkbGiangVien").hide();
        $(".tkbPhong").hide();
        $(".tkbKhoa").hide();
        $(".tkbTimPhong").show();
        $(".pnCompensation").hide();
        $scope.findRoomMode=true;
        /*$('#datetimepicker1').datetimepicker(
           {
               format: 'DD/MM/YYYY'
           }
           );

        $.ajax({
            type: 'GET',
            url: '/Public/ShowRoomsAvailable',
            async: true,
            dataType: 'html',
            success: function (html) {
                $("#divThoiKhoiBieu").html(string(html));
            },
        })
        .fail(
            function (jqXHR, textStatus, err) {
                $("#divThoiKhoiBieu").html(err);
                // ShowAlert("Thông báo", err)
            });*/
    }

    
    //---------------------------------------------------------------------
    function fnListBuilding(){
    	var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		
		mTimetableService.ListBuildingApi(reqData, function (respData) {
			if(respData.code == 200){
				$scope.optionBuilding= respData.building_list;
				
	    	}  else{
	    		alert("Lỗi server");
			} 
	    });
    } 
    //---------------------------------------------------------------------
    function fnListClassRoom(){
    	var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		
		mTimetableService.ListClassRoomApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				$scope.optionClassRoom= respData.classroom_list;
				console.log($scope.optionClassroom);
	    	}  else{
	    		alert("Lỗi server");
			} 
	    });
    } 
    //---------------------------------------------------------------------
    function fnListFaculty(){
    	var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		
		mTimetableService.ListFacultyApi(reqData, function (respData) {
			if(respData.code == 200){
				$scope.optionFaculty= respData.faculty_list;
				
	    	}  else{
	    		alert("Lỗi server");
			} 
	    });
    } 
    //---------------------------------------------------------------------
    function fnListClass(){
    	var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		
		mTimetableService.ListClassApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				$scope.optionClass= respData.class_list;
				console.log($scope.optionClass);
	    	}  else{
	    		alert("Lỗi server");
			} 
	    });
    }  
    //---------------------------------------------------------------------
    function fnListSubject(){
    	var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		
		mTimetableService.ListSubjectApi(reqData, function (respData) {
			if(respData.code == 200){
				$scope.optionSubject= respData.subject_list;
				
	    	}  else{
	    		alert("Lỗi server");
			} 
	    });
    }  
    //---------------------------------------------------------------------
    function fnListLecturer(){
    	var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		
		mTimetableService.ListLecturerApi(reqData, function (respData) {
			if(respData.code == 200){
				$scope.optionLecturer= respData.lecturer_list;
				
	    	}  else{
	    		alert("Lỗi server");
			} 
	    });
    }     
    //---------------------------------------------------------------------
    function fnListSchoolYear(){
    	var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		
		mTimetableService.ListSchoolYearApi(reqData, function (respData) {
			if(respData.code == 200){
				$scope.optionSchoolYear= respData.schoolyear_list;
				
	    	}  else{
	    		alert("Lỗi server");
			} 
	    });
    }   
    //---------------------------------------------------------------------
    function fnListSchoolYear(){
    	var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		
		mTimetableService.ListSchoolYearApi(reqData, function (respData) {
			if(respData.code == 200){
				$scope.optionSchoolYear= respData.schoolyear_list;
				
	    	}  else{
	    		alert("Lỗi server");
			} 
	    });
    }    
    //---------------------------------------------------------------------
    function fnListSemester(){
    	var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		
		mTimetableService.ListSemesterApi(reqData, function (respData) {
			if(respData.code == 200){
				$scope.optionSemester= respData.semester_list;
				
	    	}  else{
	    		alert("Lỗi server");
			} 
	    });
    }       
    
   //---------------------------------------------------------------------
    function fnListWeek(){
    	var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		
		mTimetableService.ListWeekApi(reqData, function (respData) {
			if(respData.code == 200){
				$scope.optionWeek= respData.week_list;
				
	    	}  else{
	    		alert("Lỗi server");
			} 
	    });
    }
    //----------------------------------------------------------------------
    $scope.getClassTimeTable=function(class_id, week){
    	var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		
		if(class_id==undefined){
			alert("Chưa chọn lớp"); return;
		}
		reqData.class_id=class_id;
		
		if(week==undefined){
			alert("Chưa chọn tuần"); return;
		}
		reqData.week=week;
		console.log(reqData);
		mTimetableService.GetClassTimeTableApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				$scope.optionTimeTable= respData.timetable_list;
				
	    	}  else{
	    		alert("Lỗi server");
			} 
	    });
    }  
    //----------------------------------------------------------------------
    $scope.getLecturerTimeTable=function(lecturer_code, week){
    	var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		
		if(lecturer_code==undefined){
			alert("Chưa chọn lớp"); return;
		}
		reqData.lecturer_code=lecturer_code;
		
		if(week==undefined){
			alert("Chưa chọn tuần"); return;
		}
		reqData.week=week;
		console.log(reqData);
		mTimetableService.GetLecturerTimeTableApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				$scope.optionTimeTable= respData.timetable_list;
				
	    	}  else{
	    		alert("Lỗi server");
			} 
	    });
    }
    //----------------------------------------------------------------------
    $scope.getClassRoomTimeTable=function(building,classroom, week){
    	var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		
		if(building==undefined){
			alert("Chưa chọn tòa nhà"); return;
		}
		reqData.building=building;
		
		if(classroom==undefined){
			alert("Chưa chọn phòng"); return;
		}
		reqData.classroom=classroom;
		
		if(week==undefined){
			alert("Chưa chọn tuần"); return;
		}
		reqData.week=week;
		
		console.log(reqData);
		mTimetableService.GetClassRoomTimeTableApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				$scope.optionTimeTable= respData.timetable_list;
				
	    	}  else{
	    		alert("Lỗi server");
			} 
	    });
    }
  //----------------------------------------------------------------------
    $scope.getFacultyTimeTable=function(faculty, week){
    	var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		
		if(faculty==undefined){
			alert("Chưa chọn khoa"); return;
		}
		reqData.faculty=faculty;
		
		if(week==undefined){
			alert("Chưa chọn tuần"); return;
		}
		reqData.week=week;
		console.log(reqData);
		mTimetableService.GetFacultyTimeTableApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				$scope.optionTimeTable= respData.timetable_list;
				
	    	}  else{
	    		alert("Lỗi server");
			} 
	    });
    
    }
    //------------------------------------------------------------------
    $scope.selected_start_period=undefined;
    $scope.selected_end_period=undefined;
    
    $scope.getAvailableRooms=function(building,start_period,end_period,day,month,year){
    	var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		
		if(building==undefined){
			alert("Chưa chọn tòa nhà"); return;
		}
		reqData.building=building;
		
		if(start_period==undefined){
			alert("Chưa chọn kíp bắt đầu"); return;
		}
		reqData.starting_block=start_period;
		$scope.selected_start_period=start_period;
		
		if(end_period==undefined){
			alert("Chưa chọn kíp kết thúc"); return;
		}
		reqData.ending_block=end_period;
		$scope.selected_end_period=end_period;
		
		if(day==undefined){
			alert("Chưa chọn ngày"); return;
		}
		reqData.day=day;
		
		if(month==undefined){
			alert("Chưa chọn tháng"); return;
		}
		reqData.month=month;
		
		if(year==undefined){
			alert("Chưa chọn năm"); return;
		}
		reqData.year=year;
		reqData.type =13
		 var date = day + "/" + month + "/" + year 
		 reqData.date = date
		console.log(reqData);
		mTimetableService.GetAvailableRoomsApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				$scope.optionAvailableRooms= respData.available_room_list;
				
	    	}  else{
	    		alert("Lỗi server");
			} 
	    });
    }
    //----------------------------------------------------------------------
    $scope.selected_room=undefined;
    
    $scope.clickBookRoom=function(room){
    	$scope.selected_room=room;
    	
    	$("#modalBooking").modal({
	        backdrop: 'static',
	        keyboard: true, 
	        show: true,
	        height: 'auto',
	        width: 'auto'/*,
	        'max-height':'100%',
	        'max-width':'100%'*/
		});
    }
  //----------------------------------------------------------
	$scope.clickSubmitBooking= function(area_id,start_period,end_period,reason,day,month,year){
		var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		
		reqData.campus_area_id = area_id;
		reqData.starting_block = start_period;
		reqData.ending_block=end_period;
		reqData.reason=reason;
		var date = day + "/" + month + "/" + year 
		reqData.date = date
		
		mTimetableService.CreateBookingOrderApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				alert("Thành công");
    			
	    	}  else{
	    		alert("Booking Lỗi server");
			} 
	    });

		 
	}
}]);
