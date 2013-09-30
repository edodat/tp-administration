'use strict';

angular.module('app', ['ui.bootstrap', 'restangular'])
    .config(function($routeProvider, RestangularProvider) {
        // configure routes
        $routeProvider
            .when('/',  { templateUrl: 'partials/dashboard/', controller: 'DashboardCtrl' })
            .when('/companies',  { templateUrl: 'partials/companies/', controller: 'CompaniesCtrl' })
            .when('/servers',  { templateUrl: 'partials/servers/', controller: 'ServersCtrl' })
            .otherwise({ redirectTo: '/' });

        // Use Mongo "_id" instead of "id"
        RestangularProvider.setRestangularFields({
            id: '_id'
        });
    })
;