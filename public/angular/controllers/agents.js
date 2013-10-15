'use strict';

angular.module('app').controller('AgentsCtrl', function($scope, $modal, Restangular){
    $scope.Agents = Restangular.all('agents');
    $scope.Agents.getList().then(function(agents) {
        $scope.agents = agents;
    });

    $scope.shutdownAgent = function(agent){
        agent.shutdown();
    };

});
