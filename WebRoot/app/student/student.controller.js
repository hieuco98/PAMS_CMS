angular
.module('PAMSapp')
.controller('StudentController', 
['$rootScope', '$scope', '$window', '$interval', '$location', '$filter', '$timeout', '$localStorage','StudentService', 'NgTableParams','$cookies', 'Excel',
 function ($rootScope, $scope, $window, $interval, $location, $filter, $timeout, $localStorage, StudentService,NgTableParams,$cookies,Excel) {

	
	$scope.currentStudentId=-1;
	$scope.isStudentSelected=false;

	$scope.isCreateNewUser = false;
	
	$scope.modelStudentSelected =[];	
	$scope.isCreateNewStudent=false;
	
	
    $scope.selectedTabIsStudentInfo = true;
    $scope.selectedTabIsStudentHistory = false;
 
	$scope.disabledAddRoot = true;
	$scope.disabledAddBranch = true;
	$scope.isUpdateSelected = false;
	$scope.orgSelected = false;
    
    $scope.modelMessageSubject="";
	$scope.modelMessageContent="";
    
	$scope.choiceStudentInputMode=0;


	$scope.data_limit = { id: 10 };
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
    
    $scope.choiceViewStudentMode=0;
    //-----------Check-in list table----------	
    $scope.tableDisplayCheckin = [];
    $scope.tableDataCheckin = [];
    $scope.tableParamsCheckin = new NgTableParams({
    	page: 1, 
        count: 5, 
        sorting: {},
        filter:{}
    }, {
        total: $scope.tableDataCheckin.length, 
        getData: function($defer,params) {
        	if($scope.tableDataCheckin != true){
        		var filteredData = params.filter() ? 
        			$filter('filter')(($scope.tableDataCheckin), params.filter()) : 
        			$scope.tableDataCheckin;
        		var orderedData = params.sorting() ? 
        			$filter('orderBy')(filteredData, params.orderBy()) : 
        			$scope.tableDataCheckin;
        		params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        		$scope.tableDisplayCheckin = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        	}
        }
    });
    //-----------Iteractive list table----------	
    $scope.tableDisplayInteractive = [];
    $scope.tableDataInteractive = [];
    $scope.tableParamsInteractive = new NgTableParams({
    	page: 1, 
        count: 25, 
        sorting: {},
        filter:{}
    }, {
        total: $scope.tableDataInteractive.length, 
        getData: function($defer,params) {
        	if($scope.tableDataInteractive != true){
        		var filteredData = params.filter() ? 
        			$filter('filter')(($scope.tableDataInteractive), params.filter()) : 
        			$scope.tableDataInteractive;
        		var orderedData = params.sorting() ? 
        			$filter('orderBy')(filteredData, params.orderBy()) : 
        			$scope.tableDataInteractive;
        		params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        		$scope.tableDisplayInteractive = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        	}
        }
    });
  //=============================================================================
	(function initController() {
		// fnGetOrgTree();
		fnListRootProg();
		termList();
    })();
	//-------------------------student_id------------------------------------------------
	$scope.RadioChange = function (s) {
    	console.log($scope.choiceViewStudentMode);
    };
    //-----------------------------------------------------------------------------------------------
	function fnGetStudentStatistics(){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.prog_id = $scope.modelProgSelected.prog_id;
		reqData.class_id = $scope.modelClassSelected.class_id; //TODO
		reqData.student_id = $scope.modelStudentSelected.student_id;
		
		console.log(reqData);
		StudentService.GetStudentStatisticsApi(reqData, function (respData) {
 	    	console.log(respData);
    		if (respData.code == 200) {
    			// amchart_student_progress.data =respData.do_quiz_list;
    			$scope.tableDataInteractive = respData.do_quiz_list;
                $scope.tableParamsInteractive.reload();
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
	//=============================================================================
	//--------------------------------------------------------------------------------
	$scope.ChangeProg=function(prog){
		if(prog==null || prog==undefined){
			$scope.modelProgSelected=undefined;
		}else{
			$scope.modelProgSelected=prog;
			$scope.optionGroups = $scope.modelProgSelected.groups;
			if($scope.optionGroups!=undefined&&$scope.optionGroups.length>0){
				$scope.modelGroupSelected = $scope.optionGroups[0];
				$scope.optionSubgroups = $scope.modelGroupSelected.subgroups;
				if($scope.optionSubgroups!=undefined&&$scope.optionSubgroups.length>0){
					$scope.modelSubgroupSelected = $scope.optionSubgroups[0];
				}
			}
			// fnListStudent();
			fnListClass($scope.modelProgSelected.prog_id);
		}
	};
	//--------------------------------------------------------------------------------
	$scope.ChangeGroup=function(group){
		if(group==null || group==undefined){
			$scope.modelGroupSelected=undefined;
		}else{
			$scope.modelGroupSelected=group;
			$scope.optionSubgroups = $scope.modelGroupSelected.subgroups;

			if($scope.optionSubgroups!=undefined&&$scope.optionSubgroups.length>0){
				$scope.modelSubgroupSelected = $scope.optionSubgroups[0];
			}
		}
	};
	//-----------------------------------------------------------------------------
	function fnListRootProg(){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');  		
		reqData.user_type_id = $cookies.get('user_type_id');  		
  		
		console.log(reqData);
		StudentService.ListRootProgApi(reqData, function (respData) {
 	    	console.log(respData);
    		if (respData.code == 200) {
				$scope.optionProg = respData.rootprogs;
				$scope.modelProgSelected = $scope.optionProg[0];
				$scope.ChangeProg($scope.modelProgSelected);
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

	//-----------------------------------------------------------------------------
	function fnListClass(prog_id){//TODO
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');  		
		reqData.prog_id = prog_id;  		
  		
		console.log(reqData);
		StudentService.ListClassByProgApi(reqData, function (respData) {
 	    	console.log(respData);
    		if (respData.code == 200) {
				$scope.class_list = respData.class_list;
				$scope.mClass_selected = $scope.class_list[0];
				$scope.ChangeClass($scope.mClass_selected);
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
	//=============================================================================
	$scope.ChangeClass=function(_class){
		if(_class==null){
			console.log("Load fnChangeClass NULL");
			$scope.mClass_selected=undefined;
		}else{
			// $scope.mClass_selected=_class;
			fnListStudentByClass(_class.class_id);
		}
	};

	//=============================================================================
	function fnListStudentByClass(class_id){
		var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		reqData.class_id=class_id;
		// $scope.isLoading = true;
		StudentService.ListClassStudentApi(reqData, function (respData) {
			// $scope.isLoading = false;

			console.log(respData);
			if(respData.code == 200){
				$scope.tableDataStudent = respData.user_list;
				$scope.current_grid = 1;
			    $scope.data_limit = 10;
			    $scope.filter_data = $scope.tableDataStudent.length;
			    $scope.entire_user = $scope.tableDataStudent.length;
	    	}else if(respData.code == 700){
				Swal.fire({
					  type: 'error',
					  title: 'Phiên đăng nhập của bạn đã kết thúc.',
					  text: 'Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.'
					})
				$location.path('/login');
			}  else{
				Swal.fire({
					  type: 'error',
					  title: 'Đã xảy ra lỗi...',
					  text: respData.description
					})
			} 
	    });
	}


	//-----------------------------------------------------------------------------
	//=============================================================================
	function fnListStudent(){
		var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		$scope.isCreateNewStudent=false;
		reqData.prog=$scope.modelProgSelected;
		$scope.isLoading = true;
		StudentService.ListStudentApi(reqData, function (respData) {
			$scope.isLoading = false;

			console.log(respData);
			if(respData.code == 200){
				$scope.tableDataStudent = respData.user_list;
                /*if($scope.tableDataStudent.length > 0){
	    			$scope.modelStudentSelected = $scope.tableDataStudent[0];	   			
	    			// $scope.clickStudentSelected($scope.modelStudentSelected);//TODO shx 221219
                }
                $scope.tableParamsStudent.reload();
*/

				$scope.current_grid = 1;
			    // $scope.data_limit = 10;
			    $scope.filter_data = $scope.tableDataStudent.length;
			    $scope.entire_user = $scope.tableDataStudent.length;
	    	}else if(respData.code == 700){
				Swal.fire({
					  type: 'error',
					  title: 'Phiên đăng nhập của bạn đã kết thúc.',
					  text: 'Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.'
					})
				$location.path('/login');
			}  else{
				Swal.fire({
					  type: 'error',
					  title: 'Đã xảy ra lỗi...',
					  text: respData.description
					})
			} 
	    });
	}
    //--------------------------------------------------------------------------
    $scope.clickStudentSelected= function (student){
    	console.log('clk....' );
    	console.log(student);
    	console.log("currentStudentId:"+$scope.currentStudentId);
    	
    	if($scope.currentStudentId == student.id){
			$scope.isStudentSelected = false;			
			$scope.currentStudentId = -1;
			
		}else{
			$scope.currentStudentId = student.id;
			$scope.isStudentSelected = true;	
			
			$scope.modelStudentSelected = student;	
			$scope.isCreateNewStudent=false;
			
			//get student classes
			fnListStudentClasses($scope.currentStudentId);
			// fnGetStudentStatistics();
		
		}
	};

	//-----------Student list table-----------	
    $scope.tableDisplayStudentClass = [];
    $scope.tableDataStudentClass = [];
    $scope.tableParamsStudentClass = new NgTableParams({
    	page: 1, 
        count: 5, 
        sorting: {},
        filter:{}
    }, {
        total: $scope.tableDataStudentClass.length, 
        getData: function($defer,params) {
        	if($scope.tableDataStudentClass != true){
        		var filteredData = params.filter() ? 
        			$filter('filter')(($scope.tableDataStudentClass), params.filter()) : 
        			$scope.tableDataStudentClass;
        		var orderedData = params.sorting() ? 
        			$filter('orderBy')(filteredData, params.orderBy()) : 
        			$scope.tableDataStudentClass;
        		params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        		$scope.tableDisplayStudentClass = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        	}
        }
    });

	//=============================================================================
	function fnListStudentClasses(student_id){
		var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		$scope.isCreateNewStudent=false;
		reqData.student_id= student_id;
		reqData.term_id= $scope.selectedTerm.id;
		$scope.isLoading = true;
		StudentService.ListStudentClassApi(reqData, function (respData) {
			$scope.isLoading = false;
			console.log(respData);
			if(respData.code == 200){
				$scope.tableDataStudentClass = respData.class_list;
				$scope.tableParamsStudentClass.reload();
	    	}else if(respData.code == 700){
				Swal.fire({
					  type: 'error',
					  title: 'Phiên đăng nhập của bạn đã kết thúc.',
					  text: 'Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.'
					})
				$location.path('/login');
			}  else{
				Swal.fire({
					  type: 'error',
					  title: 'Đã xảy ra lỗi...',
					  text: respData.description
					})
			} 
	    });
	}

	 //--------------------------------------------------------------------------
	$scope.clickAddNewStudent=function(){
		$scope.isCreateNewStudent= true;
		
 	}
	$scope.clickViewStudentList=function(){
		$scope.isCreateNewStudent= false;

 	}
	
	//----------------------------------------------------------------------------
	$scope.addStudent=function(){
  		var reqData = {};
		reqData.session_id = $cookies.get('session_id'); 
		
		reqData.student_name = $scope.userFullname;
		if(reqData.student_name==null) {alert("Chưa có họ tên");return}

		reqData.student_code = $scope.userStudentID;
		if(reqData.student_code==null) {alert("Chưa có mã số sinh viên");return}
		
		reqData.student_email = $scope.userEmail;
		if(reqData.student_email==null) {alert("Chưa có email");return}
		
		reqData.student_password = $scope.userPassword;
		if(reqData.student_password==null) {alert("Chưa có pasword");return}

		reqData.student_dob = $scope.userDoB;
		if(reqData.student_dob==null) {alert("Chưa nhập ngày sinh");return}
		
		if($scope.userMobile!=undefined) reqData.student_mobile=$scope.userMobile;
		

		if($scope.userNCClass.class_nc_code==undefined){
			Swal.fire({
				type: 'warning',
				title: 'Chưa chọn lớp',
				text: ''
			})
			return;
		}
		reqData.class_code 	= $scope.userNCClass.class_nc_code;
		reqData.term_id 	= $scope.selectedTerm.id;
		reqData.class_id 	= $scope.mClass_selected.class_id;
		
		StudentService.CreateStudentApi(reqData, function (respData) {
			if(respData.code == 200){
				Swal.fire({
					  type: 'success',
					  title: 'Thêm sinh viên thành công',
					  text: ' '
					})
				fnListStudentByClass($scope.mClass_selected.class_id);
	    	}else if(respData.code == 700){
				Swal.fire({
					  type: 'error',
					  title: 'Phiên đăng nhập của bạn đã kết thúc.',
					  text: 'Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.'
					})
				$location.path('/login');
			}  else{
				Swal.fire({
					  type: 'error',
					  title: 'Đã có lỗi xảy ra',
					  text: respData.description
					})
			} 
	    });
  		
  		
  	}
	
	//----------------------------------------------------------------------------------------------
    $scope.clickDeleteStudent =  function(student_id) {
    	var reqData = {};
    	if (!confirm("Bạn chắc chắn muốn xóa student?")) {return;}
    	
    	reqData.session_id = $cookies.get('session_id'); 
		reqData.student_id = student_id;
		reqData.class_id=$scope.mClass_selected.class_id;
		
		StudentService.DeleteStudentApi(reqData, function (respData) {
			if(respData.code == 200){
				fnListStudentByClass($scope.mClass_selected.class_id);
	    	}else if(respData.code == 700){
				Swal.fire({
					  type: 'error',
					  title: 'Phiên đăng nhập của bạn đã kết thúc.',
					  text: 'Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.'
					})
				$location.path('/login');
			}  else{
	    		Swal.fire({
					  type: 'error',
					  title: 'Đã có lỗi xảy ra',
					  text: respData.description
					})
			} 
	    });
  
    };
	//----------------------------------------------------------------------------------------------    
    //$scope.clickEditStudent=function(){
    //	alert("reserved");
    //}
    //---------------------------------------------------------------------------------------------
    $scope.updateProfile=function(student){
    	var reqData = {};
		if (!confirm("Bạn chắc chắn muốn cập nhật?")) {return;}

    	if(student.full_name!=undefined){
    		reqData.full_name=student.full_name;
    	}
    	if(student.email!=undefined){
    		reqData.email=student.email;
    	}
    	if(student.mobile!=undefined){
    		reqData.mobile=student.mobile;
    	}
    	if(student.code!=undefined){
    		reqData.code=student.code;
    	}
    	if(student.dob!=undefined){
    		reqData.dob=student.dob;
    	}
    	
		reqData.session_id = $cookies.get('session_id'); 
		reqData.user_id = $scope.modelStudentSelected.id;
		console.log(reqData);
		StudentService.UpdateStudentProfileApi(reqData, function (respData) {
			if(respData.code == 200){
				Swal.fire({
					  type: 'success',
					  title: 'Cập nhật thành công',
					  text: ''
					})
				fnListStudentByClass($scope.mClass_selected.class_id);
	    	}else if(respData.code == 700){
				Swal.fire({
					  type: 'error',
					  title: 'Phiên đăng nhập của bạn đã kết thúc.',
					  text: 'Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.'
					})
				$location.path('/login');
			}  else{
				Swal.fire({
					  type: 'error',
					  title: 'Đã có lỗi xảy ra',
					  text: respData.description
					})
			} 
	    });
    }
	//---------------------------------------------------------------------------------------------- 
    $scope.studentinfoTab = function() {
		  $scope.selectedTabIsUserInfo = true;
		  $scope.selectedTabIsUserHistory = false;
	};
	//----------------------------------------------------------------------------------------------
	$scope.studenthistoryTab = function() {
		  $scope.selectedTabIsUserInfo = false;
		  $scope.selectedTabIsUserHistory = true;		
	}

	$scope.clickAddNewUser=function(){
		$scope.isCreateNewUser = true;
  		if($scope.isCreateNewUser==true) {
  			$scope.isUserSelected = false;			
			$scope.currentUserId = -1;
  		}
  		fnGetAllNCClasses();

  		// termList();
 	}


 	var sFile="";
	$scope.fileStudentChanged=function(e){
		var files = e.target.files;	
 		sFile = files[0];
 		console.log("sFile="+sFile);
	};
	//-----------------------------------------------------------------------------
	$scope.file_is_uploading = false;
	$scope.uploadStudent=function(){
		$scope.file_is_uploading = true;
		if(sFile==""){
			Swal.fire({
				  type: 'warning',
				  title: 'Chưa chọn file',
				  text: ' '
				})
			return;
		}
		var reader = new FileReader();
 		 reader.onload = function(e) {
	        var data = e.target.result;
	        var cfb = XLS.CFB.read(data, {type: 'binary'});
	        var wb = XLS.parse_xlscfb(cfb);
	        wb.SheetNames.forEach(function(sheetName) {
	        
	        	var s2j=XLS.utils.sheet_to_json(wb.Sheets[sheetName]);   
	        	console.log(s2j);
	        	
	            var oJS = XLS.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);   
	            //console.log(oJS);
	            
	            var reqData = {};
	    		reqData.session_id = $cookies.get('session_id');
	    		reqData.file_name="";
	    		
	    		reqData.term_id=$scope.selectedTerm.id;
	    		reqData.data=s2j;
	    		
	    		console.log(reqData);
	    		StudentService.AddStudentFileApi(reqData, function (respData) {
	     	    	console.log(respData);
	        		if (respData.code == 200) {
	        			Swal.fire({
							  type: 'success',
							  title: 'Thêm thành công.',
							  text: 'Upload file thành công.'
							})
						$scope.file_is_uploading = false;
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
							  title: 'Đã có lỗi xảy ra.',
							  text: respData.description
							})
	        		}
	        	});
	        });
	    };
	    reader.readAsBinaryString(sFile);
		
	};

	//student table------------
	$scope.page_position = function(page_number) {
        $scope.current_grid = page_number;
    };
    $scope.filter = function() {
        $timeout(function() {
            $scope.filter_data = $scope.searched.length;
        }, 20);
    };
    $scope.sort_with = function(base) {
        $scope.base = base;
        $scope.reverse = !$scope.reverse;
    };
    //-------------------------


    function termList(){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
 	    StudentService.TermlistApi(reqData, function (respData) {
    		if (respData.code == 200) {
    			console.log(respData);
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
					  text: 'Lỗi termList! '+respData.description
					})
    		}
    	});
	}

	$scope.changeTerm = changeTerm;
    function changeTerm(selectedTerm){
		console.log("changeTerm: "+selectedTerm.id);
	}

	$scope.showAddClass2Student = false;
	$scope.clkAddClass2Student = function(){
		$scope.showAddClass2Student = true;
		// fnListRootProg();
	}

	//--------------------------------------------------------------------------------------------------
	$scope.delClassFromStudent = function(index) {
		var xclass=$scope.tableDataStudentClass[index];
		Swal.fire({
		  title: 'Xác nhận xóa lớp '+xclass.class_name + ' của sinh viên',
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Xác nhận!'
		}).then((result) => {
			if (result.value) {
		    	var reqData = {};
				reqData.session_id = $cookies.get("session_id");

				reqData.class_id=xclass.class_id;
				reqData.student_id=$scope.modelStudentSelected.id;
				reqData.term_id=$scope.selectedTerm.id;

				StudentService.RemoveClassFromStudentApi(reqData, function (respData) {
					console.log(respData);
					if(respData.code == 200){
						fnListStudentClasses($scope.modelStudentSelected.id);
						Swal.fire({
						  type: 'success',
						  title: 'Thành công',
						  text: ''
						});
			    	}else if(respData.code == 700){
		    			Swal.fire({
						  type: 'warning',
						  title: 'Phiên đăng nhập của bạn đã kết thúc. Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ'
						});
		    			$location.path('/login');
		    		}else {
		    			Swal.fire({
						  type: 'error',
						  title: 'Đã xảy ra lỗi...',
						  text: respData.description
						});
		    		}
			    });
			}
		})
	}

	//--------------------------------------------------------------------------------
	$scope.change_selected_prog=function(prog){
		if(prog==null || prog==undefined){
			$scope.m_selected_prog=undefined;
		}else{
			$scope.m_selected_prog=prog;
			// $scope.optionGroups = $scope.m_selected_prog.groups;
			// if($scope.optionGroups!=undefined&&$scope.optionGroups.length>0){
			// 	$scope.modelGroupSelected = $scope.optionGroups[0];
			// 	$scope.optionSubgroups = $scope.modelGroupSelected.subgroups;
			// 	if($scope.optionSubgroups!=undefined&&$scope.optionSubgroups.length>0){
			// 		$scope.modelSubgroupSelected = $scope.optionSubgroups[0];
			// 	}
			// }
			// fnListStudent();
			fnListClass_1($scope.m_selected_prog.prog_id);
		}
	};

	function fnListClass_1(prog_id){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');  		
		reqData.prog_id = prog_id;  		
  		
		console.log(reqData);
		StudentService.ListClassByProgApi(reqData, function (respData) {
 	    	console.log(respData);
    		if (respData.code == 200) {
				$scope.optionClass_1 = respData.class_list;
				$scope.m_selected_class = $scope.optionClass_1[0];
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
				});
    		}
    	});

	}

	//---------------------------------------------------------------
	$scope.addClass2Student = function() {
		var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		if($scope.m_selected_class==undefined){
			Swal.fire({
				type: 'warning',
				title: 'Chưa chọn lớp',
				text: ''
			});
			return;
		}

		reqData.class_id=$scope.m_selected_class.class_id;
		reqData.student_id=$scope.modelStudentSelected.id;
		reqData.term_id=$scope.selectedTerm.id;
		
		console.log(reqData);
		StudentService.AddClass2StudentApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				fnListStudentClasses($scope.modelStudentSelected.id);
				Swal.fire({
					type: 'success',
					title: 'Thành công',
					text: 'Gán lớp thành công'
				});
			}else if(respData.code == 700){
				Swal.fire({
					type: 'warning',
					title: 'Phiên đăng nhập của bạn đã kết thúc.',
					text: 'Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ'
				});
				$location.path('/login');
			}  else{
				Swal.fire({
					type: 'error',
					title: respData.description,
					text: ''
				});
			} 
		});
	}

	$scope.exportToExcel=function(tableId){ // ex: '#my-table'
        var exportHref=Excel.tableToExcel(tableId,'DS');
        $timeout(function(){location.href=exportHref;},100); // trigger download
    }

    $scope.return2List = function(){
    	$scope.isCreateNewUser=false; 
    	$scope.isStudentSelected=false
    }

    //----------------------------------------------------------------
    function fnGetAllNCClasses(){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');  		
  		
		console.log(reqData);
		StudentService.GetAllClassNCApi(reqData, function (respData) {
 	    	console.log(respData);
    		if (respData.code == 200) {
				$scope.option_NC_Class = respData.class_list;
				if($scope.option_NC_Class.length==0){
					Swal.fire({
					  type: 'info',
					  title: 'Chưa có lớp niên chế nào trong danh sách',
					  text: 'Vui lòng kiểm tra lại thiết lập danh sách sinh viên'
					})
				}else{
					$scope.selected_nc_class = $scope.option_NC_Class[0];
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

	$scope.showAddStudent =false;
	$scope.addStudent2Class = function(ids){
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
		reqData.ids = ids;
		reqData.class_id=$scope.mClass_selected.class_id;
		reqData.term_id= $scope.selectedTerm.id;
		
		StudentService.AddStudentstoClassApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				$scope.result = respData.result;
				$("#add_student_result_popup").modal({
		            backdrop: 'static',
		            keyboard: true, 
		            show: true
				});
				$scope.isCreateNewUser==false;
				fnListStudentByClass($scope.mClass_selected.class_id);
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
					  text: 'Lỗi AddStudentstoClassApi: '+ respData.description
					})
			} 
	    });
	}

}]);