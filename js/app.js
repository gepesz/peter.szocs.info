/* globals angular */

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

// App config
angular.module("app", ["ngMessages", "ngTouch", "ui.router", "ui.bootstrap", "satellizer", "firebase"])
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
    
    // Allow youtube content
    $sceDelegateProvider.resourceUrlWhitelist([
        "self",
        "https://www.youtube.com/**"
    ]);

    // Configure OAuth 2.0 providers
    // $authProvider.oauth2({
    //     name: "peter",
    //     url: "/",
    //     clientId: "9fb8bcfe24cbdb2f4786",
    //     authorizationEndpoint: "https://github.com/login/oauth/authorize",
    //     redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
    //     optionalUrlParams: ['scope'],
    //     scope: ['user,gist'],
    //     scopeDelimiter: ',',
    //     responseType: 'token',
    //     popupOptions: { width: 1020, height: 618 }
    // });

});


// Github OAuth2 using the satellizer:

// .run(function($rootScope, $injector, $auth) {
//     console.log("Angular run()");

//     $auth.authenticate("peter")
//         .then(function(data) {
//             console.log("inside");
//             console.log(data);
//         })
//         .catch(function(err) {
//             console.log("error");
//             console.log(err);
//         });
//     var token = $auth.getToken();
//     console.log("after");
//     console.log(token);

//     console.log("Angular run() - DONE");
// });


// Set OAuth tokens automatically if present:

// .run(function($rootScope, $injector) {

//     // Add OAuth tokens to headers automatically if present
//     // http://engineering.talis.com/articles/elegant-api-auth-angular-js/
//     $injector.get("$http").defaults.transformRequest = function(data, headersGetter) {
//         if ( $rootScope.oauth ) headersGetter().Authorization = "Bearer " + $rootScope.oauth.access_token;
//         if ( data ) {
//             return angular.toJson(data);
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