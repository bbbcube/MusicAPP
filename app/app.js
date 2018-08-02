// angular application entry file
"use strict";

// Application level requirement
require('angular');
require('angular-ui-bootstrap');
require('angular-animate');
require('angular-route');
require('angular1-star-rating');

// require each application module
require('./components/api/apiservices.js');
require('./routes/home/home.js');

angular
    .module("musicapp", [
        "ngRoute",
        "ngAnimate",
        "ui.bootstrap",
        "star-rating",
        "music.api.services",
        "music.home",
    ])
    .config(config)
    .run(run);

function config($compileProvider, $locationProvider, $routeProvider) {

    $compileProvider.debugInfoEnabled(true);
    
    // Default to home page if we don't find the route requested
    $routeProvider.otherwise('/');

    // HTML 5 mode
    $locationProvider.html5Mode(true);
}

function run($rootScope, apiService, $location) {
    console.log('Application run()');

}