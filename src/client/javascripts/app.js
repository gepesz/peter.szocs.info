/* globals angular $ */

/**
 * app.js
 * 
 * Application code for http://peter.szocs.info
 * For details, see https://github.com/pitanyc/peter.szocs.info
 *
 * Code released under the Apache 2.0 license.
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Copyright 2015-2016, Peter Szocs.
 * http://peter.szocs.info
 */

// App config
angular
    .module("app", ["ngMessages", "ngTouch", "ui.router", "ui.bootstrap", "satellizer", "firebase"])
    .config(function($urlRouterProvider, $stateProvider, $locationProvider, $sceDelegateProvider, $authProvider) {
        // console.log("Angular config()");
        
        // Configure routes
        $urlRouterProvider.otherwise("/404.html");
        
        $stateProvider
        .state("home", {
            url: "/",
            views: {
                "nav": {
                    controller: "MainCtrl",
                    templateUrl: "partials/nav.html"
                },
                "header": {
                    controller: "MainCtrl",
                    templateUrl: "partials/header.html"
                },
                "about": {
                    controller: "MainCtrl",
                    templateUrl: "partials/about.html"
                },
                "portfolio": {
                    controller: "MainCtrl",
                    templateUrl: "partials/portfolio.html"
                },
                "music": {
                    controller: "MainCtrl",
                    templateUrl: "partials/music.html"
                },
                "contact": {
                    controller: "MainCtrl",
                    templateUrl: "partials/contact.html"
                },
                "footer": {
                    controller: "MainCtrl",
                    templateUrl: "partials/footer.html"
                }
            }
        });
    
        // Enable html5 mode
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix("!");
        
        // Allow content
        $sceDelegateProvider.resourceUrlWhitelist([
            "self",
            "https://www.youtube.com/**",
            "https://w.soundcloud.com/**"
        ]);
    });

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