'use strict';

angular.module('app').controller('SidebarCtrl', function($scope, $location){
    $scope.links = [
        { name: 'Administration', header: true, href: '#/', active: true },
        { name: 'Companies', href: '#/companies' },
        { name: 'Agents', href: '#/agents' }
    ];

    $scope.$on('$routeChangeSuccess', function () {
        angular.forEach($scope.links, function(link) {
            link.active = ('#'+$location.path() == link.href);
        });
    });
});
