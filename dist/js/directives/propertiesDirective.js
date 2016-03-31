angular.module("propertiesModule",[])

.controller('PropertiesCtrl', ['$scope','myService', function($scope,myService){

	//get new selected Task when user select a new one 
	 $scope.$watch("selectedTask", function(newVal) {
		 	$scope.selectedTask = newVal;
          });

			//REMOVE TASK METHOD
		   	$scope.removeTask = function(x){
		   		if(x.$id === undefined){

		   		}else{
		   			myService.removeTask(x);
		   			$scope.selectedTask = $scope.tempTask;
		   		}

		   	};
		
		//UPDATE TASK METHOD
	      	$scope.updateTask = function(item){
	      		if(item.ListId != ""){
	      			myService.updateTask(item);
	      		}
		   	};

}])
.directive('taskproperties',function(){
	return {
		restrict: 'E',
		controller : "PropertiesCtrl",
		scope:{
			selectedTask : '=',
			userName : '=',
			tasks : '=',
			tempTask: '='
		},
		templateUrl: 'app/html/TaskProperties.html'
	};
});