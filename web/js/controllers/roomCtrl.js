'use strict';
function roomCtrl(Auth, $scope, $location, $rootScope, $abi, $contract) {
    $rootScope.processing = false;
    $scope.me = {};
    $scope.data = {};
    $scope.message = {};
    $scope.voxData = {};
    $scope.isDoctor = true;
    $scope.dataset = [];

    $scope.genders = ('МУЖСКОЙ ЖЕНСКИЙ')
        .split(' ')
        .map(function (gender) {
            return { name: gender };
        });

    $rootScope.vox.addEventListener(VoxImplant.Events.AuthResult, handleAuthResult);

    $scope.initMe = function () {
        $rootScope.processing = true;
        Auth.me()
            .then(function (r) {
                $rootScope.processing = false;
                $scope.me = r.account;

                if ($scope.me.role === 'user') { $scope.isDoctor = false; }

                $scope.data.firstname = $scope.me.firstname;
                $scope.data.surname = $scope.me.surname;
                $scope.data.id = $scope.me.id;

                $scope.voxData.appUser = $scope.me.voxName;
                $scope.voxData.appUserPassword = 'j2GjTHJat';
                $scope.voxData.appName = 'dhc-chat';
                $scope.voxData.account = 'argunov';
                $scope.voxData.URI = $scope.voxData.appUser + '@' + $scope.voxData.appName + '.' + $scope.voxData.account + '.voximplant.com';

                $rootScope.vox.login($scope.voxData.URI, $scope.voxData.appUserPassword)
                    .then(function (rr) {
                        $rootScope.voxAuthData = rr;
                    }, function (e) {
                        console.log(e);
                    });

                if ($scope.isDoctor) {
                    var contr = makeContract();
                    var count = contr.getVisitHistoryLength.call($scope.me.address).toNumber();

                    for (var i = 0; i < count; i++) {
                        var id = contr.getVisitId.call($scope.me.address, i).toNumber();
                        var anem = contr.getVisitAnamnesis.call($scope.me.address, i);
                        var diag = contr.getVisitDiagnosis.call($scope.me.address, i);
                        var pat = contr.getVisitPatient.call($scope.me.address, i);

                        $scope.dataset.push({
                            id: id,
                            anam: anem,
                            diag: diag,
                            pat: pat
                        });
                    }
                    console.log($scope.dataset);
                }
            }, function (e) {
                $rootScope.processing = false;
                $rootScope.$broadcast('alert', e.message);
                $location.path('/');
            });
    };

    function handleAuthResult(ev) {
        if (ev.result) {
            $scope.vs = $rootScope.vox.videoSources();
            console.log($scope.vs[0].id);
            $rootScope.vox.useVideoSource($scope.vs[0].id)
                .then(function (s) {
                    buildLocalVideo(s);
                }, function (e) {
                    console.log(e);
                });
        }
    };

    function buildLocalVideo(stream) {
        var qr = document.querySelector('#local');
        var el = angular.element(qr);
        el.attr('src', URL.createObjectURL(stream));
    }

    function makeCall() {
        $scope.call = $rootScope.vox.call('79241747744');
        console.log($scope.call);
    }

    function makeContract() {
        $rootScope.web3.eth.defaultAccount = $scope.me.address;
        var contractor = $rootScope.web3.eth.contract($abi);
        var contract = contractor.at($contract);
        return contract;
    }

    $scope.apply = function () {
        $rootScope.processing = true;

        var contr = makeContract();
        contr.applyForVisit('0xb3ba895cc7685e7f9c54deb89605b318ac1a8163', { gas: '3141592' }, function (e, r) {
            $rootScope.processing = false;
            if (e) { $rootScope.$broadcast('alert', e); }
            else {
                $rootScope.$broadcast('alert', 'OK');
            }
        });
    };

    $scope.save = function () {
        $rootScope.processing = true;
        var contr = makeContract();
        var count = contr.getVisitHistoryLength.call($scope.me.address).toNumber();
        contr.setVisitAnamnesis($scope.me.address, count - 1, $scope.data.comps, { gas: "3141592" }, function (e, r) {
            $rootScope.processing = false;
            if (e) { $rootScope.$broadcast('alert', e); }
            else {
                $rootScope.$broadcast('alert', 'OK');
            }
        });
        contr.setVisitDiagnosis(count - 1, $scope.data.diagnosis, { gas: "3141592" }, function (e, r) {
            $rootScope.processing = false;
            if (e) { $rootScope.$broadcast('alert', e); }
            else {
                $rootScope.$broadcast('alert', 'OK');
            }
        });
        // contr.setVisitDatetime($scope.me.address, 0, "2018-02-18 17:00", { gas: "3141592" });
    };

    $scope.send = function () {
        $rootScope.$broadcast('alert', $scope.message.body);
        $scope.message.body = '';
    };
};
angular.module('id.controllers')
    .controller('RoomCtrl', roomCtrl);