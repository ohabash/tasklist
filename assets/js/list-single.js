app.controller('list-single', function ($scope, $routeParams, $route, $rootScope, $location, $timeout, $firebaseObject, $firebaseArray) {
	
	// routeParams
	$scope.p = $routeParams.p;

	// departments
	var ref = firebase.database().ref().child('departments');
	$scope.departments_obj = $firebaseObject(ref);
	$rootScope.departments = $firebaseArray(ref);

});