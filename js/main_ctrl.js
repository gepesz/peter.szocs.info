/* globals angular Firebase */

// Main controller
angular.module("app")
.controller("MainCtrl", function($scope, $http, $firebaseArray, FIREBASE_URL, IS_PROD) {

    // Achievements
    $scope.achievements = [];
    if ( IS_PROD ) {    // Prod
        var achievementsRef = new Firebase(FIREBASE_URL + "/achievements");
        $scope.achievements = $firebaseArray(achievementsRef);
    }

    // Songs
    $scope.songs = [];
    if ( IS_PROD ) {    // Prod
        var songsRef = new Firebase(FIREBASE_URL + "/songs");
        $scope.songs = $firebaseArray(songsRef);
    }

    // Send email
    $scope.sendEmail = function(formData) {
        // console.log(formData);

        $http({ method  : "POST",
                url     : "/mail/contact.php",
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
                $scope.contactFormModalBody  = "Sorry " + firstName + ", it seems that my mail server is not responding.  Please try again later!";
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
    
    // Environment
    $scope.isProd = IS_PROD;

});