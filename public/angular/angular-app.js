'use strict';

angular.module('app', ['ui.bootstrap', 'restangular'])
    .config(function($routeProvider, RestangularProvider) {
        // configure routes
        $routeProvider
            .when('/',  { templateUrl: 'partials/dashboard/', controller: 'DashboardCtrl' })
            .when('/companies',  { templateUrl: 'partials/companies/', controller: 'CompaniesCtrl' })
            .when('/agents',  { templateUrl: 'partials/agents/', controller: 'AgentsCtrl' })
            .otherwise({ redirectTo: '/' });

        // Use Mongo "_id" instead of "id"
        RestangularProvider.setRestangularFields({
            id: '_id'
        });

        RestangularProvider.extendModel('agents', function(agent) {
            agent.addRestangularMethod('shutdown', 'post', 'shutdown');
            return agent;
        });

        RestangularProvider.extendModel('companies', function(company) {
            company.addRestangularMethod('bind', 'post', 'bind');
            company.addRestangularMethod('run', 'post', 'run');
            company.addRestangularMethod('standby', 'post', 'standby');
            return company;
        });
    })
;