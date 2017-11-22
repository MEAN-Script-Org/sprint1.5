
angular.module('SWEApp').controller('UserAccounts', ['$rootScope', '$scope', '$location', 'Factory',
  function($rootScope, $scope, $location, Factory) {

      $scope.init = function() {
        $scope.visible = "visible";
        $scope.accountInfo = [] ;
      }
      
      $scope.username = 'usernameJohn';
      $scope.name = 'John Smith';
      $scope.dob = '1-1-1991';
      $scope.email = 'johnsmith@nothing.com';
      $scope.dl = 'A123456789';
      
      
      var accountInfo = {
        username : 'usernameJohn', name : 'John Smith', dob : '1-1-1991', 
        email : 'johnsmith@nothing.com', dl : '123456789',
      };

      // var accountInformationSchema {
      //   username: {
      //     type: String,
      //     unique: true,
      //     required: true
      //   },

      //   name: {
      //     type: String,
      //     required: true
      //   }

      //   dob: {
      //     type: Number,
      //     // required: true
      //   },

      //   email: {
      //     type: String,
      //   },

      //   dl: {
      //     type: String,
      //     // required: true
      //   },
      // }
      
      $scope.currentUser = function() {

      }
    }
]);