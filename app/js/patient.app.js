var app = angular.module('chatbox', ['mobiscroll-datetime', 'mobiscroll-form']);
app.controller('PatientChatController', ['$scope', '$http', '$filter', '$log', '$timeout', '$sce',
    function ($scope, $http, $filter, $log, $timeout, $sce) {
        var Id = sessionStorage.username;
        var selectedUrl = sessionStorage.Environment;

        /* if (Id == undefined || Id == null || Id == "redirect") {
             location.href = "./index.html";
             return false;
         }*/

        /*speech synthesis*/
        $scope.speechStatus = "";
        var msg = new SpeechSynthesisUtterance();
        var voices = window.speechSynthesis.getVoices();
        msg.voice = voices[10];
        //console.log(window.speechSynthesis.getVoices()) ;// Note: some voices don't support altering params
        msg.voiceURI = 'हिन्दी';
        msg.volume = 1; // 0 to 1
        msg.rate = 1; // 0.1 to 10
        msg.pitch = 1; //0 to 2
        msg.text = 'Hello' + Id + ',Welcome to Napier Assistant ,How can I assist you?';
        msg.lang = 'en-IN';

        $scope.speechStatus = false;
        $scope.init = function () {
            $scope.sttstatus = false;

        }
        $scope.changeStatus = function () {
            $scope.sttstatus = !$scope.sttstatus;
            $scope.speechStatus = $scope.sttstatus;
        }
        msg.onend = function (e) {
            console.log('Finished in' + event.elapsedTime + 'seconds.');
        };



        //:::::::::::::::URL DECLARATION::::::::::::::
        $scope.logoutUrl = "http://10.5.6.92:8081/ChatBot/app/clearCache";
        $scope.resetUrl = "http://10.5.6.92:8081/ChatBot/app/resetChat";
        $scope.chatResponseURL = "http://10.5.6.15:8080/ChatBot/patientPortal/chatResponse";
        //     $scope.newLoginUrl = "http://10.5.6.15:8080/ChatBot/patientPortal/patientLogin"
        //::::::::::::Speech Accent:::::::::::
        $scope.array = [{
                'value': 'en-US',
                'label': 'English (United States)'
        },
            {
                'value': 'en-AU',
                'label': 'English (Australia)'
        },
            {
                'value': 'en-CA',
                'label': 'English (Canada)'
        },
            {
                'value': 'en-GH',
                'label': 'English (Ghana)'
        },
            {
                'value': 'en-GB',
                'label': 'English (Great Britain)'
        },
            {
                'value': 'en-IN',
                'label': 'English (India)'
        },
            {
                'value': 'en-IE',
                'label': 'English (Ireland)'
        },
            {
                'value': 'en-KE',
                'label': 'English (Kenya)'
        },
            {
                'value': 'en-NZ',
                'label': 'English (New Zealand)'
        },
            {
                'value': 'en-NG',
                'label': 'English (Nigeria)'
        },
            {
                'value': 'en-PH',
                'label': 'English (Philippines)'
        },
            {
                'value': 'en-ZA',
                'label': 'English (South Africa)'
        },
            {
                'value': 'en-TZ',
                'label': 'English (Tanzania)'
        }
        ];
        // $scope.val = "Napier";

        $scope.isMicOn = true;
        $scope.micImgId = "";
        $scope.check = true; //distinguish b/w bot and user

        /*auto send*/
        $scope.autoSendText = true;
        $scope.initial = function () {
            $scope.autoSendstatus = true;
        }
        $scope.autoSend = function () {
            $scope.autoSendstatus = !$scope.autoSendstatus;
            $scope.autoSendText = $scope.autoSendstatus;
        }
        msg.onend = function (e) {
            console.log('Finished in' + event.elapsedTime + 'seconds.');
        };



        $scope.chats = [{
            "person": false,
            "userMsg": "Welcome."
        }];
        $scope.chats.push({
            "person": false,
            "userMsg": "How can I assist you ?"
        });
        $scope.enter = function ($event) {
            var keyCode = $event.which || $event.keyCode;
            if (keyCode == 13) {
                $event.preventDefault();
                $scope.insert();
            }
        };
        //formReply::::function reply is binded from the form value
        // $scope.formReply = function (reply) {
        //     var dataObj = {
        //         userMsg: reply,
        //         userId: Id,
        //         userUrl: selectedUrl
        //     };
        //     var config = {
        //         headers: {
        //             'Content-Type': 'application/json;charset=UTF-8'
        //         }
        //     }

        //     $http.post($scope.PostUrl, JSON.stringify(dataObj)).then(function (response) {
        //         debugger
        //         if (response.data)
        //             $scope.key = response.data.nodeKey;
        //         $scope.buttonKey = response.data.buttonKey;
        //         $scope.tokenValidation = response.data.errorCode;
        //         $scope.msg = response.data.response;
        //         $scope.dropdown1 = response.data.dropDown1;
        //         $scope.dropdown2 = response.data.dropDown2;
        //         $scope.dropdown3 = response.data.dropDown3;

        //         $scope.typing = false;
        //         if ($scope.tokenValidation == "1050") {
        //             alert("Session Expired");
        //             return false;
        //         }
        //         if ($scope.msg == null) {
        //             return false;
        //         }  else {        
        //             if ($scope.speechStatus == true) {
        //                 msg.text = $scope.msg;
        //                 speechSynthesis.speak(msg);
        //             }
        //             $scope.chats.push({
        //                 "person": false,
        //                 "userMsg": $scope.msg
        //             })

        //             $timeout(function () {
        //                 var scroller = document.getElementById("autoscroll");
        //                 scroller.scrollTop = scroller.scrollHeight;
        //             }, 0, false);
        //         }

        //     },
        //         function (response) {
        //             $scope.msg = "Service not Exists";
        //             $scope.statusval = response.status;
        //             $scope.statustext = response.statusText;
        //             $scope.headers = response.headers();
        //         })

        // }

        //voice speech control//
        $scope.placeHolder = "";
        $scope.speechRecognizer = "";
        $scope.recordState = "";
        $scope.audioButtonClick = function () {
            if ($scope.recordState == "recording") {
                $scope.stopRecording();
            } else {
                $scope.startRecording();
            }
        }

        $scope.startRecording = function () {
            $scope.micImgId = document.getElementById('micID');
            $scope.recordState = "recording";
            $scope.speechRecognizer = new webkitSpeechRecognition();
            $scope.speechRecognizer.continuous = false;
            $scope.speechRecognizer.interimResults = true;
            $scope.speechRecognizer.onerror = function (event) {
                micImgId.src = "./images/micStopImg.jpg"
                alert('This browser does not support speech plugins. Try to run on Google Chrome browser using https:')
                console.log('error!');

            };
            $scope.speechRecognizer.onend = function () {
                console.log("speech is ended");
                while ($scope.autoSendText == true) {
                    if ($scope.inputValue == "" || $scope.inputValue == undefined) {
                        return false;
                    } else {
                        $scope.insert($scope.inputValue);
                        $timeout(function () {
                            var scroller = document.getElementById("autoscroll");
                            scroller.scrollTop = scroller.scrollHeight;
                        }, 0, false);
                    }
                    $scope.isMicOn = true;
                    $scope.micImgId.src = "./images/micStopImg.jpg";
                    $scope.placeHolder.placeholder = "Type your text here...";
                }
                $scope.isMicOn = true;
                $scope.micImgId.src = "./images/micStopImg.jpg";
                $scope.placeHolder.placeholder = "Type your text here...";
            }
            $scope.placeHolder = document.getElementById('message');
            $scope.placeHolder.placeholder = "Speak now...";
            $scope.micImgId.src = "./images/micStartImg.jpg";
            $scope.STTVal = $scope.mySelection.value;
            $scope.speechRecognizer.lang = $scope.STTVal;
            $scope.speechRecognizer.start();
            $scope.isMicOn = true;
            $scope.finalTranscripts = '';

            $scope.speechRecognizer.onresult = function (event) {
                $scope.interimTranscripts = '';
                for (var i = event.resultIndex; i < event.results.length; i++) {
                    $scope.interimTranscripts = '';
                    $scope.transcript = event.results[i][0].transcript;
                    $scope.transcript.replace("\n", "<br>");
                    if (event.results[i].isFinal) {
                        $scope.finalTranscripts = $scope.transcript;
                    } else {
                        $scope.interimTranscripts += $scope.transcript;
                    }
                }
                $scope.inputValue = $scope.finalTranscripts + $scope.interimTranscripts;
                $scope.interimTranscripts = "";
                $scope.finalTranscripts = "";
                $scope.safeApply();
            }
        }

        $scope.safeApply = function (fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof (fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        }
        $scope.stopRecording = function () {
            $scope.recordState = "stopped";
            if ($scope.inputValue == "" || $scope.inputValue == undefined) {
                return false;
            } else {
                $scope.insert($scope.inputValue);
                $timeout(function () {
                    var scroller = document.getElementById("autoscroll");
                    scroller.scrollTop = scroller.scrollHeight;
                }, 0, false);
            }
            $scope.micImgId.src = "./images/micStopImg.jpg"
            $scope.placeHolder.placeholder = "Type your text here..."
            if ($scope.isMicOn == true) {
                $scope.inputValue = null;
            }
        }
        $scope.inDetailResFun = function () {
            var botArray = $scope.inDetailResponse.split("###@@@")
            var botMsg = "";
            var i;
            //for (i = 0; i < cars.length; i++)
            for (i = 0; i < botArray.length; i++) {
                /* 	if(i!=botArray.length-1){
                    botMsg=botMsg.concat(botArray[i]+ "\r\n");
                    }
                    else{
                    botMsg=botMsg.concat(botArray[i]);
                    } */
                $scope.chats.push({
                    "person": false,
                    "userMsg": botArray[i]
                })
            }
            $scope.isInDetail = false;
        }
        $scope.insert = function (inputValue) {
            $scope.isInDetail = false;
            if (/\breset\b/g.test($scope.inputValue)) {
                $scope.autoSendText = false;
                $scope.reset();

            }
            if (/\blog out\b/g.test($scope.inputValue) || /\blogout\b/g.test($scope.inputValue)) {
                $scope.autoSendText = false;
                $scope.logout();

            }

            var userVal = inputValue;
            if (userVal === null || userVal === undefined) {
                return false;
            } else {
                $scope.typing = false;
                $scope.chats.push({
                    "person": $scope.check,
                    "userMsg": userVal
                })
                $timeout(function () {
                    var scroller = document.getElementById("autoscroll");
                    scroller.scrollTop = scroller.scrollHeight;
                }, 0, false);
                $scope.typing = true;
                var dataObj = {
                    patMessage: userVal,

                };
                var config = {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }

                $http.post($scope.chatResponseURL, JSON.stringify(dataObj)).then(function (response) {

                        if (response.data)
                            $scope.msg = response.data.responseText;
                        //$scope.key = response.data.nodeKey;
                        $scope.tokenValidation = response.data.errorCode;
                        // $scope.buttonKey = response.data.buttonKey;
                        $scope.typing = false;
                        $scope.inDetailResponse = response.data.inDetailResponse;


                        if ($scope.tokenValidation == "1050") {
                            alert("Session Expired");
                            location.href = "./index.html";
                            sessionStorage.setItem("username", "redirect");
                        }
                        if ($scope.msg == null) {
                            return false;
                        } else {
                            if ($scope.speechStatus == true) {
                                msg.text = $scope.msg;
                                speechSynthesis.speak(msg);
                            }
                            var botArray = $scope.msg.split("###@@@")
                            var botMsg = "";
                            var i;
                            //for (i = 0; i < cars.length; i++)
                            for (i = 0; i < botArray.length; i++) {
                                /* 	if(i!=botArray.length-1){
                                	botMsg=botMsg.concat(botArray[i]+ "\r\n");
                                	}
                                	else{
                                	botMsg=botMsg.concat(botArray[i]);
                                	} */
                                $scope.chats.push({
                                    "person": false,
                                    "userMsg": botArray[i]
                                })
                            }
                            if ($scope.buttonKey == "6") {
                                $scope.isInDetail = true;

                            }

                            $timeout(function () {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                        }
                    },
                    function (response) {
                        $scope.msg = "Service not Exists";
                        $scope.statusval = response.status;
                        $scope.statustext = response.statusText;
                        $scope.headers = response.headers();
                    });
            }
            $scope.inputValue = null;
            finaSpeechResult = '';
        }
        $scope.logout = function (cache) {
            var uid = sessionStorage.username;
            var dataObj = {
                "cacheStatus": "Closed",
                "userId": uid
            };
            var config = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            }
            $http.post($scope.logoutUrl, JSON.stringify(dataObj)).then(function (response) {
                    console.log(response.data);

                    location.href = "./index.html";
                    sessionStorage.setItem("username", "redirect");
                },
                function (response) {
                    $scope.msg = "Service not Exists";
                    $scope.statusval = response.status;
                    $scope.statustext = response.statusText;
                    $scope.headers = response.headers();
                });
        }
        $scope.reset = function (cache) {
            var uid = sessionStorage.username;
            var dataObj = {
                "cacheStatus": "Closed",
                "userId": uid
            };
            var config = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            }
            $http.post($scope.resetUrl, JSON.stringify(dataObj)).then(function (response) {
                    console.log(response.data);

                    location.href = "./Chatbot.html";
                },
                function (response) {
                    $scope.msg = "Service not Exists";
                    $scope.statusval = response.status;
                    $scope.statustext = response.statusText;
                    $scope.headers = response.headers();
                });
        };
        $scope.dateTime = {
            "data": [
                {
                    "date": "01/07/2018",
                    "day": "Mon",
                    "slots": [
                "10:30",
                "11:00",
                "11:30",
                "12:00",
                "12:30",
                "13:00",
                "13:30",
                "14:00"
            ]
        },
                {
                    "date": "02/07/2018",
                    "day": "Tue",
                    "slots": [
                "9:00",
                "9:30",
                "12:30",
                "14:00"
            ]
        },
                {
                    "date": "03/07/2018",
                    "day": "Wed",
                    "slots": [
                "9:00",
                "9:30",
                "10:00",
                "10:30",
                "11:00",
                "11:30",
                "12:00",

            ]
        },
                {
                    "date": "04/07/2018",
                    "day": "Thu",
                    "slots": [
                "14:00"
            ]
        },
                {
                    "date": "05/07/2018",
                    "day": "Fri",
                    "slots": [
                "9:00",
                "9:30",
                "10:00",
                "10:30",
                "11:00",
                "11:30",
                "12:00",
                "12:30",
                "13:00",
                "13:30",
                "14:00"
            ]
        },
                {
                    "date": "06/07/2018",
                    "day": "Sat",
                    "slots": [
                "9:00",
                "9:30",
                "10:00",
                "10:30",
                "13:00",
                "13:30",
                "14:00"
            ]
        },
                {
                    "date": "07/07/2018",
                    "day": "Sun",
                    "slots": [
                "9:00",
                "9:30",
                "10:00",
                "10:30",
                "11:00",
                "11:30",

            ]
        }

    ]
        };
        $scope.insertCheck = function (value) {
            $scope.timeslots = angular.copy($scope.dateTime.data);
            if (value === 'Hi' || value === 'hi') {
                $scope.isDateTimeOn = true;
                q.dateSelected = 0;
                q.timeSelected = 0;
                q.date = $scope.timeslots[q.dateSelected].date;
                q.day = $scope.timeslots[q.dateSelected].day;
                q.time = $scope.timeslots[q.dateSelected].slots[q.timeSelected];
                //$scope.isDischarge = true;
            }
        };
        var q = this;
        q.printCheck = function (x, v) {
            console.log("date, time", q.date + "," + q.day + "," + q.time);
            //   console.log("time", $scope.timeSelected);

        };
    }
]);
