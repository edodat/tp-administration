'use strict';

angular.module('app').controller('ServersCtrl', function($scope, $modal, Restangular){
    $scope.Servers = Restangular.all('servers');
    $scope.Servers.getList().then(function(servers) {
        $scope.servers = servers;
    });

    function openModal(server) {
        $modal.open({
            templateUrl: 'editServer.html',
            controller: 'EditServerCtrl',
            resolve: {
                server: function () {
                    return server ? Restangular.copy(server) : {};
                }
            }
        }).result.then(function (server) {
            if (server._id){
                // update existing one
                server.put().then(function(){
                    $scope.servers[_.findIndex($scope.servers, { '_id': server._id })] = server;
                });
            } else {
                // create new one
                $scope.Servers.post(server).then(function(server){
                    $scope.servers.push(server);
                });
            }
        });
    }

    $scope.addServer = function(){
        openModal();
    };

    $scope.editServer = function(server){
        openModal(server);
    };

    $scope.removeServer = function(server){
        server.remove().then(function(){
            _.remove($scope.servers, { '_id': server._id });
        });
    };

});

angular.module('app').controller('EditServerCtrl', function ($scope, $modalInstance, server) {
    $scope.server = server;
    $scope.save = function () {
        $modalInstance.close($scope.server);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
