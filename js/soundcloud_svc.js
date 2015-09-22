/* globals angular */

// GitHub service
angular.module("app")
.factory("SoundCloudSvc", function($q, $http) {
    
    // locals
    var apiUrl = "http://api.soundcloud.com/";
    var clientId = "88b2569d43a36435acfb8cc271516150";

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

    // Get playlist with given id
    function getPlaylist(playlistId) {
        return getData(apiUrl + "playlists/" + playlistId + "?client_id=" + clientId);
    }

    return {
        getPlaylist: getPlaylist
    };
});