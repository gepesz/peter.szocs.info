/* globals angular Firebase */

// Firebase data service
angular
    .module("app")
    .factory("FirebaseSvc", function($q, $http, $firebaseArray, FIREBASE_URL, IS_PROD) {
        // console.log("Inside FirebaseSvc()...");
    
        var achievements = [];
        var repos = [];
        var songs = [];
        var soundclouds = [];
        if ( IS_PROD ) {
            achievements = $firebaseArray(new Firebase(FIREBASE_URL + "/achievements"));
            repos = $firebaseArray(new Firebase(FIREBASE_URL + "/repos"));
            songs = $firebaseArray(new Firebase(FIREBASE_URL + "/songs"));
            soundclouds = $firebaseArray(new Firebase(FIREBASE_URL + "/soundclouds"));
        }

        return {
            achievements: achievements,
            repos: repos,
            songs: songs,
            soundclouds: soundclouds
        };
    });