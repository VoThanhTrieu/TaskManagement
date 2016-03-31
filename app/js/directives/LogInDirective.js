angular.module('LogInModule',[])
.controller('LogInCtrl',["$scope","$rootScope","$firebaseArray","$firebaseObject","myService",
	function($scope,$rootScope,$firebaseArray,$firebaseObject,myService){
	$scope.userStatus = "";


	/*$scope.loginUser = {};*/
	$scope.addNewUser = function(m_user){
		if (m_user.Email == null || m_user.Password == null){
			$scope.userStatus = "Please full fill the fields!";
		}
		else{
			var userUrl = new Firebase("https://task-management-app.firebaseio.com/Users");
			var userList = $firebaseArray(userUrl);
			var check = 0;
			userList.$loaded(function(){
					angular.forEach(userList,function(u){
						if(u.Email == m_user.Email){
							check =+ 1;
						}
					});
					if(check > 0){
							$scope.userStatus =  m_user.Email + " has been existed!"
						}
						else{
							userList.$add(m_user).then(function(){
								$scope.userStatus =  m_user.Email + "has been signed up successfully!";
							});
						}
			});
		};
	};

			 //Login Method
		   $scope.Login = function(m_user){
			   	if (m_user.Email == null || m_user.Password == null){
					$scope.userStatus = "Please full fill the fields!";
				}
				else
				{
						var userUrl = new Firebase("https://task-management-app.firebaseio.com/Users");
						var userList = $firebaseObject(userUrl);
						var check = 0;
						userList.$loaded(function(){
								angular.forEach(userList,function(value, key){
									if(value.Email == m_user.Email && value.Password == m_user.Password){
										check =+ 1;
										$rootScope.loginUser = {
											$id: key,
											Email: value.Email,
											Password: value.Password
										};
										var listUrl = new Firebase("https://task-management-app.firebaseio.com/"+key+"/Lists");
							          	// GET List AS AN ARRAY
							          	$rootScope.Lists = $firebaseArray(listUrl);
							          	$rootScope.LoadTasks();
							    		$('#LoginModal').modal("hide");
									}
								});
								if (check == 0) {
									$scope.userStatus = "Email or Password is incorrect!";
								};
						});

				};
			};

}])
.directive('login',function(){
	return{
		restrict: 'E',
		controller: "LogInCtrl",
		scope: {
			loginUser: '=',
			lists: '='
		},
		templateUrl: 'app/html/LogInModal.html'
	};
});