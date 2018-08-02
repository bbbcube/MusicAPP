'use strict';

var template = require('./homepage.html');
require('angular-ui-bootstrap');
angular
    .module('music.home', ['ui.bootstrap'])
    .config(config)
    .controller('HomeCtrl', HomeCtrl);

function config($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: template,
        controller: 'HomeCtrl',
        controllerAs: 'vm'
    });
}

function HomeCtrl(apiService, $location, filterFilter) {
    let vm = this;
    vm.searchstring = "";
    let searchgenre = "";
    if ('genre' in $location.search()){
        if ($location.search().genre !== "") {
            searchgenre = $location.search().genre;
        }
    }

    if (searchgenre) {
        apiService
        .get('recordsbygenre/' + searchgenre)
        .then(
            (resp) => {
                vm.records = resp.data;
            }
        );
    } else {
        apiService
        .get('records/')
        .then(
            (resp) => {
                vm.records = resp.data;
            }
        );
    }
    apiService
        .get('genres/')
        .then(
            (resp) => {
                vm.genres = resp.data;
                console.log(vm.genres);
            }
        )

    vm.addNewGenre = (index=undefined) => {
        let url = "genres";
        if(index >= 0) {
            url = url + '/' + vm.egenre._id.$oid;
        }
        let data = {
            genre_title: vm.egenre.genre_title
        };
        apiService
            .post(url, {data: data})
            .then(
                (resp) => {
                    if (resp.data.error === "ok") {
                        if (index >= 0) {
                            console.log(vm.egenre);
                            console.log(vm.genres[index]);
                            vm.genres[index] = vm.egenre;
                        } else {
                            data['_id'] = resp.data._id;
                            vm.genres.push(data);
                        }
                        $("#addgenre").modal('hide');
                        vm.egenre = {};
                    }
                }
            )
            .catch(
                (err) => {
                    console.log("System Error");
                }
            )
    };

    vm.editGenre = (index) => {
        vm.egenre = {};
        vm.index = index;
        if (typeof index !== 'undefined') {
            if (vm.genres.length >= index) {
                vm.egenre = angular.copy(vm.genres[index]);
                $("#addgenre").modal('show');
            }
        }
    };

    vm.onClickRate = ($event) => {
        vm.erecord['rating'] = $event.rating;
    };

    vm.addEditRecord = (index=undefined) => {
        let url = "records";
        if(index >= 0) {
            url = url + '/' + vm.erecord._id.$oid;
        }
        let data = {
            title: vm.erecord.title,
            genre: vm.erecord.genre,
            rating: vm.erecord.rating
        };
        apiService
            .post(url, {data: data})
            .then(
                (resp) => {
                    if (resp.data.error === "ok") {
                        if (index >= 0) {
                            vm.records[index] = vm.erecord;
                        } else {
                            data['_id'] = resp.data._id;
                            vm.records.push(data);
                        }
                        $("#addmusic").modal('hide');
                        vm.erecord = {};
                    }
                }
            )
            .catch(
                (err) => {
                    console.log("System Error");
                }
            )
    };

    vm.editRecord = (index) => {
        vm.erecord = {};
        vm.index = index;
        if (typeof index !== 'undefined') {
            if (vm.records.length >= index) {
                vm.erecord = angular.copy(vm.records[index]);
                $("#addmusic").modal('show');
            }
        }
    };
}
