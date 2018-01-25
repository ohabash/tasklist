

app.controller('auth', function ($scope, $timeout, $location, $rootScope, Auth, $firebaseObject, $firebaseArray) {
  

  $rootScope.inside=true;
  // $scope.get_active();

  
  //signIn (email)
    $scope.signIn = function() {
      // login with google
      $scope.u = null;
      $scope.error = null;

      Auth.$signInWithEmailAndPassword($scope.email, $scope.password).then(function(firebaseUser) {
          $scope.u = firebaseUser;
          $scope.uid = firebaseUser.uid;
          $rootScope.notice("Welcome "+$scope.u.email, "Session Started. Enjoy.");
          $location.path('/');
          // console.log($scope.u)
        }).catch(function(error) {
          $scope.error = error;
          console.log(error);
          $rootScope.notice("<h1>"+error.code+"</h1>"+error.message);

          $rootScope.notice("Would you like to <a id='creater'>Register a new Account</a> with these credentials?", "hide");
          $timeout( function(){
            $('.item1.hide').removeClass('hide');
            $('#creater').click( function(){
                console.log('creating...')
                if($scope.email.indexOf('successpartners.com') != -1){
                  Auth.$createUserWithEmailAndPassword($scope.email, $scope.password).then(function(firebaseUser) {
                    $rootScope.notice("<h1>Account Created</h1> Welcome "+firebaseUser.email);
                  }).catch(function(error) {
                    $rootScope.notice("<h1>"+error.code+"</h1>"+error.message);
                  });
                }else{
                  $rootScope.notice("only successpartners.com allowed");
                }
              });
          },3000);
          //   $('#creater').click( function(){
          //     console.log('creating...')
          //     Auth.$createUserWithEmailAndPassword($scope.email, $scope.password).then(function(firebaseUser) {
          //       $rootScope.notice("<h1>Account Created</h1> Welcome "+firebaseUser.email);
          //     }).catch(function(error) {
          //       $rootScope.notice("<h1>"+error.code+"</h1>"+error.message);
          //     });
          //   })


        });
    };
    






    $scope.addProfile = function(data) {
      $timeout(function() {
        console.log('making profile for '+data.displayName+"("+data.uid+")")
        $rootScope.profile['displayName'] = data.displayName;
        $rootScope.profile['email'] = data.email;
        $rootScope.profile['phoneNumber'] = data.phoneNumber;
        $rootScope.profile['photoURL'] = data.photoURL;
        $rootScope.profile['metadata'] = data.metadata;
        $rootScope.profile['uid'] = data.uid;
        $rootScope.profile['convo_id'] = "convos-"+data.uid;
        $rootScope.profile.$save().then(function () {
            // console.log('after save: ',$rootScope.profile);
        });
      }, 500);
    };



    $scope.signIn_g = function() {
      // login with google
      $scope.u = null;
      $scope.error = null;

      Auth.$signInWithPopup("google").then(function(firebaseUser) {
          console.log('firebaseUser:',firebaseUser.user)
          // $location.path('/');
          $scope.addProfile(firebaseUser.user);
          // $rootScope.profiles.$add(firebaseUser.user)
        }).catch(function(error) {
          $scope.error = error;
          $rootScope.notice("<h1>"+error.code+"</h1>"+error.message, 'red-bg white');
        });
    };






});
























