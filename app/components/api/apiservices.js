/* api.js
 *
 * These are the primary API helper methods:
 *   - apiService.get()
 *   - apiService.post()
 *
 * apiService.get( <url>, [<params>] )
 *   Make an API GET request.
 *   Returns a promise identicial to $http
 *
 *   <url> Should be a string or an object
 *   <params> May be an object of key/value pairs to use as a URL query string
 *
 *   If an object is passed as <url>, it should include at least the "url" key.
 *   Other key/value pairs may be passed, whatever you wish to pass to the
 *   $http request.  Any missing keys, such as 'headers', will be automatically
 *   inserted with default values.
 *
 * apiService.post( <url>, <data> )
 *   Make an API POST request.
 *   Returns a promise identicial to $http
 *
 *   <url> Should be a string or an object
 *   <data> An object of key/value pairs to post
 *
 *   If an object is passed as <url>, it should include at least the "url" key.
 *   Other key/value pairs may be passed, whatever you wish to pass to the $http
 *   request.  Any missing keys, such as 'headers', will be automatically
 *   inserted with default values.
 */

'use strict';


angular
    .module('music.api.services', [])
    .factory('apiService', apiService);

function apiService($q, $location, $http) {

    var endpoint = '';
    var api = {};

    api.get = get;
    api.post = post;
    api.delete = deleteRequest;

    return api;

    // API GET Request
    function get(url, params) {

        // Default headers
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': api.authstring
        };

        // If we are passed a string in "url" we treat this as a simple
        // API get call with default settings. If url is not a string, it
        // should be an object containing our settings.
        var req = {
            method: 'GET',
            cache: false,
            headers: headers,
            params: params
        };

        return request(url, req);
    }

    // API POST Request
    function post(url, data) {

        // Default headers
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': api.authstring
        };

        // If we are passed a string in "url" we treat this as a simple
        // API get call with default settings. If url is not a string, it
        // should be an object containing our settings.
        var req = {
            method: 'POST',
            cache: false,
            headers: headers,
            data: data
        };

        return request(url, req);
    }

    // API DELETE Request
    function deleteRequest(url, data) {

        // Default headers
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': api.authstring
        };

        // If we are passed a string in "url" we treat this as a simple
        // API get call with default settings. If url is not a string, it
        // should be an object containing our settings.
        var req = {
            method: 'DELETE',
            cache: false,
            headers: headers,
            data: data
        };

        return request(url, req);
    }

    // API Request
    function request(url, req) {
        if (typeof url !== 'string') {
            // Merge passed parameters with defaults
            for (var attrname in url) {
                if (url.hasOwnProperty(attrname)) {
                    req[attrname] = url[attrname];
                }
            }
            // Auth header if it's missing
            if (!req.headers.hasOwnProperty('Authorization')) {
                req.headers.Authorization = api.authstring;
            }
            // Fix up URL
            req.url = '/' + req.url;

        } else {
            // Set a simple url endpoint
            req.url = '/' + url;
        }

        // Grab the endpoint and call it
        return getEndpoint().then(function (endpoint) {
            req.url = endpoint + req.url;
            return $http(req);
        });
    }

    // Determine the correct API endpoint to use
    function getEndpoint() {

        return $q(function (resolve, reject) {
            // Adjust API location based on server host
            if ($location.host() == STAGING_HOST) {
                endpoint = STAGING_API;
                resolve(STAGING_API);
            } else if ($location.host() == 'localhost') {
                // If we have already done this check, return
                // the previous result
                if (endpoint != '') {
                    resolve(endpoint);
                    return;
                }
                // Check if we can connect to a local API server
                var req = {
                    method: 'GET',
                    cache: false,
                    url: LOCAL_API + '/ping',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                };
                $http(req).then(
                    function (resp) {
                        // Yes, so use it
                        endpoint = LOCAL_API;
                        resolve(LOCAL_API);
                    },
                    function (resp) {
                        // No local API server, go with staging server
                        endpoint = STAGING_API;
                        resolve(STAGING_API);
                    }
                );
            }
        });
    }

}