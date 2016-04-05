/* globals angular */

// GitHub controller
angular.module("app")
.controller("GitHubCtrl", function($scope, $http, GitHubSvc, IS_PROD) {
    
    // Get the repos
    $scope.repos = [];
    if ( IS_PROD ) {    // Prod
        GitHubSvc.getReleases().then(function(repos) {
            $scope.repos = repos;
        });
    } else {            // Dev
        $scope.repos = [{
            name: "chat",
            description: "Short description of the repo",
            html_url: "https://github.com/pitanyc/chat",
            homepage: "http://cairo.peterszocs.com",
            screenshot: "https://cloud.githubusercontent.com/assets/12737838/9482758/7ba4804a-4b65-11e5-81cf-ee29039efc39.png",
            body: "This is the detailed description of the repository.",
            date: "2015-08-15",
            licenseName: "Apache License 2.0",
            licenseUrl: "https://api.github.com/licenses/apache-2.0"
        }];
    }

    // Show the selected repo via modal
    $scope.showRepo = function(repo) {
        $scope.selectedRepo = repo;
        $("#portfolioModal").modal("show");
    };
});