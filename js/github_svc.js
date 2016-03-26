/* globals angular */

// GitHub service
angular.module("app")
.factory("GitHubSvc", function($q, $http) {
    
    // locals
    var apiUrl = "https://api.github.com/";
    var userName = "pitanyc";

    // Returns data from the given url
    function getData(url) {
        var dfd = $q.defer();
        $http.get(url)
            .then(function(response) {
                dfd.resolve(response.data);
            })
            .catch(function(err) {
                dfd.reject(err);
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