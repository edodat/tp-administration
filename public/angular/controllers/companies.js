'use strict';

angular.module('app').controller('CompaniesCtrl', function($scope, $modal, Restangular){
    $scope.Companies = Restangular.all('companies');
    $scope.Companies.getList().then(function(companies) {
        $scope.companies = companies;
    });

    $scope.registerCompany = function(){
        $modal.open({
            templateUrl: 'register.html',
            controller: 'RegisterCompanyCtrl'
        }).result.then(function (company) {
            // create new one
            $scope.Companies.post(company).then(function(company){
                $scope.companies.push(company);
            });
        });
    };

    $scope.editCompany = function(company){
        $modal.open({
            templateUrl: 'register.html',
            controller: 'EditCompanyCtrl',
            resolve: {
                company: function () {
                    return Restangular.copy(company);
                }
            }
        }).result.then(function (company) {
            // update existing one
            company.put().then(function(){
                $scope.companies[_.findIndex($scope.companies, { '_id': company._id })] = company;
            });
        });
    };

    $scope.disableCompany = function(company){
        company.remove().then(function(){
            company.disabled = true;
        });
    };

});

angular.module('app').controller('RegisterCompanyCtrl', function ($scope, $modalInstance) {
    $scope.company = {};
    $scope.save = function () {
        $modalInstance.close($scope.company);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

angular.module('app').controller('EditCompanyCtrl', function ($scope, $modalInstance, company) {
    $scope.company = company;
    $scope.editionMode=true;

    $scope.save = function () {
        $modalInstance.close($scope.company);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
