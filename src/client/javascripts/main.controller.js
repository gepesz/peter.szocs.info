/* globals angular $ */

// Main controller
angular
    .module("app")
    .controller("MainCtrl", function($scope, $http, FirebaseSvc, IS_PROD) {
        // console.log("Inside MainCtrl()...");

        // Put data into scope
        $scope.achievements = FirebaseSvc.achievements;
        $scope.repos = FirebaseSvc.repos;
        $scope.songs = FirebaseSvc.songs;
        $scope.soundclouds = FirebaseSvc.soundclouds;

        // Show the selected repo via modal
        $scope.showRepo = function(repo) {
            $scope.selectedRepo = repo;
            $("#portfolioModal").modal("show");
        };

        // Send email
        $scope.sendEmail = function(formData) {
            // console.log(formData);
    
            $http({ method  : "POST",
                    url     : "/mail",
    	            data    : $.param(formData),
    	            headers : { "Content-Type": "application/x-www-form-urlencoded" }
    	    }).success(function(data) {
                // console.log(data);
                
                if ( !data.success ) {
                    // error
                    var firstName = formData.name;
                    if ( firstName.indexOf(" ") >= 0 ) {    // check for white space
                        firstName = firstName.split(" ").slice(0, -1).join(" ");
                    }
                    $scope.contactFormModalTitle = "Oops ...";
                    $scope.contactFormModalBody  = "Sorry " + firstName + 
                        ", it seems that my mail server is not responding.  Please try again later!";
                } else {
                    // success
                    $scope.contactFormModalTitle = "Success";
                    $scope.contactFormModalBody  = "Your message has been sent.";
                }
                
                // clear form
                $scope.contactForm.$setPristine();
                $scope.contactForm.$setUntouched();
                $scope.formData = {};
                
                // show modal
                $("#contactFormModal").modal("show");
            });
        };
        
        // Current timestamp
        $scope.now = new Date();
        
        // Environment
        $scope.isProd = IS_PROD;
    });