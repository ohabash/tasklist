'use strict';
var path = require('path');
// import {$,jQuery} from './../bower/jquery/dist/jquery.min.js';



import './../bower/angular/angular.min.js';
// import Dropzone from './../bower/dropzone/dist/min/dropzone-amd-module.min.js';
import './../bower/angularfire/dist/angularfire.min.js';
import './../bower/angular-route/angular-route.min.js';
import './../bower/angular-animate/angular-animate.min.js';
import './../bower/angular-xeditable/dist/js/xeditable.js';
import './../bower/slick-carousel/slick/slick.min.js';
import './../bower/slick-carousel/slick/slick.min.js';
import './../bower/angular-toArrayFilter/toArrayFilter.js';
import './../bower/angular-counter/js/angular-counter.js';
// import './../bower/angular-ui-sortable/sortable.js';
// import './../bower/angular-slick-carousel/dist/angular-slick.js';

// Dropzone.autoDiscover = false;

function here(d) {
	if (!d){ return __dirname; }
	return path.resolve(__dirname, d);
}


window.app = angular.module('appName',["ngRoute", 'counter', "firebase", 'xeditable', 'angular-toArrayFilter']);

// check "$requireSignIn" when changing routes
// https://github.com/firebase/angularfire/blob/master/docs/guide/user-auth.md#ngroute-example
app.run(["$rootScope", "$location", function($rootScope, $location) {
	// console.log($location.$$path);
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    if (error === "AUTH_REQUIRED") {
      $location.path("/login");
      $rootScope.notice("Please Login to Chat with Omar", "red-bg white bold")
      console.log('AUTH_REQUIRED')
    }
  });
}]);


// editableOptions
app.run(['editableOptions', function(editableOptions) {
  // editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
  editableOptions.buttons="no"
  editableOptions.isDisabled=true;
}]);


// routes
app.config(function ($routeProvider, $locationProvider){
	$routeProvider
		.when('/', {
			controller: 'lists',
			templateUrl: 'partials/views/lists.html',
			activeClass: 'lists'
		})
		.when('/lists/:p', {
			controller: 'list-single',
			templateUrl: 'partials/views/list-single.html',
			activeClass: 'lists',
			activetab: 'lists'
		})
		.when('/home-m', {
			controller: 'home-m',
			templateUrl: 'partials/views/home-m.html',
			activeClass: 'home-m'
		})
		.when('/skills', {
			controller: 'skills',
			templateUrl: 'partials/views/skills.html',
			activeClass: 'skills'
		})
		.when('/settings', {
			controller: 'settings',
			templateUrl: 'partials/views/settings.html',
			activeClass: 'settings'
		})
		.when('/login', {
			controller: 'auth',
			templateUrl: 'partials/views/auth.html',
			activeClass: 'auth'
		})
		.when('/chat', {
			controller: 'chat',
			templateUrl: 'partials/views/chat.html',
			activeClass: 'chat',
			resolve: {
				"currentAuth": ["Auth", function(Auth) {return Auth.$requireSignIn(); }]
			}
		})
		.when('/master-chat', {
			controller: 'chat',
			templateUrl: 'partials/views/master-chat.html',
			activeClass: 'master-chat',
			activetab: 'master-chat',
			resolve: {
				"currentAuth": ["Auth", function(Auth) {return Auth.$requireSignIn(); }]
			}
		})
		.when('/faq', {
			controller: 'faq',
			templateUrl: 'partials/views/faq.html',
			activeClass: 'faq'
		})
		.otherwise({
			templateUrl:'partials/views/404.html'
		});	
		$locationProvider.html5Mode(true);
});


// reverse in ng-repeat
app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});


// auth
app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);


require('./ng-controller.js');