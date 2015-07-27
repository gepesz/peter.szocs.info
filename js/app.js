/**
 * app.js
 * 
 * Application code for http://peter.szocs.info
 * For details, see https://github.com/gepesz/peter.szocs.info
 *
 * Code released under the Apache 2.0 license.
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Copyright 2015, Peter Szocs.
 * http://peter.szocs.info
 */

/* globals angular */
var app = angular.module("app", ["ngMessages"]);
app.controller("MainController", function($scope, $http) {

    // Achievements
    $scope.achievements = [
        { when: "1998 - 2002",    imgUrl: "upenn.jpg",     imgAlt: "College",   title: "Humble Beginnings", text: "Attended college at the University of Pennsylvania in Philadelphia.  Finished with triple Bachelor of Science degrees in Finance (Wharton), Computer Science (Engineering) and Mathematics (College)." },
        { when: "September 2006", imgUrl: "bloomberg.jpg", imgAlt: "Bloomberg", title: "Joining Bloomberg", text: "After a short gig at a web startup in Washington DC, I joined Bloomberg LP as a Financial Software Developer.  This is where I currently work, as a Senior Technical Lead in Equity Derivatives." },
        { when: "May 2010",       imgUrl: "nyu.jpg",       imgAlt: "NYU",       title: "Masters from NYU",  text: "While working at Bloomberg I attended NYU's Courant Institute, earning a Master of Science degree in Financial Mathematics.  This program is the de facto #1 quant school in America." },
        { when: "2011 - 2015",    imgUrl: "soccer.jpg",    imgAlt: "Soccer",    title: "Soccer",            text: "One of my biggest passions in life is soccer.  Not only do I captain and coach teams in New York City, but also have won several cups while making lifetime lasting friendships." }
    ];

    // Songs
    $scope.songs = [
        { src: "http://www.youtube.com/embed/ceCGIk6tAxY", artist: "Navino",                        title: "Chillin' Time" },
        { src: "http://www.youtube.com/embed/F7Gl-IQY9rw", artist: "Nayo",                          title: "African Girl" },
        { src: "http://www.youtube.com/embed/HNN-lCCYYNo", artist: "Bonde da Stronda ft. Mr Catra", title: "Mansão Thug Stronda"},

        { src: "http://www.youtube.com/embed/XyWED2RD3XY", artist: "Erick Morillo",                 title: "Live Your Life" },
        { src: "http://www.youtube.com/embed/jIVqsZxRPEA", artist: "Fergie",                        title: "Hold On (Rockit Edit)" },
        { src: "http://www.youtube.com/embed/KKDKAAFL_9E", artist: "R.A.W. ft. Amanda Wilson",      title: "Intoxicated" }
    ];

    // Send email
    $scope.sendEmail = function(formData) {
        console.log(formData);

        $http({ method  : "POST",
                url     : "contact.php",
	            data    : $.param(formData),
	            headers : { "Content-Type": "application/x-www-form-urlencoded" }
	    }).success(function(data) {
            console.log(data);
            
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

});