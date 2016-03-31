angular.module('listModule',[])
.controller('ListCtrl', ['$scope',"$rootScope","$firebaseArray","myService", function($scope,$rootScope,$firebaseArray,myService){
			$scope.userName ="Thanh Trieu";
			
		/*	$scope.renamedList = {
				listName: "AAA",
				ownerId: "AAA"
			};*/


			 //ADD LIST METHOD
          	$scope.addList = function() {
              //ADD TO FIREBASE
             var item = {listName: $scope.listName,
                 ownerId: $rootScope.loginUser.Email};
	             $rootScope.Lists.$add(item);
	             $('#btncloseModel').click();
	             $scope.listName = "";
	             
	             console.log("root userid",$rootScope.loginUser.$id );
		   	};

   			//GET SELECTED LIST
   			$scope.getListID = function(id){
          	$scope.selectedObj = $scope.lists.$getRecord(id);
          	$rootScope.renamedList = {
				listName: $scope.selectedObj.listName,
				ownerId: $scope.selectedObj.ownerId
			};
          	//GET TASK LIST
			var taskUrl = new Firebase("https://task-management-app.firebaseio.com/"+$rootScope.loginUser.$id+"/Tasks/"+$scope.selectedObj.$id);
			$scope.tasks = $firebaseArray(taskUrl);

			};


			 //REMOVE LIST METHOD
		   $scope.removeList = function(list){
		   		myService.removeList(list);
		   		$scope.selectedObj = {};
		   		$scope.tasks = [];
		   		$scope.selectedTask = $scope.tempTask;
		   };

		   //UPDATE SELECTED LIST
		   $scope.updateList = function(selectedlist, renamedlist){
		   		myService.updateList(selectedlist, renamedlist);
		   		$('#btncloseModelrenameList').click();
		   };

		   //SHOW TODAY DUE TASKS
		    $scope.showTodayDueTask = function(){
		   	$scope.selectedObj = {};
		   	$scope.tasks = $scope.todayTask;
		   	/*console.log('todayTask: ', $scope.todayTask);*/
		   	$scope.selectedObj.listName = "Today";
		   };

		   //SHOW REMINDED TASKS
		   $scope.showRemindedTasks =  function(){
		   		$scope.selectedObj = {};
		   		$scope.tasks = $scope.remindedList;
		   		$scope.selectedObj.listName = "Reminded Tasks";
		   };


		   //Sign Out Method
		   $scope.signOut = function(){
		   		$('#LoginModal').modal("show");
		   };

		   //Close Search Task
		   $scope.searchTask = "";
		   $scope.closeSearchTask = function(){
		   		$scope.searchTask = "";
		   };

		   //Show Search List
		   $scope.showSearchList = function(){
		   		$scope.tasks = $scope.countTask;
		   		$scope.selectedObj.listName = "Search Result";
		   };
}])

.directive('tasklist',function(){
	return {
		restrict: 'E',
		controller : "ListCtrl",
		scope:{
			userName : '=',
			listName : '=',
			remindedList: '=',
			todayTask: '=',
			selectedObj : '=',
			tasks : '=',
			totalTask: '=',
			dueTask: '=',
			countTask: '=',
			selectedTask: '=',
			tempTask: '=',
			loginUser: '=',
			lists: '=',
			searchTask: '='
		},
		templateUrl: 'app/html/listTask.html'

	};
})

