angular.module('LRProject.controllers', ['LRProject.services', 'LRProject.controllers.exercise', 'LRProject.controllers.grading', 'LRProject.controllers.offline', 'LRProject.controllers.filter'])
    .controller('AppCtrl', function($scope, $location, $ionicSideMenuDelegate, $http, $state, $ionicPopup, $ionicPopover, drawingPadUtil, customUtil) {
        $ionicSideMenuDelegate.canDragContent(false);

        $http.defaults.withCredentials = true;

        //var lrpServer = 'https://lrtadmin.maaum.net/';
        var lrpServer = 'http://localhost:4040/';
        var pageCacheHolder = null;

        $scope.$on('$locationChangeSuccess', function() {
            $scope.actualLocation = $location.path();
        });

        $scope.$watch(function() { return $location.path() }, function(newLocation, oldLocation) {
            if ($scope.actualLocation === newLocation) {
                if ($state.current.name === "app.login") $scope.lrpModel.isMenuOff = false;
                else $scope.lrpModel.isMenuOff = true;
            }
        });

        $scope.classholder = [
            'lrpState0',
            'lrpState1',
            'lrpState2',
            'lrpState3'
        ];

        var pageBluePrint = [{
                hasTab: true,
                baseReload: [
                    { url: 'therapist/list', dataSetter: 'therapistList' },
                    { url: 'patient/list', dataSetter: 'patientList' }
                ],
                listStatePage: [
                    './templates/Include_List_Therapist.html',
                    './templates/Include_List_SelectedTherapist.html',
                    './templates/Include_List_SelectedPatient.html'
                ]
            },
            {
                hasTab: true,
                baseReload: [
                    { url: 'patient/list', dataSetter: 'patientList' }
                ],
                listStatePage: [
                    './templates/Include_List_Patient.html',
                    './templates/Include_List_SelectedPatient.html'
                ]
            },
            {
                /*
                baseReload: [
                    { url: 'tasks/list', dataSetter: 'taskList' }
                ],
                listStatePage: [
                    './templates/Include_List_Individual.html',
                    './templates/Include_List_SelectedIndividual.html'
                ]
                */
                //sub page move
            },
            {
                /*
                hasTab: false,
                baseReload: [
                    { url: 'protocols/', dataSetter: 'protocolList' }
                ],
                listStatePage: [
                    './templates/Include_List_Protocol.html',
                    './templates/Include_List_SelectedProtocol.html'
                ]
                */
                hasTab: false,
                baseReload: [
                    { url: 'tasks/list', dataSetter: 'taskList' }
                ],
                listStatePage: [
                    './templates/Include_List_Individual.html',
                    './templates/Include_List_SelectedIndividual.html'
                ]                
            },
            {
                hasTab: false,
                baseReload: [
                    { url: 'progressTemplates/list/', dataSetter: 'templateList' }
                ],
                listStatePage: [
                    './templates/Include_List_ProgressTemplate.html',
                    './templates/Include_List_SelectedProgressNote.html'
                ]
            },
            {
                hasTab: false,
                baseReload: [],
                listStatePage: [
                    './templates/Include_List_OfflineHomework.html',
                    './templates/Include_List_SelectedResult.html'
                ]
            }            
        ];

        var pageBluePrintForTab = {
            baseReloadByTab: [
                { url: 'progressNotes/list/', dataSetter: 'tabDataList' },
                { url: 'results/list/', dataSetter: 'resultList' },
                { url: 'takehomes/list/', dataSetter: 'homeworkList' },
                { url: 'tasks/list/', dataSetter: 'taskList' },
                { url: 'protocols/list/', dataSetter: 'protocolList' },
                { url: 'officialtestdata/list/', dataSetter: 'tabDataList' }
            ],
            tabStatePage: [ // 0 ~ 4 //+ 5(Official)
                './templates/Include_List_SelectedProgressNote.html',
                './templates/Include_List_SelectedResult.html',
                './templates/Include_List_SelectedIndividual2.html',
                './templates/Include_List_SelectedIndividual.html',              
                './templates/Include_List_SelectedProtocol.html'
            ],
            nextTabItemClick: [
                { url: 'progressNotes/', dataSetter: 'selectedTemplate' },
                { url: 'results/', dataSetter: 'selectedResult' },
                { url: 'takehomes/', dataSetter: 'selectedHomework' },
                { url: 'tasks/', dataSetter: 'selectedTask' },
                { url: 'protocols/', dataSetter: 'selectedProtocol' }
            ]
        };

        var pageCacheData = [{
                listState: 0,
                tabState: 5,
                hiddenTabState: 5,
                tabCacheData: null,
                setNum: 1,
                cacheData: []
            },
            {
                listState: 0,
                tabState: 5,
                hiddenTabState: 5,
                tabCacheData: null,
                setNum: 1,
                cacheData: []
            },
            {
                listState: 0,
                setNum: 1,
                cacheData: []
            },
            {
                listState: 0,
                setNum: 1,
                cacheData: []
            },
            {
                listState: 0,
                cacheData: []
            }
                     
        ];

        function setListState(object) {
            $scope.listStateCode = object.listState;
            pageCacheHolder.listState = $scope.listStateCode;

            ionic.DomUtil.ready(function() { //ng-class 싱크가 잘 안맞아서 억지로 이렇게 했음
                angular.element(document.querySelector('#lrpOuterList'))
                    .removeClass('lrpState0')
                    .removeClass('lrpState1')
                    .removeClass('lrpState2')
                    .removeClass('lrpState3')
                    .addClass($scope.classholder[object.listState]);
            });

            callbackChecker(object);
        }

        function setChacheData(idx, vParam) {
            //if (pageCacheHolder === undefined || pageCacheHolder === null || idx < 1) return;

            idx--;

            if (pageCacheHolder.cacheData.length > idx) {
                pageCacheHolder.cacheData[idx].url = vParam.url;
                pageCacheHolder.dataSetter = vParam.dataSetter;
            } else pageCacheHolder.cacheData.push({ url: vParam.url, dataSetter: vParam.dataSetter });
        }

        function callbackChecker(obParam) {
            
            console.log("callback:"+JSON.stringify(obParam));

            if (obParam === undefined || obParam.callback === undefined || obParam.callback === null) return;

            if (obParam.callbackArg === undefined || obParam.callbackArg === null) {
                obParam.callback();
                return;
            }

            //console.log(obParam);
            obParam.callback(obParam.callbackArg);
        }

        $ionicPopover.fromTemplateUrl('popover-user.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.userPopover = popover;
        });

        $ionicPopover.fromTemplateUrl('popover-addPop.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.addPopover = popover;
        });

        $ionicPopover.fromTemplateUrl('./templates/Popover_UserForm.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.userFormPopover = popover;
        });

        $ionicPopover.fromTemplateUrl('./templates/Popover_SelectList.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.selectListPopover = popover;
        });

        $scope.isSelected = function(param, state) {
            //console.log(param._id);
            //console.log($scope.lrpModel.statePage);

            if (state === 0) {
                if ($scope.lrpModel.selectedTherapist !== null && param._id == $scope.lrpModel.selectedTherapist._id) return "lrpListSelected";
            } else if (state === 1) {
                if ($scope.lrpModel.selectedPatient !== null && param._id == $scope.lrpModel.selectedPatient._id) return "lrpListSelected";
            }
        };

        $scope.initLRP = function() {
            $scope.lrpServer = lrpServer;

            console.log($scope.lrpServer)

            $scope.lrpModel = {};
            $scope.lrpModel.userData = null;

            $scope.lrpModel.therapistList = null;
            $scope.lrpModel.selectedTherapist = null;

            $scope.lrpModel.patientList = null;
            $scope.lrpModel.selectedPatient = null;

            $scope.lrpModel.taskList = null;
            $scope.lrpModel.selectedTask = null;

            $scope.lrpModel.protocolList = null;
            $scope.lrpModel.selectedProtocol = null;

            $scope.lrpModel.templateList = null;
            $scope.lrpModel.selectedTemplate = null;

            $scope.lrpModel.resultList = null;
            $scope.lrpModel.selectedResult = null;

            $scope.lrpModel.homeworkList = null;
            $scope.lrpModel.selectedHomework = null;

            $scope.lrpModel.tabDataList = null;
            //$scope.lrpModel.selectedTabData = null;

            $scope.lrpModel.tempDataListPopover = null;
            $scope.lrpModel.tempDataPopover = null;

            $scope.lrpModel.selectedProblemSet = null;

            $scope.hideCategory = Array(100).fill(true);

            $scope.lrpModel.setNum = 1;
            $scope.lrpModel.setDelay = 7;
            $scope.lrpModel.taskPivot = 0;
            $scope.lrpModel.takehomePivot = 0;
            $scope.lrpModel.stagePivot = 0;
            $scope.lrpModel.resPivot = 0;

            $scope.formSearch = { //search formData
                searchTherapistName: null,
                searchPatientNameA: null,
                searchPatient: null,
                searchIndividual: null,
                searchProtocol: null,
                searchTemplate: null,
                searchAloc: null,
                searchProtocolAssemble: null
            };

            $scope.lrpModel.listPageHolder = [];

            $scope.lrpModel.orderData = null;

            $scope.lrpModel.isMenuToggle = false;
            $scope.lrpModel.isMenuOff = false;

            $scope.lrpModel.statePage = 0; // 0 ~ 4
            $scope.lrpModel.backState = 0;

            $scope.listStateCode = 0;
            $scope.tabStateCode = 5; // 0 ~ 2 + 3 individual, 3 protocol, 5 official
            $scope.isOffline = false;
            $scope.onDownLoading = false;
            $scope.allDownLoad = 0;
            $scope.progressDownLoad = 0;

            $scope.lrpModel.pageTag = [
                '평가자', '환자', '선택과제 평가', '구성 평가', '경과기록지 서식', '오프라인 과제'
            ];

            pageCacheData = [{
                    listState: 0,
                    tabState: 5,
                    hiddenTabState: 5,
                    tabCacheData: null,
                    setNum: 1,
                    cacheData: []
                },
                {
                    listState: 0,
                    tabState: 5,
                    hiddenTabState: 5,
                    tabCacheData: null,
                    setNum: 1,
                    cacheData: []
                },
                {
                    listState: 0,
                    setNum: 1,
                    cacheData: []
                },
                {
                    listState: 0,
                    setNum: 1,
                    cacheData: []
                },
                {
                    listState: 0,
                    setNum: 1, //걍 일부러 하나 더 넣었다. 구분하기 귀찮아서
                    cacheData: []
                },
                {
                    listState: 0,
                    setNum: 1, //걍 일부러 하나 더 넣었다. 구분하기 귀찮아서
                    cacheData: []
                }
            ];

            pageBluePrint = [{
                    hasTab: true,
                    baseReload: [
                        { url: 'therapist/list', dataSetter: 'therapistList' },
                        { url: 'patient/list', dataSetter: 'patientList' }
                    ],
                    listStatePage: [
                        './templates/Include_List_Therapist.html',
                        './templates/Include_List_SelectedTherapist.html',
                        './templates/Include_List_SelectedPatient.html'
                    ]
                },
                {
                    hasTab: true,
                    baseReload: [
                        { url: 'patient/list', dataSetter: 'patientList' }
                    ],
                    listStatePage: [
                        './templates/Include_List_Patient.html',
                        './templates/Include_List_SelectedPatient.html'
                    ]
                },
                {
                    // sub page 
                   
                                        
                },
                {
                    baseReload: [
                        { url: 'tasks/list', dataSetter: 'taskList' }
                    ],
                    listStatePage: [
                        './templates/Include_List_Individual.html',
                        './templates/Include_List_SelectedIndividual.html'
                    ]                    
                },
                {
                    hasTab: false,
                    baseReload: [
                        { url: 'progressTemplates/list/', dataSetter: 'templateList' }
                    ],
                    listStatePage: [
                        './templates/Include_List_ProgressTemplate.html',
                        './templates/Include_List_SelectedProgressNote.html'
                    ]
                },
                {
                    hasTab: false,
                    baseReload: [],
                    listStatePage: [
                        './templates/Include_List_OfflineHomework.html',
                        './templates/Include_List_SelectedResult.html'
                    ]
                }              
                
            ];
            
            //add 주석추가  환자일 경우 
            if ($scope.lrpModel.userData !== null && $scope.lrpModel.userData.roles === 'patient') {
                pageBluePrint[3] = {
                    hasTab: false,
                    baseReload: [
                        { url: 'takehomes/', dataSetter: 'homeworkList' }
                    ],
                    listStatePage: [
                        './templates/include_Patient_Homework.html'
                    ]
                };
            }

            if ($scope.lrpModel.userData !== null) pageBluePrint[4].baseReload.url = 'progressTemplates/list/' + $scope.lrpModel.userData._id;
        };

        //for $http - 이것도 다 합쳐야 되는데...
        $scope.loadDataGet = function(obParam) {
            console.log("loadDataGet = "+lrpServer + obParam.url);

            $http.get(lrpServer + obParam.url).
            success(function(data) {
                if (obParam.dataSetter !== undefined && $scope.lrpModel[obParam.dataSetter] !== undefined) $scope.lrpModel[obParam.dataSetter] = data;

                console.log('loadDataGet');
                console.log("ddd데이터 리턴=" + $scope.lrpModel[obParam.dataSetter]);

                callbackChecker(obParam);
            }).
            error(function(data, status) { console.log('Error : loadDataGet : ' + lrpServer + obParam.url + ' =>(' + obParam.dataSetter + ' : ' + obParam.callback + ') ! status : ' + status); });
        };

        $scope.loadDataPost = function(obParam) {
            //console.log(obParam);

            $http.post(lrpServer + obParam.url, obParam.vParam).
            success(function(data) {
                if (obParam.dataSetter !== undefined && $scope.lrpModel[obParam.dataSetter] !== undefined) $scope.lrpModel[obParam.dataSetter] = data;
                callbackChecker(obParam);

                console.log('loadDataPost');
                console.log(data);
            }).
            error(function(data, status) { console.log('Error : loadDataPost : ' + lrpServer + obParam.url + ' =>(' + obParam.dataSetter + ' : ' + obParam.callback + ') ! status : ' + status); });
        };

        $scope.loadDataDelete = function(obParam) {
            $http.delete(lrpServer + obParam.url).
            success(function(data) {
                if (obParam.dataSetter !== undefined && $scope.lrpModel[obParam.dataSetter] !== undefined) $scope.lrpModel[obParam.dataSetter] = data;
                callbackChecker(obParam);

                //console.log('loadDataDelete'); console.log(data);
            }).
            error(function(data, status) { console.log('Error : loadDataDelete : ' + lrpServer + obParam.url + ' =>(' + obParam.dataSetter + ' : ' + obParam.callback + ') ! status : ' + status); });
        };

        
        $scope.subLocation = function(arg) {
             $scope.lrpModel.statePage = arg;
             $state.transitionTo('app.subPage');
         }
       
        
        //for List
        $scope.menuActivate = function(arg, arg2) {
            
            console.log("[statePage  >> ]" + $scope.lrpModel.statePage);

            if ( arg2 == undefined || arg2 === null ) arg2 = 'N';
            
            console.log("[statePage bool >> ]" + arg2);
                        
            if ( arg2 == 'N'  ) {
                if (arg < 0 || arg >= pageBluePrint.length) {
                    $state.transitionTo('app.login');
                    return;
                }
            }

            var i;

            $scope.lrpModel.statePage = arg;

            //add subpage 이동
            if ( $scope.lrpModel.statePage == 2 && arg2 == 'N' )  {
                hasTab: false;
                $state.transitionTo('app.subPage');
                //return;
            }
            
            //add LT 추가 
            if ( $scope.lrpModel.statePage === 2 && arg2 == 'LT' )  {
                $scope.lrpModel.pageTag[2] = '기능훈련';
                pageBluePrint[2] = {
                    baseReload: [
                        { url: 'tasks/list1', dataSetter: 'taskList' }
                    ],
                    listStatePage: [
                        './templates/Include_List_Individual2.html',
                        './templates/Include_List_SelectedIndividual2.html'
                    ]
                };                
            } 
            //add RT 
            else if ( $scope.lrpModel.statePage === 2 && arg2 == 'RT' )  {
                $scope.lrpModel.pageTag[2] = '기능훈련';
                pageBluePrint[2] = {
                    baseReload: [
                        { url: 'tasks/list2', dataSetter: 'taskList' }
                    ],
                    listStatePage: [
                        './templates/Include_List_Individual2.html',
                        './templates/Include_List_SelectedIndividual2.html'
                    ] 
                };               
            }
                        
                                    
            if ($scope.lrpModel.statePage === 5) {
                $scope.isOffline = true;

                for (i = 0; i < pageBluePrint[arg].listStatePage.length; i++) {
                    $scope.lrpModel.listPageHolder[i] = pageBluePrint[arg].listStatePage[i];
                }

                pageCacheHolder = pageCacheData[arg];

            } else {
                if ($scope.lrpModel.userData !== null && $scope.lrpModel.userData.roles === 'patient') {
                    $scope.lrpModel.selectedPatient = $scope.lrpModel.userData;

                    $scope.lrpModel.pageTag[3] = '과제';
                    pageBluePrint[3] = {
                        hasTab: false,
                        baseReload: [
                            { url: 'takehomes/list/' + $scope.lrpModel.userData._id, dataSetter: 'homeworkList' }
                        ],
                        listStatePage: [
                            './templates/include_Patient_Homework.html'
                        ]
                    };
                }

                if ($scope.lrpModel.userData !== null) pageBluePrint[4].baseReload.url = 'progressTemplates/list/' + $scope.lrpModel.userData._id;

                for (i = 0; i < pageBluePrint[arg].listStatePage.length; i++) {
                    $scope.lrpModel.listPageHolder[i] = pageBluePrint[arg].listStatePage[i];
                }

                for (i = 0; i < pageBluePrint[arg].baseReload.length; i++) {
                    $scope.loadDataGet(pageBluePrint[arg].baseReload[i]);
                }

                pageCacheHolder = pageCacheData[arg];

                $scope.lrpModel.selectedHomework = null; //hackcode for homework conflict

                for (i = 0; i < pageCacheHolder.cacheData.length; i++) {
                    $scope.loadDataGet(pageCacheHolder.cacheData[i]);
                }

                if (pageBluePrint[arg].hasTab && pageCacheHolder.tabCacheData !== undefined && pageCacheHolder.tabCacheData !== null) {
                    $scope.tabStateCode = pageCacheHolder.tabState;
                    $scope.loadDataGet(pageCacheHolder.tabCacheData);

                    if (pageCacheHolder.tabState !== pageCacheHolder.hiddenTabState) {
                        if (pageCacheHolder.hiddenTabState === 4) {

                        }
                    }

                    $scope.lrpModel.listPageHolder[pageBluePrint[$scope.lrpModel.statePage].listStatePage.length] = pageBluePrintForTab.tabStatePage[pageCacheHolder.hiddenTabState];
                }
                
                $scope.lrpModel.setNum = pageCacheHolder.setNum;
            }
            
            for (i = 0; i < pageBluePrint[arg].listStatePage.length; i++) {
                console.log("pageCacheHolder >> " + $scope.lrpModel.listPageHolder[i]);
            }
            
            console.log("statePage >> " + $scope.lrpModel.statePage);
            setListState(pageCacheHolder);

            $state.transitionTo('app.list');
        };

        $scope.selectHomeWorkPatient = function(home) {
            var vParam = {
                url: '',
                dataSetter: '',
                callback: ''
            };

            if (home.refResults.length > 0) {
                vParam = {
                    url: 'results/' + home.refResults[home.refResults.length - 1],
                    dataSetter: 'selectedResult',
                    callback: $scope.gradingExercise
                };

                $scope.loadDataGet(vParam);
                return;
            }

            if (home.isProtocol) {
                vParam.url = 'protocols/' + home.protocol;
                vParam.dataSetter = 'selectedProtocol';
                vParam.callback = $scope.playProtocol;
            } else {
                $scope.lrpModel.setNum = home.setNum;

                vParam.url = 'tasks/' + home.task;
                vParam.dataSetter = 'selectedTask';
                vParam.callback = $scope.playIndividual;
            }

            $scope.loadDataGet(vParam);
        };

        $scope.prevState = function() {
            if ($scope.listStateCode <= 0) {
                $scope.listStateCode = 0;
                return;
            }

            pageCacheHolder.cacheData.pop();

            setListState({ listState: $scope.listStateCode - 1 });
        };

        //for Therapist, Patient
        $scope.selectTherapist = function(therapist) {
            if ($scope.lrpModel.statePage === 0) {
                var vParam = {
                    url: 'users/therapist/' + therapist._id,
                    dataSetter: 'selectedTherapist',
                    callback: setListState,
                    callbackArg: { listState: 1 }
                };

                setChacheData(1, vParam);
                $scope.loadDataGet(vParam);
            } else if ($scope.lrpModel.statePage === 1) { //환자페이지에서 평가자 배정
                if (!therapist.certified) return;

                $scope.AllocateTherapist(therapist);

                $scope.selectListPopover.hide();
            }
        };

        $scope.selectPatient = function(patient) {
            var vParam = {
                url: 'users/patient/' + patient._id,
                dataSetter: 'selectedPatient',
                callback: setListState,
                callbackArg: {
                    listState: 1,
                    callback: $scope.loadTabHeader,
                    callbackArg: $scope.tabStateCode
                }
            };

            if ($scope.lrpModel.statePage === 2 || $scope.lrpModel.statePage === 3) { //개별/구성 화면에서 환자 선택
                setChacheData(2, vParam);

                $scope.selectListPopover.hide();
            } else if ($scope.lrpModel.statePage === 0) { //평가자 화면에서 환자 선택
                setChacheData(2, vParam);

                vParam.callback = setListState;
                vParam.callbackArg = {
                    listState: 2,
                    callback: $scope.loadTabHeader,
                    callbackArg: $scope.tabStateCode
                };
            } else if ($scope.lrpModel.statePage === 1) { //환자 화면에서 환자 선택
                setChacheData(1, vParam);

                vParam.callback = setListState;
                vParam.callbackArg = {
                    listState: 1,
                    callback: $scope.loadTabHeader,
                    callbackArg: $scope.tabStateCode
                };
            }

            $scope.loadDataGet(vParam);
        };

        $scope.certifyTherapist = function() {
            if ($scope.lrpModel.selectedTherapist === null || $scope.lrpModel.selectedTherapist.certified) return;

            var confirmPopup = $ionicPopup.confirm({
                title: '평가자 승인',
                template: $scope.lrpModel.selectedTherapist.name + ' 평가자를 승인합니다.'
            });
            confirmPopup.then(function(res) {
                if (res) { //확인
                    $scope.loadDataPost({
                        url: 'users/certify/',
                        vParam: { id: $scope.lrpModel.selectedTherapist._id },
                        callback: $scope.loadDataGet,
                        callbackArg: {
                            url: 'therapist/list',
                            dataSetter: 'therapistList',
                            callback: function() { $scope.lrpModel.selectedTherapist.certified = true; }
                        }
                    });
                } else { //취소

                }
            });
        };

        $scope.AllocatePatient = function(patient) {
            $scope.loadDataPost({
                url: 'patient/assign/',
                vParam: { patientId: patient._id, therapistId: $scope.lrpModel.selectedTherapist._id },
                callback: $scope.loadDataGet,
                callbackArg: {
                    url: 'patient/list/',
                    dataSetter: 'patientList'
                }
            });
        };

        $scope.AllocateTherapist = function(therapist) {
            if ($scope.lrpModel.selectedPatient === null) return;

            $scope.loadDataPost({
                url: 'patient/assign/',
                vParam: { patientId: $scope.lrpModel.selectedPatient._id, therapistId: therapist._id },
                callback: $scope.loadDataGet,
                callbackArg: {
                    url: 'patient/list/',
                    dataSetter: 'patientList',
                    callback: $scope.loadDataGet,
                    callbackArg: {
                        url: 'users/patient/' + $scope.lrpModel.selectedPatient._id,
                        dataSetter: 'selectedPatient'
                    }
                }
            });
        };

        $scope.DeAllocate = function(patient) {
            $scope.loadDataPost({
                url: 'patient/unassign/',
                vParam: { patientId: patient._id },
                callback: $scope.loadDataGet,
                callbackArg: {
                    url: 'patient/list/',
                    dataSetter: 'patientList',
                    callback: setListState,
                    callbackArg: { listState: 1 }
                }
            });
        };

        //for Tabs
        $scope.selectTabHeader = function(tabStateCode) { // 0~2, 5
            pageCacheHolder.tabState = tabStateCode;

            $scope.loadTabHeader(tabStateCode);
        };

        $scope.loadTabHeader = function(tabStateCode) {
            $scope.tabStateCode = tabStateCode;
            $scope.lrpModel.listPageHolder[pageBluePrint[$scope.lrpModel.statePage].listStatePage.length] = pageBluePrintForTab.tabStatePage[tabStateCode];

            var vParam = {
                url: pageBluePrintForTab.baseReloadByTab[tabStateCode].url + $scope.lrpModel.selectedPatient._id,
                dataSetter: pageBluePrintForTab.baseReloadByTab[tabStateCode].dataSetter,
                callback: setListState,
                callbackArg: { listState: pageBluePrint[$scope.lrpModel.statePage].listStatePage.length - 1 }
            };

            if (pageCacheHolder.tabCacheData !== undefined && pageCacheHolder.tabCacheData !== null) {
                pageCacheHolder.tabCacheData.url = vParam.url;
                pageCacheHolder.tabCacheData.dataSetter = vParam.dataSetter;
            } else pageCacheHolder.tabCacheData = { url: vParam.url, dataSetter: vParam.dataSetter };

            $scope.loadDataGet(vParam);
        };

        $scope.selectTabItem = function(tabItem, pTabIdx) {
            var tabIdx = (pTabIdx !== undefined) ? pTabIdx : $scope.tabStateCode;

            var vParam = {
                url: pageBluePrintForTab.nextTabItemClick[tabIdx].url + tabItem._id,
                dataSetter: pageBluePrintForTab.nextTabItemClick[tabIdx].dataSetter,
                callback: setListState,
                callbackArg: { listState: pageBluePrint[$scope.lrpModel.statePage].listStatePage.length }
            };

            $scope.lrpModel.listPageHolder[pageBluePrint[$scope.lrpModel.statePage].listStatePage.length] = pageBluePrintForTab.tabStatePage[tabIdx];
            setChacheData(pageBluePrint[$scope.lrpModel.statePage].listStatePage.length, vParam);
            pageCacheHolder.tabState = tabIdx;
            pageCacheHolder.hiddenTabState = tabIdx;

            if (tabIdx === 1) {
                vParam.callback = $scope.preProcessResult;
                vParam.callbackArg = {
                    callback: setListState,
                    callbackArg: { listState: pageBluePrint[$scope.lrpModel.statePage].listStatePage.length }
                };

                pageCacheHolder.cacheData[pageBluePrint[$scope.lrpModel.statePage].listStatePage.length - 1].callback = $scope.preProcessResult;
            } else if (tabIdx === 2) {
                vParam.callback = $scope.loadDataGet;

                if (tabItem.refResults.length > 0) {
                    $scope.lrpModel.listPageHolder[pageBluePrint[$scope.lrpModel.statePage].listStatePage.length] = pageBluePrintForTab.tabStatePage[1];
                    pageCacheHolder.hiddenTabState = 1;
                    vParam.callbackArg = {
                        url: 'results/',
                        dataSetter: 'selectedResult',
                        callback: $scope.preProcessResult,
                        callbackArg: {
                            callback: setListState,
                            callbackArg: { listState: pageBluePrint[$scope.lrpModel.statePage].listStatePage.length }
                        }
                    };
                } else if (tabItem.isProtocol) {
                    $scope.lrpModel.listPageHolder[pageBluePrint[$scope.lrpModel.statePage].listStatePage.length] = pageBluePrintForTab.tabStatePage[4];
                    pageCacheHolder.hiddenTabState = 4;

                    vParam.callbackArg = {
                        url: 'protocols/' + tabItem.protocol,
                        dataSetter: 'selectedProtocol',
                        callback: setListState,
                        callbackArg: { listState: pageBluePrint[$scope.lrpModel.statePage].listStatePage.length }
                    };
                } else {
                    $scope.lrpModel.listPageHolder[pageBluePrint[$scope.lrpModel.statePage].listStatePage.length] = pageBluePrintForTab.tabStatePage[3];
                    pageCacheHolder.hiddenTabState = 3;

                    $scope.lrpModel.setNum = tabItem.setNum;

                    vParam.callbackArg = {
                        url: 'tasks/' + tabItem.task,
                        dataSetter: 'selectedTask',
                        callback: setListState,
                        callbackArg: { listState: pageBluePrint[$scope.lrpModel.statePage].listStatePage.length }
                    };
                }
            }

            $scope.loadDataGet(vParam);
        };

        $scope.addTabItem = function() {
            if ($scope.tabStateCode === 0) {
                $scope.lrpModel.selectedTemplate = null;
                $scope.lrpModel.listPageHolder[pageBluePrint[$scope.lrpModel.statePage].listStatePage.length] = pageBluePrintForTab.tabStatePage[$scope.tabStateCode];
                setListState({ listState: pageBluePrint[$scope.lrpModel.statePage].listStatePage.length });
            } else if ($scope.tabStateCode === 2) {

            }
        };

        function _calculateAge(birthday) { // birthday is a date
            var ageDifMs = Date.now() - birthday.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        }

        $scope.preProcessResult = function(obParam) {
            if ($scope.lrpModel.selectedResult === null) return;

            //debugger;

            console.log($scope.lrpModel.selectedResult);

            $scope.lrpModel.case32 = false;
            if ($scope.lrpModel.selectedResult.name.includes("의미지식")) {
                if ($scope.lrpModel.selectedPatient.birthday !== undefined) {
                    $scope.lrpModel.case32 = true;
                    age = _calculateAge(new Date($scope.lrpModel.selectedPatient.birthday));
                    score = $scope.lrpModel.selectedResult.numOfCorrect;
                    if (age > 69) {
                        if (score < 42) $scope.lrpModel.score32 = 1;
                        else if (score < 46) $scope.lrpModel.score32 = 2;
                        else if (score < 48) $scope.lrpModel.score32 = 3;
                        else if (score < 50) $scope.lrpModel.score32 = 5;
                        else if (score < 51) $scope.lrpModel.score32 = 8;
                        else if (score < 52) $scope.lrpModel.score32 = 9;
                        else if (score < 53) $scope.lrpModel.score32 = 15;
                        else if (score < 55) $scope.lrpModel.score32 = 20;
                        else if (score < 56) $scope.lrpModel.score32 = 30;
                        else if (score < 57) $scope.lrpModel.score32 = 45;
                        else if (score < 58) $scope.lrpModel.score32 = 50;
                        else if (score < 59) $scope.lrpModel.score32 = 60;
                        else if (score < 60) $scope.lrpModel.score32 = 80;
                        else $scope.lrpModel.score32 = 99;
                    } else {
                        if (score < 55) $scope.lrpModel.score32 = 1;
                        else if (score < 56) $scope.lrpModel.score32 = 2;
                        else if (score < 58) $scope.lrpModel.score32 = 3;
                        else if (score < 59) $scope.lrpModel.score32 = 9;
                        else if (score < 60) $scope.lrpModel.score32 = 25;
                        else $scope.lrpModel.score32 = 99;
                    }
                }
            }

            $scope.labels = [];
            $scope.graphData = [];

            var i, j = 0;

            for (i = 0; i < $scope.lrpModel.selectedResult.tasks.length; i++) {

                $scope.labels.push([]);

                $scope.graphData.push([]);
                $scope.graphData[i].push([]);

                for (j = 0; j < $scope.lrpModel.selectedResult.tasks[i].problems.length; j++) {

                    if ($scope.lrpModel.selectedResult.tasks[i].problems[j].isCorrect) {
                        $scope.labels[i].push(j + 1);
                    } else {
                        $scope.labels[i].push('<' + (j + 1) + '>');
                    }

                    $scope.graphData[i][0].push($scope.lrpModel.selectedResult.tasks[i].problems[j].selectTime);
                }
            }

            $scope.scoringFlag = false;

            if ($scope.lrpModel.selectedResult.tasks[0].scoreType !== undefined && $scope.lrpModel.selectedResult.tasks[0].scoreType !== 'n/a')
                $scope.scoringFlag = true;
            if ($scope.lrpModel.selectedResult.tasks[0].answerType === 'forms')
                $scope.scoringFlag = true;

            $scope.customFlag = customUtil.GetCustomFlagResult($scope);

            $scope.lrpModel.taskPivot = 0;

            callbackChecker(obParam);
        };

        $scope.addOfficialTest = function() {
            $scope.loadDataPost({
                url: 'officialtestdata/',
                vParam: {
                    memo: $scope.lrpModel.tempDataPopover.selectedOfficialTest.name,
                    patient: $scope.lrpModel.selectedPatient._id,
                    template: $scope.lrpModel.tempDataPopover.selectedOfficialTest._id,
                    value: $scope.lrpModel.tempDataPopover.value,
                    testDate: new Date()
                },
                callback: $scope.selectTabHeader,
                callbackArg: 5
            });

            $scope.selectListPopover.hide();
        };

        $scope.deleteOfficialTest = function(officialData) {
            $scope.itemDelete({
                url: 'officialtestdata/' + officialData._id,
                callback: $scope.selectTabHeader,
                callbackArg: 5
            });
        };

        $scope.deleteHomework = function(homework) {
            $scope.itemDelete({
                url: 'takehomes/' + homework._id,
                callback: $scope.selectTabHeader,
                callbackArg: 2
            });
        };

        $scope.deleteResult = function(result) {
            $scope.itemDelete({
                url: 'results/' + result._id,
                callback: $scope.selectTabHeader,
                callbackArg: 1
            });
        };

        $scope.toggleCategory = function(index) {
            $scope.hideCategory[index] = !$scope.hideCategory[index];
        }

        //for Individual
        $scope.selectIndividualTask = function(task) {
            // alert("selectIndividualTask");
            var vParam = {
                url: 'tasks/' + task._id,
                dataSetter: 'selectedTask'
            };

            $scope.lrpModel.selectedHomework = null;

            $scope.lrpModel.setNum = 1;

/*
            if ($scope.lrpModel.statePage === 2) {
                vParam.callback = setListState;
                vParam.callbackArg = { listState: 1 };

                setChacheData(1, vParam);
            } else if ($scope.lrpModel.statePage === 0 || $scope.lrpModel.statePage === 1) {
                $scope.selectTabItem(task, 3);
                $scope.lrpModel.setDelay = 7;
                $scope.selectListPopover.hide();
                return;
            }
*/            
            /** free 메뉴위치 조정 */
            if ($scope.lrpModel.statePage === 3) {
                vParam.callback = setListState;
                vParam.callbackArg = { listState: 1 };

                setChacheData(1, vParam);
            } else if ($scope.lrpModel.statePage === 0 || $scope.lrpModel.statePage === 1) {
                $scope.selectTabItem(task, 3);
                $scope.lrpModel.setDelay = 7;
                $scope.selectListPopover.hide();
                return;
            }
            
            console.log("dddd 문제 조회하기 vParam => "+ vParam);
            $scope.loadDataGet(vParam);
        };

        /** free 훈련메뉴추가 */
        $scope.selectIndividualTask2 = function(task) {
            var vParam = {
                url: 'tasks/' + task._id,
                dataSetter: 'selectedTask'
            };

            $scope.lrpModel.selectedHomework = null;

            $scope.lrpModel.setNum = 1;

            if ($scope.lrpModel.statePage === 2) {
                vParam.callback = setListState;
                vParam.callbackArg = { listState: 1 };

                setChacheData(1, vParam);
            } else if ($scope.lrpModel.statePage === 0 || $scope.lrpModel.statePage === 1) {
                $scope.selectTabItem(task, 3);
                $scope.lrpModel.setDelay = 7;
                $scope.selectListPopover.hide();
                return;
            }
            
            console.log("vParam => "+ vParam);
            $scope.loadDataGet(vParam);
        };
        
        $scope.setDown = function(obj) {
            if (obj === undefined) obj = $scope.lrpModel;

            if (obj.setNum > 1) {
                obj.setNum--;
            } else obj.setNum = 1;

            if ($scope.lrpModel.statePage === 3) $scope.protcolTaskAddApply();
            else pageCacheHolder.setNum = obj.setNum;
        };

        $scope.setUp = function(max, obj) {
            if (obj === undefined) obj = $scope.lrpModel;

            if (obj.setNum < max) {
                obj.setNum++;
            } else obj.setNum = max;

            if ($scope.lrpModel.statePage === 3) $scope.protcolTaskAddApply();
            else pageCacheHolder.setNum = obj.setNum;
        };

        $scope.assignHomework = function(object, delay, isProtocol) {
            var vParam = {
                patientID: $scope.lrpModel.selectedPatient._id
            };

            if (isProtocol) {
                vParam.protocolID = object._id;
            } else {
                vParam.taskID = object._id;
                vParam.setNum = $scope.lrpModel.setNum;
            }

            if (delay > 0) {
                vParam.expired = new Date();
                vParam.expired.setDate(vParam.expired.getDate() + delay);

                vParam.expired = vParam.expired.getTime();
            }

            $scope.loadDataPost({
                url: 'takehomes/',
                vParam: vParam,
                callback: $scope.loadDataGet,
                callbackArg: {
                    url: 'takehomes/list/' + $scope.lrpModel.selectedPatient._id,
                    dataSetter: 'homeworkList',
                    callback: $scope.prevState()
                }
            });

            $scope.lrpModel.selectedResult = null;
        };

        //for Protocol
        $scope.selectProtocol = function(lrpProtocol) {
            var vParam = {
                url: 'protocols/' + lrpProtocol._id,
                dataSetter: 'selectedProtocol'
            };

            $scope.lrpModel.selectedHomework = null;

            if ($scope.lrpModel.statePage === 3) {
                vParam.callback = setListState;
                vParam.callbackArg = { listState: 1 };

                setChacheData(1, vParam);
            } else if ($scope.lrpModel.statePage === 0 || $scope.lrpModel.statePage === 1) {
                $scope.selectTabItem(lrpProtocol, 4);
                $scope.lrpModel.setDelay = 7;
                $scope.selectListPopover.hide();
                return;
            }

            $scope.loadDataGet(vParam);
        };

        $scope.addProtocol = function() {
            $scope.loadDataPost({
                url: 'protocols/',
                dataSetter: 'selectedProtocol',
                vParam: { json: JSON.stringify({ name: $scope.lrpModel.tempDataPopover.name, isProtocol: true }) },
                callback: $scope.loadDataGet,
                callbackArg: {
                    url: 'protocols/',
                    dataSetter: 'protocolList'
                }
            });

            $scope.selectListPopover.hide();
        };

        $scope.assembleProtocol = function(lrpProtocol) {
            if (lrpProtocol.starred) return;

            lrpProtocol.starred = true;

            console.log(lrpProtocol);

            var tempP = {
                taskID: { _id: lrpProtocol._id, name: lrpProtocol.name },
                setNum: 1,
                original: lrpProtocol
            };

            $scope.lrpModel.selectedProtocol.tasks.push(tempP);

            $scope.protcolTaskAddApply();

        };

        $scope.dessembleProtocol = function(lrpProtocol) {
            var tempArray = [];
            var cate = null;
            var task = null;

            for (var i = 0; i < $scope.lrpModel.selectedProtocol.tasks.length; i++) {
                if ($scope.lrpModel.selectedProtocol.tasks[i].taskID._id !== lrpProtocol.taskID._id) {
                    tempArray.push($scope.lrpModel.selectedProtocol.tasks[i]);
                } else {
                    for (cate in $scope.lrpModel.tempDataListPopover) {
                        for (task in $scope.lrpModel.tempDataListPopover[cate].tasks) {
                            if (lrpProtocol.taskID._id === $scope.lrpModel.tempDataListPopover[cate].tasks[task]._id) {
                                $scope.lrpModel.tempDataListPopover[cate].tasks[task].starred = false;

                                continue;
                            }
                        }
                    }
                }
            }

            $scope.lrpModel.selectedProtocol.tasks = tempArray;
            $scope.protcolTaskAddApply();
        };

        $scope.previewProtocolAssemble = function() {
            var cate = null;
            var task = null;
            var i = null;

            var temp = $scope.lrpModel.selectedProtocol.tasks.slice(0);

            for (cate in $scope.lrpModel.tempDataListPopover) {
                for (task in $scope.lrpModel.tempDataListPopover[cate].tasks) {
                    for (i = 0; i < temp.length; i++) {
                        if ($scope.lrpModel.tempDataListPopover[cate].tasks[task].starred || temp[i].taskID._id === $scope.lrpModel.tempDataListPopover[cate].tasks[task]._id) {
                            $scope.lrpModel.tempDataListPopover[cate].tasks[task].starred = true;
                            $scope.lrpModel.tempDataListPopover[cate].tasks[task].setSize = $scope.lrpModel.tempDataListPopover[cate].tasks[task].setSize;
                            temp.slice(i, 1);
                            continue;
                        } else {
                            $scope.lrpModel.tempDataListPopover[cate].tasks[task].starred = false;
                        }
                    }
                }
            }
        };

        $scope.protcolTaskAddApply = function() {
            $scope.loadDataPost({
                url: 'protocols/' + $scope.lrpModel.selectedProtocol._id,
                vParam: { json: JSON.stringify({ tasks: $scope.lrpModel.selectedProtocol.tasks }) },
                dataSetter: 'selectedProtocol'
            });
        };

        $scope.protcolDelete = function() {
            var vParam = {
                url: 'protocols/' + $scope.lrpModel.selectedProtocol._id,
                dataSetter: 'selectedProtocol',
                callback: $scope.loadDataGet,
                callbackArg: { url: 'protocols/', dataSetter: 'protocolList', callback: $scope.prevState }
            };

            $scope.itemDelete(vParam);
        };

        //for Template
        $scope.selectTemplate = function(template) {
            var vParam = {};

            if ($scope.lrpModel.statePage === 4) {
                vParam.url = 'progressTemplates/' + template._id;
                vParam.dataSetter = 'selectedTemplate';
                vParam.callback = setListState;
                vParam.callbackArg = { listState: 1 };

                setChacheData(1, vParam);
            } else if ($scope.lrpModel.statePage === 0 || $scope.lrpModel.statePage === 1) {
                vParam.url = 'progressTemplates/' + template._id;
                vParam.dataSetter = 'tempDataPopover';
                vParam.callback = function() {
                    $scope.lrpModel.selectedTemplate = { name: $scope.lrpModel.tempDataPopover.name, content: $scope.lrpModel.tempDataPopover.content };
                };

                $scope.selectListPopover.hide();
            }

            $scope.loadDataGet(vParam);
        };

        $scope.templateStarClick = function(template) {
            $scope.loadDataPost({
                url: (template.starred) ? '/progressTemplates/unstarred/' : '/progressTemplates/starred/',
                vParam: { userID: $scope.lrpModel.userData._id, progressTemplateID: template._id },
                callback: function() { template.starred = !template.starred }
            });
        };

        function checkTemplate(template) {
            if (template.name === '') {
                $ionicPopup.alert({
                    title: '오류',
                    content: '템플릿 제목을 입력해 주십시오.'
                });
                return false;
            }

            if (template.content === '') {
                $ionicPopup.alert({
                    title: '오류',
                    content: '템플릿 내용을 입력해 주십시오.'
                });
                return false;
            }

            return true;
        }

        $scope.templateWrite = function(template) {
            if (!checkTemplate(template)) return;

            var vParam = {};

            if ($scope.lrpModel.statePage === 4) {
                vParam.url = 'progressTemplates/insert/';
                vParam.vParam = template;
                vParam.callback = $scope.loadDataGet;
                vParam.callbackArg = { url: 'progressTemplates/list/' + $scope.lrpModel.userData._id, dataSetter: 'templateList' };

                $scope.selectListPopover.hide();
            } else if ($scope.lrpModel.statePage === 0 || $scope.lrpModel.statePage === 1) {
                vParam.url = 'progressNotes/insert/';
                vParam.vParam = {
                    patientID: $scope.lrpModel.selectedPatient._id,
                    json: JSON.stringify(template)
                };
                vParam.dataSetter = 'selectedTemplate';
                vParam.callback = $scope.selectTabHeader;
                vParam.callbackArg = 0;
            }

            $scope.loadDataPost(vParam);
        };

        $scope.templateModify = function(template) {
            if (!checkTemplate(template)) return;

            var vParam = {
                vParam: { name: template.name, content: template.content }
            };

            if ($scope.lrpModel.statePage === 4) {
                vParam.url = 'progressTemplates/' + template._id;
                vParam.callback = $scope.loadDataGet;
                vParam.callbackArg = { url: 'progressTemplates/list/' + $scope.lrpModel.userData._id, dataSetter: 'templateList' };
            } else if ($scope.lrpModel.statePage === 0 || $scope.lrpModel.statePage === 1) {
                vParam.url = 'progressNotes/' + template._id;
                vParam.dataSetter = 'selectedTemplate';
                vParam.callback = $scope.selectTabHeader;
                vParam.callbackArg = 0;
            }

            $scope.loadDataPost(vParam);
        };

        $scope.templateDelete = function(template) {
            var vParam = {
                vParam: { name: template.name, content: template.content }
            };

            if ($scope.lrpModel.statePage === 4) {
                vParam.url = 'progressTemplates/' + template._id;
                vParam.callback = $scope.loadDataGet;
                vParam.callbackArg = { url: 'progressTemplates/list/' + $scope.lrpModel.userData._id, dataSetter: 'templateList', callback: $scope.prevState };
            } else if ($scope.lrpModel.statePage === 0 || $scope.lrpModel.statePage === 1) {
                vParam.url = 'progressNotes/' + template._id;
                vParam.dataSetter = 'selectedTemplate';
                vParam.callback = $scope.selectTabHeader;
                vParam.callbackArg = 0;
            }

            $scope.itemDelete(vParam);
        };

        $scope.itemDelete = function(object) {
            var confirmPopup = $ionicPopup.confirm({
                title: '확인',
                template: '정말 삭제 하시겠습니까?'
            });
            confirmPopup.then(function(res) {
                if (res) { //삭제
                    $scope.loadDataDelete(object);
                } else { //취소

                }
            });
        };

        //for Popovers
        $scope.userFormOpenManager = function(roleType) {
            $scope.orderData = {
                flag: roleType, // 1 therapist, 2 patient
                errMsg: '확인',
                reload: {
                    callback: null,
                    callbackArg: null
                }
            };

            switch (roleType) {
                case 0:
                    $scope.orderData.tag = '계정 정보 수정';
                    $scope.orderData.targetUser = $scope.lrpModel.userData;
                    $scope.orderData.url = 'users/update';
                    $scope.orderData.reload.url = 'users/me';
                    $scope.orderData.reload.dataSetter = 'userData';
                    break;

                case 1:
                    $scope.orderData.tag = '평가자 등록';
                    $scope.orderData.targetUser = { roles: ['therapist'] };
                    $scope.orderData.url = 'auth/signup';
                    $scope.orderData.reload.url = 'therapist/list';
                    $scope.orderData.reload.dataSetter = 'therapistList';
                    break;

                case 2:
                    $scope.orderData.tag = '환자 등록';
                    $scope.orderData.targetUser = { roles: ['patient'] };
                    $scope.orderData.url = 'auth/signup';
                    $scope.orderData.reload.url = 'users/me';
                    $scope.orderData.reload.dataSetter = 'userData';
                    break;

                case 3:
                    $scope.orderData.tag = '평가자 정보 수정';
                    $scope.orderData.targetUser = $scope.lrpModel.selectedTherapist;
                    $scope.orderData.url = 'users/therapist/' + $scope.lrpModel.selectedTherapist._id;
                    $scope.orderData.reload.url = 'users/therapist/' + $scope.lrpModel.selectedTherapist._id;
                    $scope.orderData.reload.dataSetter = 'selectedTherapist';
                    $scope.orderData.reload.callback = $scope.loadDataGet;
                    $scope.orderData.reload.callbackArg = {
                        url: 'therapist/list',
                        dataSetter: 'therapistList'
                    };
                    break;

                case 4:
                    $scope.orderData.tag = '환자 정보 수정';
                    $scope.orderData.targetUser = $scope.lrpModel.selectedPatient;

                    console.log($scope.orderData.targetUser);

                    if ($scope.orderData.targetUser.birthday != null) {
                        var tempDate = new Date($scope.orderData.targetUser.birthday);

                        $scope.orderData.targetUser.year = tempDate.getFullYear();
                        $scope.orderData.targetUser.month = tempDate.getMonth() + 1;
                        $scope.orderData.targetUser.date = tempDate.getDate();
                    } else {
                        $scope.orderData.targetUser.year = '';
                        $scope.orderData.targetUser.month = '';
                        $scope.orderData.targetUser.date = '';
                    }

                    if ($scope.orderData.targetUser.inciDate != null) {
                        var tempDate = new Date($scope.orderData.targetUser.inciDate);

                        $scope.orderData.targetUser.inciyear = tempDate.getFullYear();
                        $scope.orderData.targetUser.incimonth = tempDate.getMonth() + 1;
                        $scope.orderData.targetUser.incidate = tempDate.getDate();
                    } else {
                        $scope.orderData.targetUser.inciyear = '';
                        $scope.orderData.targetUser.incimonth = '';
                        $scope.orderData.targetUser.incidate = '';
                    }

                    $scope.orderData.url = 'users/patient/' + $scope.lrpModel.selectedPatient._id;
                    $scope.orderData.reload.url = 'users/patient/' + $scope.lrpModel.selectedPatient._id;
                    $scope.orderData.reload.dataSetter = 'selectedPatient';
                    $scope.orderData.reload.callback = $scope.loadDataGet;
                    $scope.orderData.reload.callbackArg = {
                        url: 'patient/list',
                        dataSetter: 'patientList'
                    };
                    break;

                default:
                    return;
            }

            $scope.userFormPopover.show(window.event);
        };

        $scope.userFormSubmit = function() {
            if ($scope.orderData.flag === 1 || $scope.orderData.flag === 2) {
                if ($scope.orderData.targetUser.passOri == undefined || $scope.orderData.targetUser.passOri == '') {
                    $scope.orderData.errMsg = '비밀번호를 입력해 주시기 바랍니다.';
                    return;
                } else if ($scope.orderData.targetUser.passOri != $scope.orderData.targetUser.passChk) {
                    $scope.orderData.errMsg = '비밀번호/확인이 서로 다릅니다.';
                    return;
                }
            }

            var vParam = {};

            if ($scope.orderData.targetUser.name !== undefined) vParam.name = $scope.orderData.targetUser.name;
            if ($scope.orderData.targetUser.email !== undefined) vParam.email = $scope.orderData.targetUser.email;

            if ($scope.orderData.flag === 1 || $scope.orderData.flag === 2) {
                if ($scope.orderData.targetUser.username !== undefined) vParam.username = $scope.orderData.targetUser.username;
                if ($scope.orderData.targetUser.passOri !== undefined) vParam.password = $scope.orderData.targetUser.passOri;
                if ($scope.orderData.targetUser.roles !== undefined) vParam.roles = $scope.orderData.targetUser.roles;
            }

            if ($scope.orderData.flag === 2 || $scope.orderData.flag === 4) {
                if ($scope.orderData.targetUser.sex !== undefined) vParam.sex = $scope.orderData.targetUser.sex;
                if ($scope.orderData.targetUser.handType !== undefined) vParam.handType = $scope.orderData.targetUser.handType;
                if ($scope.orderData.targetUser.year !== undefined && $scope.orderData.targetUser.year !== '' && $scope.orderData.targetUser.month !== '' && $scope.orderData.targetUser.year !== '')
                    vParam.birthday = $scope.orderData.targetUser.year + '-' + $scope.orderData.targetUser.month + '-' + $scope.orderData.targetUser.date;

                if ($scope.orderData.targetUser.regNo !== undefined) vParam.regNo = $scope.orderData.targetUser.regNo;
                if ($scope.orderData.targetUser.diagnosis !== undefined) vParam.diagnosis = $scope.orderData.targetUser.diagnosis;
                if ($scope.orderData.targetUser.inciyear !== undefined && $scope.orderData.targetUser.inciyear !== '' && $scope.orderData.targetUser.incimonth !== '' && $scope.orderData.targetUser.incidate !== '')
                    vParam.inciDate = $scope.orderData.targetUser.inciyear + '-' + $scope.orderData.targetUser.incimonth + '-' + $scope.orderData.targetUser.incidate;

                if ($scope.orderData.targetUser.eduYear !== undefined) vParam.eduYear = $scope.orderData.targetUser.eduYear;
                if ($scope.orderData.targetUser.aphasiaType !== undefined) vParam.aphasiaType = $scope.orderData.targetUser.aphasiaType;
                if ($scope.orderData.targetUser.initialAQ !== undefined) vParam.initialAQ = $scope.orderData.targetUser.initialAQ;
                if ($scope.orderData.targetUser.Job !== undefined) vParam.Job = $scope.orderData.targetUser.Job;

            } else if ($scope.orderData.flag === 1 || $scope.orderData.flag === 3) {
                if ($scope.orderData.targetUser.department !== undefined) vParam.department = $scope.orderData.targetUser.department;
            }

            $http.post(lrpServer + $scope.orderData.url, vParam).
            success(function() {
                $ionicPopup.alert({
                    title: '승인',
                    content: '승인되었습니다.'
                });

                callbackChecker($scope.orderData.reload);
            }).
            error(function(data, status) {
                $ionicPopup.alert({
                    title: '실패',
                    content: '(Error Code : ' + status + ') ' + data.message
                });
            }).then(function() {
                $scope.userFormPopoverClose();
            });
        };

        $scope.userFormPopoverClose = function() {
            $scope.loadDataGet($scope.orderData.reload);

            $scope.orderData = null;
            $scope.userFormPopover.hide();
        };

        $scope.selectListOpenManager = function(flag) {
            var vParm = null;

            switch (flag) {
                case 0:
                    $scope.orderData = {
                        tag: '환자 배정',
                        template: './templates/Include_SelectList_AllocateFair.html'
                    };

                    vParm = { url: 'patient/list', dataSetter: 'patientList' };
                    break;

                case 1:
                    $scope.orderData = {
                        tag: '평가자 선택',
                        template: './templates/Include_List_Therapist.html'
                    };

                    vParm = { url: 'therapist/list', dataSetter: 'therapistList' };
                    break;

                case 2:
                    $scope.orderData = {
                        tag: '공식검사 자료입력',
                        template: './templates/Include_SelectList_OfficialDataNew.html'
                    };

                    $scope.lrpModel.tempDataPopover = {
                        selectedOfficialTest: null,
                        value: null
                    };

                    vParm = { url: 'officialtesttemplates', dataSetter: 'tempDataListPopover' };
                    break;

                case 3:
                    $scope.orderData = {
                        tag: '개별평가 선택',
                        template: './templates/Include_List_Individual.html'
                    };

                    vParm = { url: 'tasks/list', dataSetter: 'taskList' };
                    $scope.lrpModel.selectedHomework = null;
                    break;

                case 4:
                    $scope.orderData = {
                        tag: '구성평가 선택',
                        template: './templates/Include_List_Protocol.html'
                    };

                    vParm = { url: 'protocols/', dataSetter: 'protocolList' };
                    $scope.lrpModel.selectedHomework = null;
                    break;

                case 5:
                    $scope.orderData = {
                        tag: '구성평가 생성',
                        template: './templates/Include_SelectList_ProtocolNew.html'
                    };

                    $scope.lrpModel.tempDataPopover = { name: '' };
                    $scope.selectListPopover.show(window.event);
                    return;
                    //break;

                case 6:
                    $scope.orderData = {
                        tag: '템플릿 작성',
                        template: './templates/Include_SelectList_TemplateNew.html'
                    };

                    $scope.lrpModel.tempDataPopover = { name: '', content: '' };
                    $scope.selectListPopover.show(window.event);
                    return;
                    //break;

                case 7:
                    $scope.orderData = {
                        tag: '템플릿 선택',
                        template: './templates/Include_List_ProgressTemplate.html'
                    };

                    $scope.lrpModel.tempDataPopover = null;
                    vParm = { url: 'progressTemplates/list/' + $scope.lrpModel.userData._id, dataSetter: 'templateList' };
                    break;

                case 8:
                    $scope.orderData = {
                        tag: '구성평가',
                        template: './templates/Include_SelectList_ProtocolAssemble.html'
                    };

                    $scope.lrpModel.tempDataPopover = null;
                    vParm = { url: 'tasks/list', dataSetter: 'tempDataListPopover', callback: $scope.previewProtocolAssemble };
                    break;

                case 9:
                    if ($scope.lrpModel.statePage === 0 || $scope.lrpModel.statePage === 1) return;

                    $scope.orderData = {
                        tag: '평가자 선택',
                        template: './templates/Include_List_Patient.html'
                    };

                    vParm = { url: 'patient/list', dataSetter: 'patientList' };
                    break;

                default:
                    return;
            }

            $scope.loadDataGet(vParm);

            $scope.selectListPopover.show(window.event);
        };

        //for Exercise
        $scope.endExercise = function() {
            $scope.lrpModel.isMenuOff = true;
            $scope.menuActivate($scope.lrpModel.backState);
        };

        $scope.endExerciseAsk = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: '중단합니다.',
                template: '중단시 결과는 기록되지 않습니다.'
            });
            confirmPopup.then(function(res) {
                if (res) { //삭제
                    $scope.endExercise();
                } else { //취소

                }
            });
        };

        
        //dddddd start
        var isShapeDraw = false;

        $scope.makeShape2 = function()
        {
            // alert("2222");
            isShapeDraw = true;
            // var shapeTeype = "1";
            
            // $scope.pad.makeShapeDD($scope.shapeName, $scope.shape_count);
            $scope.pad.makeDraw2_reset();
        }

        $scope.shape_count = 1;

        $scope.dddd_count = function(flag) {
            var dd = $scope.shape_count;
            dd = Number(dd);
            
            if(flag=="up"){
                dd++;
                
            }else {
                dd--;                
            }
            $scope.shape_count= dd;

            if(isShapeDraw){
                $scope.makeShape();
            }
            //dddd3_make($scope.shape_count);
        }
        
        $scope.shapeName = "rect";

        $scope.shapeChange = function(shape ) {
            $scope.shapeName = shape;
            
            // alert("dddddw"+$scope.shapeName);
            
            if(isShapeDraw){
                $scope.makeShape();
            }
        }

        
        $scope.initDrawingPad = function(vw = 0.5, vh = 0.7, lock = false, drawType) {
            var el = document.getElementById('sketchpad');
            var aspectRatio = (window.innerHeight * vh) / (window.innerWidth * vw);
            var opts = {
                aspectRatio: aspectRatio,
                width: window.innerWidth * vw,
                //width: el.clientWidth * vw,
                stretch: true,
                keepRatio: true,
                drawingLock: lock,
                line: {
                    size: 3
                }
            }
            console.log("Sketchpad="+JSON.stringify(opts));

            var pad = new Sketchpad(el, opts, drawType);

            $scope.el = el;
            $scope.pad = pad;
            $scope.vw = vw;
            $scope.vh = vh;
            $scope.aspectRatio = aspectRatio;

        }

        $scope.dpUndo = function() {
            $scope.pad.undo();
        }

        $scope.dpWhite = function() {
            $scope.pad.setLineColor('#FFF');
            $scope.pad.setLineSize('20');
        }

        $scope.dpBlack = function() {
            $scope.pad.setLineColor('#000');
            $scope.pad.setLineSize('3');
        }

        $scope.dpRed = function() {
            $scope.pad.setLineColor('#FF0000');
            $scope.pad.setLineSize('3');
        }

        $scope.dpBlue = function() {
            $scope.pad.setLineColor('#0000FF');
            $scope.pad.setLineSize('3');
        }

        // 그리기 초기 설정.
        $scope.initDrawingPadAndLoad = function(vw = 0.5, vh = 0.7, bg = false, drawType) {
            $scope.initDrawingPad(vw, vh, true, drawType);
            
            // console.log("aaaa=" + $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[0].drawJson);

            // console.log("bbbb=" +  JSON.stringify( $scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[0].drawJson));

            
            $scope.pad.loadJSON(JSON.parse($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[0].drawJson));
            
            
            if (bg) {
                console.log($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[0]);
                drawingPadUtil.loadBackgroundGrading($scope, true);
                //$scope.pad.setBackground($scope.lrpModel.selectedResult.tasks[$scope.lrpModel.taskPivot].problems[0].refProblem.res[0].value);
            }
        }

        $scope.playIndividual = function() {
            if ($scope.lrpModel.selectedTask.setSize === undefined || $scope.lrpModel.selectedTask.setSize === null || $scope.lrpModel.selectedTask.setSize < 1) return;

            $scope.lrpModel.selectedProtocol = {
                name: $scope.lrpModel.selectedTask.name,
                tasks: [{
                    taskID: { _id: $scope.lrpModel.selectedTask._id, name: $scope.lrpModel.selectedTask.name },
                    setNum: $scope.lrpModel.setNum
                }]
            };

            $scope.playProtocol();
        };

        $scope.playProtocol = function() {
            if ($scope.lrpModel.selectedProtocol.tasks.length < 1) return;

            if ($scope.lrpModel.selectedHomework !== null && $scope.lrpModel.statePage < 2 && $scope.listStateCode === 2) {
                $scope.lrpModel.selectedProtocol.refTakehome = $scope.lrpModel.selectedHomework._id;
            } else $scope.lrpModel.selectedProtocol.refTakehome = null;

            $scope.playExercise('app.play');
        };

        $scope.playReportPrint = function() {

            $scope.playExercise('app.resultPage');
        }

        $scope.playExercise = function(state) {
            if ($scope.lrpModel.selectedPatient === null) return;

            $scope.lrpModel.isMenuOff = false;
            $scope.lrpModel.backState = $scope.lrpModel.statePage;

            $state.go(state);
        };

        $scope.gradingExercise = function() {
            if ($scope.lrpModel.selectedPatient === null) return;

            $scope.lrpModel.isMenuOff = false;
            $scope.lrpModel.backState = $scope.lrpModel.statePage;

            $state.go('app.grading');
        };

        $scope.reportPrintForm = function() {
            $scope.lrpModel.isMenuOff = false;
            $scope.lrpModel.backState = $scope.lrpModel.statePage;
            $state.go('app.resultPage');
        };

        $scope.backPivot = function() {
            if ($scope.lrpModel.taskPivot < 1) return;

            $scope.lrpModel.taskPivot--;
        };

        $scope.frontPivot = function(length) {
            if ($scope.lrpModel.taskPivot >= length - 1) return;

            $scope.lrpModel.taskPivot++;
        };

        $scope.setPivot = function(pivot) {
            $scope.lrpModel.taskPivot = pivot;
        };

        $scope.setFontSize = function(obj, objflag) {
            if (objflag !== undefined && objflag > 1) return 80;
            if (obj.value.length < 7) return 80;

            var temp = Math.floor(1000 / obj.value.length);

            if (temp < 60) return 60;

            return temp;
        };

        $scope.homeworkDownload = function() {
            if ($scope.onDownLoading) return;

            $scope.onDownLoading = true;
            $scope.allDownLoad = 0;
            $scope.progressDownLoad = 0;

            $scope.lrpModel.taskPivot = 0;
            $scope.lrpModel.takehomePivot = 0;

            $scope.loadDataGet({
                url: 'takehomes/list/' + $scope.lrpModel.userData._id,
                dataSetter: 'homeworkList',
                callback: homeworkDownloadProtocalBinder,
                callbackArg: 0
            });
        };

        function homeworkDownloadProtocalBinder(pivot) {
            if (pivot != 0 && $scope.lrpModel.homeworkList[pivot - 1].isProtocol) {
                $scope.lrpModel.homeworkList[pivot - 1].tasks = $scope.lrpModel.selectedProtocol.tasks;
                $scope.lrpModel.homeworkList[pivot - 1].refTakehome = $scope.lrpModel.homeworkList[pivot - 1]._id;
                $scope.lrpModel.homeworkList[pivot - 1].isDone = false;
            }

            if (!($scope.lrpModel.homeworkList.length > pivot)) {
                $scope.lrpModel.taskPivot = 0;
                $scope.lrpModel.takehomePivot = 0;

                homworkBindTaskInfo(); //homeworkDownloadNext();
                return;
            }

            if ($scope.lrpModel.homeworkList[pivot].isProtocol) {
                $scope.loadDataGet({
                    url: 'protocols/' + $scope.lrpModel.homeworkList[pivot].protocol,
                    dataSetter: 'selectedProtocol',
                    callback: homeworkDownloadProtocalBinder,
                    callbackArg: pivot + 1
                });

                return;
            } else {
                $scope.lrpModel.homeworkList[pivot].refTakehome = $scope.lrpModel.homeworkList[pivot]._id;
                $scope.lrpModel.homeworkList[pivot].isDone = false;
                $scope.lrpModel.homeworkList[pivot].tasks = [{
                    setNum: $scope.lrpModel.homeworkList[pivot].setNum,
                    taskID: {
                        _id: $scope.lrpModel.homeworkList[pivot].task,
                        name: $scope.lrpModel.homeworkList[pivot].name
                    }
                }];
            }

            homeworkDownloadProtocalBinder(pivot + 1);
        }

        function homworkBindTaskInfo() {
            if (!($scope.lrpModel.homeworkList.length > $scope.lrpModel.takehomePivot)) {
                $scope.lrpModel.taskPivot = 0;
                $scope.lrpModel.takehomePivot = 0;

                homeworkDownloadNext();
                return;
            }

            if ($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks.length > $scope.lrpModel.taskPivot) {
                $scope.loadDataGet({
                    url: 'tasks/' + $scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks[$scope.lrpModel.taskPivot].taskID._id,
                    dataSetter: 'selectedTask',
                    callback: function() {
                        $scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks[$scope.lrpModel.taskPivot].taskID = $scope.lrpModel.selectedTask;
                        $scope.allDownLoad++;
                        $scope.lrpModel.taskPivot++;
                        homworkBindTaskInfo();
                    }
                });
            } else {
                $scope.lrpModel.taskPivot = 0;
                $scope.lrpModel.takehomePivot++;
                homworkBindTaskInfo();
            }
        }

        function homeworkDownloadNext() {
            if (!($scope.lrpModel.homeworkList.length > $scope.lrpModel.takehomePivot)) {
                console.log($scope.lrpModel.homeworkList);

                $ionicPopup.alert({
                    title: '완료',
                    content: '다운로드가 완료되었습니다.'
                });

                $scope.onDownLoading = false;
                $scope.allDownLoad = 0;
                $scope.progressDownLoad = 0;

                return;
            }

            //if ($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].isProtocol) {
            if ($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks.length > $scope.lrpModel.taskPivot) {
                homeworkDownloadTask($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks[$scope.lrpModel.taskPivot].taskID._id, $scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks[$scope.lrpModel.taskPivot].setNum);
                return;
            }
            /*} else {
             if ($scope.lrpModel.taskPivot === 0) {
             homeworkDownloadTask($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].task, $scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].setNum);
             return;
             }
             }*/

            //window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, onGetDir, onFail);
        }

        function onGetDir(dir) {
            $scope.lrpModel.appDir = dir;
            dir.getDirectory($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot]._id, { create: false }, onNextHomework, onGetDirCheck);
        }

        function onGetDirCheck() {
            if ($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].refResults.length > 0) {
                onNextHomework();
                return;
            }

            $scope.lrpModel.appDir.getDirectory($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot]._id, { create: true, exclusive: false }, onMakeDir, onFail);
        }

        function onMakeDir(dir) {
            $scope.lrpModel.homeworkDir = dir;
            $scope.lrpModel.taskPivot = 0;
            $scope.lrpModel.stagePivot = 0;
            $scope.lrpModel.resPivot = 0;

            fileDownload();
            //dir.getFile($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot]._id + ".txt", {create: true, exclusive: false}, onCreateFile, onFail);
        }

        function fileDownload() {
            if ($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks.length > $scope.lrpModel.taskPivot) {
                if ($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks[$scope.lrpModel.taskPivot].problems.length > $scope.lrpModel.stagePivot) {
                    if ($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks[$scope.lrpModel.taskPivot].problems[$scope.lrpModel.stagePivot].def.length + $scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks[$scope.lrpModel.taskPivot].problems[$scope.lrpModel.stagePivot].res.length > $scope.lrpModel.resPivot) {
                        var ft = new FileTransfer();

                        if ($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks[$scope.lrpModel.taskPivot].problems[$scope.lrpModel.stagePivot].def.length > $scope.lrpModel.resPivot) {
                            if ($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks[$scope.lrpModel.taskPivot].problems[$scope.lrpModel.stagePivot].def[$scope.lrpModel.resPivot].resType === "file") {
                                ft.download($scope.lrpServer + 'uploads/' + $scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks[$scope.lrpModel.taskPivot].problems[$scope.lrpModel.stagePivot].def[$scope.lrpModel.resPivot].value, $scope.lrpModel.homeworkDir.nativeURL + $scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks[$scope.lrpModel.taskPivot].problems[$scope.lrpModel.stagePivot].def[$scope.lrpModel.resPivot].value, fileDownloadNext, onFail, true);

                                return;
                            }
                        } else {
                            if ($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks[$scope.lrpModel.taskPivot].problems[$scope.lrpModel.stagePivot].res[$scope.lrpModel.resPivot - ($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks[$scope.lrpModel.taskPivot].problems[$scope.lrpModel.stagePivot].def.length)].resType === "file") {
                                ft.download($scope.lrpServer + 'uploads/' + $scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks[$scope.lrpModel.taskPivot].problems[$scope.lrpModel.stagePivot].res[$scope.lrpModel.resPivot - ($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks[$scope.lrpModel.taskPivot].problems[$scope.lrpModel.stagePivot].def.length)].value, $scope.lrpModel.homeworkDir.nativeURL + $scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks[$scope.lrpModel.taskPivot].problems[$scope.lrpModel.stagePivot].res[$scope.lrpModel.resPivot - ($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks[$scope.lrpModel.taskPivot].problems[$scope.lrpModel.stagePivot].def.length)].value, fileDownloadNext, onFail, true);

                                return;
                            }
                        }

                        $scope.lrpModel.resPivot++;
                        fileDownload();
                    } else {
                        $scope.lrpModel.resPivot = 0;
                        $scope.lrpModel.stagePivot++;
                        fileDownload();
                    }
                } else {
                    $scope.lrpModel.resPivot = 0;
                    $scope.lrpModel.stagePivot = 0;
                    $scope.lrpModel.taskPivot++;
                    fileDownload();
                }
            } else {
                $scope.lrpModel.resPivot = 0;
                $scope.lrpModel.stagePivot = 0;
                $scope.lrpModel.taskPivot = 0;

                $scope.lrpModel.homeworkDir.getFile($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot]._id + ".txt", { create: true, exclusive: false }, onCreateFile, onFail);
            }
        }

        function fileDownloadNext() {
            $scope.lrpModel.resPivot++;
            fileDownload();
        }

        function onCreateFile(file) {
            file.createWriter(onWirteFile, onFail);
        }

        function onWirteFile(fileWriter) {
            fileWriter.write(JSON.stringify($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot]));

            onNextHomework();
        }

        function onNextHomework() {
            $scope.progressDownLoad += $scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks.length;

            $scope.lrpModel.taskPivot = 0;
            $scope.lrpModel.takehomePivot++;

            homeworkDownloadNext();
        }

        function onFail(err) {
            console.log(err);
        }

        function homeworkDownloadTask(taskID, setNum) {
            $scope.loadDataPost({
                url: 'problems/list',
                vParam: {
                    taskID: taskID,
                    setNum: setNum
                },
                dataSetter: 'selectedProblemSet',
                callback: setProblemListDownload
            });
        }

        function setProblemListDownload() {
            alert("setProblemListDownload");
            $scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks[$scope.lrpModel.taskPivot].problems = $scope.lrpModel.selectedProblemSet;

            //console.log($scope.lrpModel.homeworkList[$scope.lrpModel.takehomePivot].tasks[$scope.lrpModel.taskPivot]);

            $scope.lrpModel.taskPivot++;
            homeworkDownloadNext();
        }

        $scope.selectOffline = function(homework) {
            console.log(homework);

            $scope.lrpModel.selectedPatient = {
                _id: homework.patient,
                name: '오프라인'
            }

            $scope.lrpModel.selectedProtocol = homework;

            if (homework.isDone) {
                /*
                window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
                    dir.getDirectory(homework._id, {create: false}, function(resultDir) {
                        resultDir.getFile(homework._id + "_result.txt", {create: false}, onGetResultFile, onFail);
                    }, onFail);
                }, onFail);
                */
            } else {
                $scope.playExercise('app.playOffline');
            }
        };

        function onGetResultFile(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    console.log(evt);
                    $scope.lrpModel.selectedResult = JSON.parse(evt.target.result);
                    $scope.playExercise('app.gradingOffline');
                };
                reader.onerror = onFail;

                reader.readAsText(file);
            }, onFail);
        }

        //Init Execute
        $scope.initLRP();

        if ($scope.userData === undefined || $scope.userData === null) $state.transitionTo('app.login');
    })
    .controller('LoginCtrl', function($scope, $http, $cookies, $ionicPopup) {
        $scope.loginData = { username: '', password: '' };
        $scope.logOnMsg = '';
        $scope.loginModel = { autoUserName: false, autoLogin: false };
        //$scope.loginModel.autoUserName = false;
        //$scope.loginModel.autoLogin = false;

        $scope.loginModel.autoUserName = window.localStorage.getItem("autoUserName") === '1';
        $scope.loginModel.autoLogin = window.localStorage.getItem("autoLogin") === '1';
        $scope.loginData.username = window.localStorage.getItem("cookieUserName");
        $scope.loginData.password = window.localStorage.getItem("cookieUserFire");

        $scope.logonInclude = './templates/Include_Login_First.html';

        $scope.lrpModel.isMenuOff = false;

        if ($scope.userData !== undefined && $scope.userData !== null) {
            $http.get($scope.lrpServer + "auth/signout");
            $scope.lrpModel.userData = null;
        }

        $scope.initLRP();
        $scope.lrpModel.isMenuToggle = false;

        /*
        $http.get($scope.lrpServer + 'centers/').
        success(function(data) {
            $scope.lrpModel.centers = data;
        }).
        error(function (data, status) { console.log('Error : loadDataPost : ' + lrpServer + obParam.url + ' =>(' + obParam.dataSetter + ' : ' + obParam.callback + ') ! status : ' + status); });
        */

        $scope.loginData = { username: 'admin', password: 'rhfueo!' };
        //$scope.loginData = { username: 'testpatient', password: 'rhfueo!' };
        
        $scope.doLogin = function() {

            //console.log($scope.loginModel.autoUserName);

            if ($scope.loginModel.autoLogin) {
                window.localStorage.setItem('autoUserName', '1');
                window.localStorage.setItem('autoLogin', '1');
                window.localStorage.setItem('cookieUserName', $scope.loginData.username);
                window.localStorage.setItem('cookieUserFire', $scope.loginData.password);

                console.log('1');
            } else if ($scope.loginModel.autoUserName) {
                window.localStorage.setItem('autoUserName', '1');
                window.localStorage.setItem('autoLogin', '');
                window.localStorage.setItem('cookieUserName', $scope.loginData.username);
                window.localStorage.setItem('cookieUserFire', '');

                console.log('2');
            } else {
                window.localStorage.setItem('autoUserName', '');
                window.localStorage.setItem('autoLogin', '');
                window.localStorage.setItem('cookieUserName', '');
                window.localStorage.setItem('cookieUserFire', '');

                console.log('3');
            }

            $http.post($scope.lrpServer + "auth/signin", $scope.loginData).
            success(function(data, status) {
                if (status == 400) { //서버와 연결은 되었지만, 로그인은 오류
                    $scope.logOnMsg = data.message;
                    return;
                }

                //$scope.setUserData(data);
                $scope.lrpModel.userData = data;

                console.log(data);

                if ($scope.lrpModel.userData === undefined || $scope.lrpModel.userData === null) return;

                delete $scope.logOnMsg;
                delete $scope.autoUserName;
                delete $scope.autoLogin;
                delete $scope.loginData.username;
                delete $scope.loginData.password;
                delete $scope.loginData;

                //window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, onGetDataDir, onFail);

                setLogin();
            }).
            error(function(data, status, header, config, statusText) {
                $scope.logOnMsg = data.message;
                /*
                console.log(status);

                $ionicPopup.alert({
                    content: data.message
                });
                */
            });
        };

        function onFail(error) {
            console.log(error);
        }

        var offlineTaskCount = 0;

        function onGetDataDir(dir) {
            $scope.lrpModel.homeworkList = [];
            offlineTaskCount = 0;

            var directoryReader = dir.createReader();
            directoryReader.readEntries(function(dirs) {
                $scope.lrpModel.homeworkList = {};
                var i = 0,
                    check = true;
                for (; i < dirs.length; i++) {
                    check = check && dirs[i].isFile;
                    if (!dirs[i].isFile) {
                        $scope.lrpModel.homeworkList[dirs[i].name] = dirs[i];
                        dirs[i].getFile(dirs[i].name + '.txt', { create: false }, function(fileEntry) {
                            fileEntry.file(function(file) {
                                var reader = new FileReader();
                                reader.onloadend = onFileload;
                                reader.onerror = onFail;
                                reader.readAsText(file);
                            }, onFail);
                        }, onFail);
                    }
                }``

                if (check) setLogin();
            }, onFail);
        }

        function setLogin() {
            var arg = null;
            if ($scope.lrpModel.userData.roles == 'admin')
                arg = 0;
            else if ($scope.lrpModel.userData.roles == 'therapist')
                arg = 1;
            else if ($scope.lrpModel.userData.roles == 'patient')
                arg = 2;

            $scope.lrpModel.isMenuToggle = false;
            $scope.lrpModel.isMenuOff = true;

            $scope.menuActivate(arg);
        }

        function onProcessHomework() {
            offlineTaskCount++;

            if ($scope.lrpModel.homeworkList === null || $scope.lrpModel.homeworkList.length === 0 || !($scope.lrpModel.homeworkList.length > offlineTaskCount)) {
                if ($scope.lrpModel.homeworkList !== null) {
                    for (var dir in $scope.lrpModel.homeworkList) {
                        console.log($scope.lrpModel.homeworkList[dir]);
                        $scope.lrpModel.homeworkList[dir].removeRecursively(function(p) {
                            console.log(p);
                        }, onFail);
                    }
                    $scope.lrpModel.homeworkList = null;
                }

                setLogin();
            }
        }

        function onFileload(evt) {
            var task = JSON.parse(evt.target.result);

            if (!task.isDone) {
                onProcessHomework();
                return;
            }

            $scope.lrpModel.homeworkList[task._id].getFile(task._id + '_result.txt', { create: false }, function(fileEntry) {
                fileEntry.file(function(file) {
                    var reader = new FileReader();
                    reader.onloadend = function(evt) {
                        var tempResult = JSON.parse(evt.target.result);

                        $scope.lrpModel.resultList = [];

                        var i = 0,
                            j = 0,
                            counter = 0;
                        for (; tempResult.tasks.length > i; i++) {
                            if (tempResult.tasks[i].answerType === 'record') {
                                for (j = 0; tempResult.tasks[i].problems.length > j; j++) {
                                    counter++;

                                    var options = new FileUploadOptions();
                                    options.fileKey = "file";
                                    options.fileName = tempResult.tasks[i].problems[j].recordFile.substr(tempResult.tasks[i].problems[j].recordFile.lastIndexOf('/') + 1);
                                    options.mimeType = "audio/3gp";

                                    var ft = new FileTransfer();
                                    ft.upload(tempResult.tasks[i].problems[j].recordFile, encodeURI($scope.lrpServer + "uploads/"),
                                        function(r) {
                                            var obj = JSON.parse(r.response);
                                            $scope.lrpModel.resultList[obj.file.originalname] = obj.file.name;

                                            counter--;
                                            if (counter === 0) {
                                                for (var k = 0; tempResult.tasks.length > k; k++) {
                                                    if (tempResult.tasks[k].answerType === 'record') {
                                                        for (var h = 0; tempResult.tasks[k].problems.length > h; h++) {
                                                            tempResult.tasks[k].problems[h].recordFile = $scope.lrpModel.resultList[tempResult.tasks[k].problems[h].refProblem + '.mp3'];
                                                        }
                                                    }
                                                }

                                                onEndHope({
                                                    json: JSON.stringify(tempResult),
                                                    patientID: task.patient
                                                });
                                            }

                                        },
                                        function(error) {
                                            console.log(error);
                                            counter--;

                                            if (counter === 0) {
                                                for (var k = 0; tempResult.tasks.length > k; k++) {
                                                    if (tempResult.tasks[k].answerType === 'record') {
                                                        for (var h = 0; tempResult.tasks[k].problems.length > h; h++) {
                                                            tempResult.tasks[k].problems[h].recordFile = $scope.lrpModel.resultList[tempResult.tasks[k].problems[h].refProblem + '.mp3'];
                                                        }
                                                    }
                                                }

                                                onEndHope({
                                                    json: JSON.stringify(tempResult),
                                                    patientID: task.patient
                                                });
                                            }
                                        }, options, true);
                                }
                            }
                        }

                        if (counter === 0) {
                            for (; tempResult.tasks.length > i; i++) {
                                if (tempResult.tasks[i].answerType === 'record') {
                                    for (j = 0; tempResult.tasks[i].problems.length > j; j++) {
                                        tempResult.tasks[i].problems[j].recordFile = $scope.lrpModel.resultList[tempResult.tasks[i].problems[j].refProblem + '.mp3'];
                                    }
                                }
                            }

                            onEndHope({
                                json: JSON.stringify(tempResult),
                                patientID: task.patient
                            });
                        }
                    };

                    reader.readAsText(file);

                }, onFail);
            }, onFail);
        }

        function onEndHope(vParam) {
            $scope.loadDataPost({
                url: 'results/insert/',
                vParam: vParam,
                callback: onProcessHomework
            });
        }

        $scope.go_terms = function() {
            $scope.logonInclude = './templates/Include_Login_Terms.html';
        }

        $scope.go_signup = function() {
            $http.get($scope.lrpServer + 'centers/').
            success(function(data) {
                $scope.lrpModel.centers = data;
                $scope.logonInclude = './templates/Include_Login_Join.html';
            }).
            error(function(data, status) { console.log('Error : loadDataPost : ' + lrpServer + obParam.url + ' =>(' + obParam.dataSetter + ' : ' + obParam.callback + ') ! status : ' + status); });
        };

        $scope.go_findpassword = function() {
            $scope.logonInclude = './templates/Include_Login_Find.html';
        };

        $scope.joinData = {
            role: "therapist",
            name: '',
            email: '',
            sex: 'male',
            passOri: '',
            passChk: '',
            year: '',
            month: '',
            date: ''
        };

        $scope.cancleAndGoLogin = function() {
            delete $scope.joinData;

            $scope.logonInclude = './templates/Include_Login_First.html';
        };

        $scope.findAccount_email = function() {
            $ionicPopup.alert({
                title: '개발중', //'발송',
                content: '이메일을 통한 계정 찾기' //'이메일로 발송 하였습니다.'
            });

            $scope.cancleAndGoLogin();
        };

        $scope.makeSignup = function() {
            if ($scope.joinData.passChk !== $scope.joinData.passOri) {
                $ionicPopup.alert({
                    title: '확인',
                    content: '비밀번호/확인이 서로 다릅니다.'
                });

                return;
            }

            var signUpData = {
                username: $scope.joinData.username,
                name: $scope.joinData.name,
                password: $scope.joinData.passChk,
                email: $scope.joinData.email,
                roles: [$scope.joinData.role],
                sex: $scope.joinData.sex,
                center: $scope.joinData.center
            };

            if ($scope.joinData.role === 'therapist')
                signUpData.department = $scope.joinData.department;
            else if ($scope.joinData.role === 'patient' && $scope.joinData.year !== undefined && $scope.joinData.year !== '' && $scope.joinData.month !== undefined && $scope.joinData.month !== '' && $scope.joinData.date !== undefined && $scope.joinData.date !== '')
                signUpData.birthday = $scope.joinData.year + '-' + $scope.joinData.month + '-' + $scope.joinData.date;

            $http.post($scope.lrpServer + "auth/signup", signUpData).
            success(function(data, status) {
                if (status == 400) {
                    return;
                }

                $ionicPopup.alert({
                    title: '등록',
                    content: '사용자로 등록 되었습니다.'
                });

                $scope.cancleAndGoLogin();
            }).
            error(function(data) {
                $ionicPopup.alert({
                    title: '등록 실패',
                    content: data.message
                });
            });
        };

        /*
         $scope.stringByteLength = function(s,b,i,c) {
         for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
         return b
         };
         */

        $scope.go_offlineMode = function() {
            function onGetDirectorySuccess(dir) {
                $scope.lrpModel.homeworkList = [];

                var directoryReader = dir.createReader();
                directoryReader.readEntries(onGetDir, onFail);
            }

            function onGetDir(dirs) {
                var i;
                for (i = 0; i < dirs.length; i++) {
                    if (!dirs[i].isFile) dirs[i].getFile(dirs[i].name + '.txt', { create: false }, onGetFileEntry, onFail);
                }
            }

            function onGetFileEntry(fileentry) {
                fileentry.file(onGetFile, onFail);
            }

            function onGetFile(file) {
                var reader = new FileReader();
                reader.onloadend = onFileload;
                reader.onerror = onFail;

                reader.readAsText(file);
            }

            function onFileload(evt) {
                //console.log(evt.target.result);
                $scope.lrpModel.homeworkList.push(JSON.parse(evt.target.result));
            }

            function success(entries) {
                $scope.lrpModel.homeworkList = entries;
            }

            function onFail(error) {
                console.log(error);
            }

            $scope.lrpModel.userData = {
                name: '오프라인',
                username: 'OfflineUser'
            };

            //window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, onGetDirectorySuccess, onFail);

            $scope.lrpModel.isMenuToggle = false;
            $scope.lrpModel.isMenuOff = true;

            $scope.menuActivate(5);
        };
    })
    .controller('Ctrl_List', function($scope, $state, $ionicGesture, $timeout) {
        var lockyou = true;
        var element = angular.element(document.querySelector('#lrpOuterList'));

        if ($scope.lrpModel.userData === null) $state.transitionTo('app.login');

        $ionicGesture.on('dragleft', function() { //event) {
            $scope.$apply(function() {
                if (lockyou) {
                    lockyou = !lockyou;
                    $scope.prevState();
                    $timeout(function() {
                        lockyou = true;
                    }, 500);
                }
            });
        }, element);
    });