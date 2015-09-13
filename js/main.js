/**
 * main.js
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

/* globals angular Firebase */
var app = angular.module("app", ["ngMessages", "ui.router", "firebase"])
.constant("FIREBASE_URL", "https://peter-szocs-info.firebaseio.com/");

// App config
app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $sceDelegateProvider) {
    
    // Configure routes
    $urlRouterProvider.otherwise("/404.html");
    
    $stateProvider
    .state("home", {
        url: "/",
        views: {
            "about": {
                controller: "MainCtrl",
                templateUrl: "partials/about.html"
            },
            "portfolio": {
                controller: "GitHubCtrl",
                templateUrl: "partials/portfolio.html"
            },
            "music": {
                controller: "MainCtrl",
                templateUrl: "partials/music.html"
            },
            "contact": {
                controller: "MainCtrl",
                templateUrl: "partials/contact.html"
            }
        }
    });

    // Enable html5 mode
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix("!");
    
    // Allow youtube content
    $sceDelegateProvider.resourceUrlWhitelist([
        "self",
        "https://www.youtube.com/**"
    ]);

});

// Main controller
app.controller("MainCtrl", function($scope, $http, $firebaseArray, FIREBASE_URL) {

    // Achievements
    var achievementsRef = new Firebase(FIREBASE_URL + "/achievements");
    $scope.achievements = $firebaseArray(achievementsRef);
    
    // Songs
    var songsRef = new Firebase(FIREBASE_URL + "/songs");
    $scope.songs = $firebaseArray(songsRef);

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

});

// GitHub controller
app.controller("GitHubCtrl", function($scope, $http, GitHubSvc) {
    
    // $scope.repos = [{
    //     name: "chat",
    //     description: "Short description of the repo",
    //     html_url: "https://github.com/gepesz/chat",
    //     homepage: "http://cairo.peterszocs.com",
    //     screenshot: "https://cloud.githubusercontent.com/assets/12737838/9482758/7ba4804a-4b65-11e5-81cf-ee29039efc39.png",
    //     body: "This is the detailed description of the repository.",
    //     date: "2015-08-15",
    //     licenseName: "Apache License 2.0",
    //     licenseUrl: "https://api.github.com/licenses/apache-2.0"
    // }];
    
    // Get repos
    GitHubSvc.getReleases().then(function(repos) {
        $scope.repos = repos;
    });
    
    // Show repo
    $scope.showRepo = function(repo) {
        $scope.selectedRepo = repo;
        $("#portfolioModal").modal("show");
    };
});

// GitHub service
app.factory("GitHubSvc", function($q, $http) {
    
    // GitHub locals
    var apiUrl = "https://api.github.com/";
    var userName = "gepesz";

    // Returns GitHub data from the given url
    function getData(url) {
        var dfd = $q.defer();
        $http.get(url)
            .then(function(response) {
                dfd.resolve(response.data);
            });
        return dfd.promise;
    }

    // Get all releases of a repo with given name
    function getRepoReleases(repoName) {
        return getData(apiUrl + "repos/" + userName + "/" + repoName + "/releases");
    }

    // Get the license of a repo with given name
    function getRepoLicense(repoName) {
        return getData(apiUrl + "repos/" + userName + "/" + repoName + "/license");
    }
    
    // Get repo with given name
    function getRepo(repoName) {
        return getData(apiUrl + "repos/" + userName + "/" + repoName);
    }

    // Get all repos
    function getRepos() {
        return getData(apiUrl + "users/" + userName + "/repos");
    }

    // Get all releases
    function getReleases() {
        var dfd = $q.defer();
        var arr = [];
        getRepos().then(function(repos) {
            repos.map(function(repo) {
                if ( repo.homepage ) {
                    // showcase this repo
                    getRepoReleases(repo.name)
                        // 1) repo release
                        .then(function(releases) {
                            releases.map(function(release) {
                                
                                // screenshot
                                var index = release.body.indexOf("(https") + 1;
                                var screenshot = release.body.substring(index);
                                index = screenshot.indexOf(".png)") + 4;
                                screenshot = screenshot.substring(0, index);
                                
                                // body
                                index = release.body.indexOf("\r\n") + 2;
                                var body = release.body.substring(index);
    
                                // package it up                            
                                arr.push({
                                    name: repo.name,
                                    description: repo.description,
                                    html_url: repo.html_url,
                                    homepage: repo.homepage,
                                    screenshot: screenshot,
                                    body: body,
                                    date: release.created_at.slice(0, 10)
                                });
                            });
                        })
                        // 2) repo license
                        .then(getRepoLicense(repo.name)
                            .then(function(license) {
                                arr[arr.length - 1].licenseName = license.license.name;
                                arr[arr.length - 1].licenseUrl = license.license.url;
                                // console.log(arr[arr.length - 1]);
                                dfd.resolve(arr);
                            })
                        );
                }
            });
        });
        return dfd.promise;
    }
    
    return {
        getRepoReleases: getRepoReleases,
        getRepoLicense: getRepoLicense,
        getRepo: getRepo,
        getRepos: getRepos,
        getReleases: getReleases
    };
});

// Animated scrolling directive
// app.directive("scrollOnClick", function() {
//     return {
//         restrict: "A",
//         link: function(scope, $elm, attrs) {
//             $elm.on("click", function() {
//                 var expanded = ($(".navbar-collapse").attr("aria-expanded") === "true");
//                 if ( expanded ) {
//                     $(".navbar-toggle:visible").click();
//                 }
//                 var $target = $(attrs.href);
//                 $("html, body").animate({
//                     scrollTop: $target.offset().top
//                 }, 1000, "easeInOutExpo");
//             });
//         }
//     };
// });

// jQuery
$(function() {

    // Close the responsive menu on item click
    $(".navbar-collapse ul li a").click(function() {
        $(".navbar-toggle:visible").click();
    });
    
    // Page scrolling feature (requires jQuery easing plugin)
    $("a.page-scroll").bind("click", function(event) {
        var $anchor = $(this);
        $("html, body").stop().animate({
            scrollTop: $($anchor.attr("href")).offset().top
        }, 1000, "easeInOutExpo");
        event.preventDefault();
    });

});
