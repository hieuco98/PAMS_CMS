angular
.module('PAMSapp')
.controller('UserController', 
['$rootScope', '$scope', '$window', '$interval', '$timeout', '$location', '$filter', 'UserService', 'NgTableParams','$cookies', 'Excel',
 function ($rootScope, $scope, $window, $interval, $timeout, $location, $filter, UserService,NgTableParams,$cookies, Excel) {
	
	$scope.userType = [
					     
					      {id: 2, name: 'CB Quản lý'},
					      {id: 3, name: 'Phòng ban'},
					      {id: 4, name: 'Nhân viên'},
					      {id: 5, name: 'Người dùng'}
					  ];
	$scope.selectedUserType = $scope.userType[0];
	
	$scope.currentUserId=-1;
	$scope.isUserSelected=false;
	
	$scope.modelUserSelected =[];	
	$scope.isCreateNewUser=false;
    
    
    $scope.modelMessageSubject="";
	$scope.modelMessageContent="";
    
	//-----------user list table-----------	

	$scope.filter={
		name:undefined
	};
    $scope.tableDisplayUser = [];
    $scope.tableDataUser = [];
    $scope.tableParamsUser = new NgTableParams({
    	page: 1, 
        count: 5, 
        sorting: {},
        filter:$scope.filter
    }, {
        total: $scope.tableDataUser.length, 
        getData: function($defer,params) {
        	if($scope.tableDataUser != true){
        		var filteredData = params.filter() ? 
        			$filter('filter')(($scope.tableDataUser), params.filter()) : 
        			$scope.tableDataUser;
        		var orderedData = params.sorting() ? 
        			$filter('orderBy')(filteredData, params.orderBy()) : 
        			$scope.tableDataUser;
        		params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        		$scope.tableDisplayUser = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        	}
        }
    });

  //=============================================================================
	(function initController() {
		UserList();
		// fnListRootProg();
    })();
	
	
	//=============================================================================
	function UserList(){
		var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		$scope.isCreateNewUser=false;
		$scope.isLoading = true;
		UserService.ListUserApi(reqData, function (respData) {
			console.log(respData);
			$scope.isLoading = false;
			if(respData.code == 200){
				$scope.tableDataUser = respData.list_user;
				// if($scope.modelUserSelected == undefined){
					if($scope.tableDataUser.length > 0){
		    			$scope.modelUserSelected = $scope.tableDataUser[0];	  
		    			$scope.currentUserId = 	$scope.modelUserSelected.id;	
		    			console.log($scope.currentUserId)	;
	                }
				// }
                $scope.clickUserSelected($scope.modelUserSelected);
                $scope.tableParamsUser.reload();
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
					  title: 'Đã xảy ra lỗi',
					  text: 'Lỗi khi lấy danh sách người dùng'
					})
			} 
	    });
	}
    //--------------------------------------------------------------------------
    $scope.clickUserSelected= function (user){
    	console.log(user)
    	console.log("currentUserId:"+$scope.currentUserId);
    	
    	if($scope.currentUserId == user.id){
			$scope.isUserSelected = false;			
			$scope.currentUserId = -1;
			
		}else{
			
			$scope.currentUserId = user.id;
			$scope.isUserSelected = true;	
			
			$scope.modelUserSelected = user;	
			$scope.isCreateNewUser=false;

		}
	};
	 //--------------------------------------------------------------------------
	$scope.clickAddNewUser=function(){
		$scope.isCreateNewUser = true;
  		if($scope.isCreateNewUser==true) {
  			$scope.isUserSelected = false;			
			$scope.currentUserId = -1;
  		}
  		
 	}
	
	//----------------------------------------------------------------------------
	$scope.addUser=function(){
  		var reqData = {};
		reqData.session_id = $cookies.get('session_id'); 
		
		reqData.fullname = $scope.userFullname;
		if(reqData.fullname==null) {alert("Chưa có họ tên");return}
		
		reqData.email = $scope.userEmail;
		if(reqData.email==null) {alert("Chưa có email");return}

		reqData.password = $scope.userPassword;
		if(reqData.password==null) {alert("Chưa có password");return}
		
		if($scope.userMobile!=undefined) {reqData.mobile=$scope.userMobile;}
		
		
		reqData.user_type=$scope.selectedUserType.id;
		
		UserService.CreateUserApi(reqData, function (respData) {
			console.log(respData)
			if(respData.code == 200){
				UserList();
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
					  title: 'Đã xảy ra lỗi',
					  text: respData.description
					})
			} 
	    });
  		
  		
  	}
	//----------------------------------------------------------------------------------------------
    $scope.clickDeleteUser = function(user) {
    	var reqData = {};

    	Swal.fire({
    		title: 'Xác nhận xóa người dùng '+user.full_name+'?',
    		text: "",
    		icon: 'warning',
    		showCancelButton: true,
    		confirmButtonColor: '#3085d6',
    		cancelButtonColor: '#d33',
    		confirmButtonText: 'Xác nhận!'
    	}).then((result) => {
    		if (result.value) {
    			reqData.session_id = $cookies.get('session_id'); 
		    	reqData.user_id = user.id;
		    	UserService.DeleteUserApi(reqData, function (respData) {
		    		if(respData.code == 200){
		    			UserList();
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
							  title: 'Đã xảy ra lỗi',
							  text: respData.description
							})
					} 
			    });

    			/*Swal.fire(
    				'Deleted!',
    				'Your file has been deleted.',
    				'success'
    				)*/
    		}
    	})

    	// if (!confirm("Bạn chắc chắn muốn xóa user?")) {return;}
    	
    	
  
    };
    //---------------------------------------------------------------------------------------------
    $scope.updateProfile=function(user){
    	var reqData = {};
		if (!confirm("Bạn chắc chắn muốn cập nhật?")) {return;}

    	if(user.full_name!=undefined){
    		reqData.full_name=user.full_name;
    	}
    	if(user.mobile!=undefined){
    		reqData.mobile=user.mobile;
    	}
    	if(user.email!=undefined){
    		reqData.email=user.email;
    	}
    	if(user.code!=undefined){
    		reqData.code=user.code;
    	}
    	
		reqData.session_id = $cookies.get('session_id'); 
		reqData.user_id = $scope.modelUserSelected.id;
		UserService.UpdateUserApi(reqData, function (respData) {
			if(respData.code == 200){
				UserList();
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
					  title: 'Đã xảy ra lỗi',
					  text: respData.description
					})
			} 
	    });
    }

	function teacherClasses(term_id){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.term_id = term_id;
		reqData.user_id = $scope.currentUserId;
 	    UserService.TeacherClassesApi(reqData, function (respData) {
    		if (respData.code == 200) {
    			console.log(respData);
				$scope.teacherClasses = respData.class_list;
    			// $scope.selectedClass = $scope.teacherClasses[0];
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
					  title: 'Đã xảy ra lỗi',
					  text: respData.description
					})
    		}
    	});
	}

	//======================================
	//--------------------------------------------------
	$scope.ChangeClass=function(xclass){
		console.log(xclass);
		if(xclass==undefined){
			$scope.modelClassSelected=undefined;
		}else{
			$scope.modelClassSelected=xclass;
		}
	};
	
	//----------------------------------------------------------------------------
	function fnListTeacherClassByProg(prog){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.prog_id = prog.prog_id;
		
		console.log(reqData);
		UserService.ListProgClassApi(reqData, function (respData) {
 	    	console.log(respData);
    		if (respData.code == 200) {
				$scope.optionClass = respData.class_list;
				$scope.modelClassSelected = $scope.optionClass[0];
				$scope.ChangeClass($scope.modelClassSelected);
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
					  title: 'Đã xảy ra lỗi',
					  text: respData.description
					})
    		}
    	});

	}
	//----------------------------------------------------------------------------------------------
 	$scope.ChangeProg=function(prog){
		console.log(prog);
		if(prog==undefined){
			$scope.modelProgSelected=undefined;
		}else{
			$scope.modelProgSelected=prog;
			fnListTeacherClassByProg(prog);
		}
	};
	//----------------------------------------------------
    function fnListRootProg(){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');  		
		reqData.user_type_id = $cookies.get('user_type_id'); 	
		console.log(reqData);
		UserService.ListRootProgApi(reqData, function (respData) {
 	    	console.log(respData);
    		if (respData.code == 200) {
				$scope.optionProg = respData.rootprogs;
				if($scope.optionProg.length>0){
					$scope.modelProgSelected = $scope.optionProg[0];
					$scope.ChangeProg($scope.modelProgSelected);
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
					  title: 'Đã xảy ra lỗi',
					  text: respData.description
					})
    		}
    	});
	}
    //---------------------------------------------------------------
    $scope.addProgToUser = function() {
		var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		if($scope.modelProgSelected==undefined){
			alert("Chưa chọn môn");
			return;
		}

		reqData.prog_id=$scope.modelProgSelected.prog_id;
		reqData.user_id=$scope.modelUserSelected.id;
		
		console.log(reqData);
		UserService.AddProgToUserApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				UserList();
				alert("Thành công");
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
    //--------------------------------------------------------------------------------------------------
	$scope.delProgFromUser = function(index) {
		var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		
		var prog=$scope.modelUserSelected.prog_list[index];

		reqData.prog_id=prog.prog_id;
		reqData.user_id=$scope.modelUserSelected.id;
		//----------------------------------------------------
		Swal.fire({
		  title: 'Bạn chắc chắn?',
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Chắc chắn, xóa!'
		}).then((result) => {
			if (result.value) {
		    	var reqData = {};
				reqData.session_id = $cookies.get("session_id");
				
				var prog=$scope.modelUserSelected.prog_list[index];

				reqData.prog_id=prog.prog_id;
				reqData.user_id=$scope.modelUserSelected.id;
				UserService.RemoveProgFromUserApi(reqData, function (respData) {
					console.log(respData);
					if(respData.code == 200){
						UserList();
						Swal.fire(
					      'Thành công!',
					      'success'
					    )
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
	//---------------------------------------------------------------
    $scope.addClassToUser = function() {
		var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		if($scope.modelClassSelected==undefined){
			Swal.fire({
	    			type: 'warning',
	    			title: 'Chưa chọn lớp',
	    			text: ''
	    		});
			return;
		}

		reqData.class_id=$scope.modelClassSelected.class_id;
		reqData.user_id=$scope.modelUserSelected.id;
		reqData.term_id=$scope.selectedTerm.id;
		
		console.log(reqData);
		UserService.AddClassToUserApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				teacherClasses($scope.selectedTerm.id);
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
	//--------------------------------------------------------------------------------------------------
	$scope.delClassFromUser = function(index) {
		Swal.fire({
		  title: 'Xác nhận bỏ phân công lớp cho giảng viên',
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Xác nhận!'
		}).then((result) => {
			if (result.value) {
		    	var reqData = {};
				reqData.session_id = $cookies.get("session_id");
				
				var xclass=$scope.modelUserSelected.class_list[index];

				reqData.class_id=xclass.class_id;
				reqData.user_id=$scope.modelUserSelected.id;

				UserService.RemoveClassFromUserApi(reqData, function (respData) {
					console.log(respData);
					if(respData.code == 200){
						// UserList();
						$scope.modelUserSelected.class_list.splice(index,1);
						$scope.teacherClasses.splice(index,1);
						Swal.fire(
					      'Thành công!',
					      '',
					      'success'
					    )
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

	//--------------------------------------------------------------------------------------------------
	$scope.delUserType = function(index) {
		Swal.fire({
		  title: 'Xác nhận bỏ vai người dùng',
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Xác nhận!'
		}).then((result) => {
			if (result.value) {
		    	var reqData = {};
				reqData.session_id = $cookies.get("session_id");
				console.log($scope.modelUserSelected.types);

				console.log(index)
				var xtype=$scope.modelUserSelected.types[index];

				reqData.type=xtype.type;
				reqData.user_id=$scope.modelUserSelected.id;

				UserService.RemoveTypeFromUserApi(reqData, function (respData) {
					console.log(respData);
					if(respData.code == 200){
						$scope.modelUserSelected.types.splice(index,1);
						console.log($scope.modelUserSelected.types);
						// UserList();
						Swal.fire(
					      'Thành công!',
					      '',
					      'success'
					    )
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
	
	//---------------------------------------------------------------------------------------------- 
	$scope.clkAddUserType =  function(type){
		var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		
		reqData.type=type.type;
		reqData.user_id=$scope.modelUserSelected.id;

		UserService.AddType2UserApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				console.log($scope.modelUserSelected.types);
				$scope.modelUserSelected.types.push({'type':type.type})
				// UserList();
				Swal.fire(
			      'Thành công!',
			      '',
			      'success'
			    )
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
	//---------------------------------------------------------------------------------------------- 
    $scope.userinfoTab = function() {
    	 $scope.selectedTabIsUserInfo = true;
    	 $scope.selectedTabIsUserClass = false;
    	 $scope.selectedTabIsUserProg = false;
    	 $scope.selectedTabIsUserHistory = false;
	};
	//---------------------------------------------------------------------------------------------- 
    $scope.userclassTab = function() {
   	 	$scope.selectedTabIsUserInfo = false;
   	 	$scope.selectedTabIsUserClass = true;
   	 	$scope.selectedTabIsUserProg = false;
   	 	$scope.selectedTabIsUserHistory = false;

   	 	teacherClasses($scope.selectedTerm.id);
	};
	//---------------------------------------------------------------------------------------------- 
    $scope.userprogTab = function() {
	   	 $scope.selectedTabIsUserInfo = false;
		 $scope.selectedTabIsUserClass = false;
		 $scope.selectedTabIsUserProg = true;
		 $scope.selectedTabIsUserHistory = false;
		
	};
	//----------------------------------------------------------------------------------------------
	$scope.userhistoryTab = function() {
	   	 $scope.selectedTabIsUserInfo = false;
		 $scope.selectedTabIsUserClass = false;
		 $scope.selectedTabIsUserProg = false;
		 $scope.selectedTabIsUserHistory = true;
		 	
	}
	
	$scope.showAddProg2User = false;
	$scope.clkAddProg2User = function(){
		$scope.showAddProg2User = true;
		fnListRootProg();
	}

	$scope.showAddClass2User = false;
	$scope.clkAddClass2User = function(){

		$scope.showAddClass2User = true;
		fnListRootProg();
	}


	$scope.exportToExcel=function(tableId){ // ex: '#my-table'
        var exportHref=Excel.tableToExcel(tableId,'DS GV');
        $timeout(function(){location.href=exportHref;},100); // trigger download
    }
   
}]);