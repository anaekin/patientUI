var app = angular.module('chatbox', ['mobiscroll-datetime', 'mobiscroll-form']);
app.controller('ChatController', ['$scope', '$http', '$filter', '$log', '$timeout', '$sce',
    function($scope, $http, $filter, $log, $timeout, $sce) {
        var Id = sessionStorage.username;
		var selectedUrl= sessionStorage.Environment;
		
        	 if(Id == undefined || Id == null || Id == "redirect")
        	{
        		location.href = "./index.html";
        		return false;
        	} 
		
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
		msg.text = 'Hello'+Id+ ',Welcome to Napier Assistant ,How can I assist you?';
        msg.lang = 'en-IN';
		  
        $scope.speechStatus = true;
        $scope.init = function() {
            $scope.sttstatus = true;
            speechSynthesis.speak(msg);
        }
        $scope.changeStatus = function() {
            $scope.sttstatus = !$scope.sttstatus;
            $scope.speechStatus = $scope.sttstatus;
        }
        msg.onend = function(e) {
            console.log('Finished in' + event.elapsedTime + 'seconds.');
        };
		
		
		
        //:::::::::::::::URL DECLARATION::::::::::::::
        $scope.logoutUrl = "http://10.5.6.15:8080/ChatBot/app/clearCache";
        $scope.resetUrl ="http://10.5.6.15:8080/ChatBot/app/resetChat";
        $scope.PostUrl = "http://10.5.6.15:8080/ChatBot/app/receiveMessage";
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
        var messageId = "";
        $scope.isBpValue = false;
        $scope.isTemperatureValue = false;
        $scope.isPulseValue = false;
        $scope.isRespiratoryRateValue = false;
        $scope.isHeartRateValue = false;
        $scope.isO2_SaturationValue = false;
        $scope.isHeightValue = false;
        $scope.isWeightValue = false;
        $scope.typing = false;
        $scope.isVitalKeys = false;
        $scope.isVacant = false;
        $scope.isCleaning = false;
        $scope.isHeadCircumference = false;
        $scope.isTasks = false;
        $scope.isDischargeButton = false;
        $scope.isDischargeUp = false;
        $scope.isDischarge = false;
        $scope.Temp_Valid = false;
        $scope.Bp_Valid = false;
        $scope.pulse_Valid = false;
        $scope.rr_Valid = false;
        $scope.hr_Valid = false;
        $scope.o2_Valid = false;
        $scope.dropdown1 = '';
        $scope.dropdown2 = '';
        $scope.dropdown3 = '';
        $scope.isMicOn = true;
        $scope.micImgId = "";
        console.log(Id);
        $scope.check = true;
		
		/*auto send*/
        $scope.autoSendText = true;
        $scope.initial = function() {
            $scope.autoSendstatus = true;
        }
        $scope.autoSend = function() {
            $scope.autoSendstatus = !$scope.autoSendstatus;
            $scope.autoSendText = $scope.autoSendstatus;
        }
        msg.onend = function(e) {
            console.log('Finished in' + event.elapsedTime + 'seconds.');
        };
		
		
        $scope.chats = [{
            "person": false,
            "userMsg": "Hello " + Id + "."
        }];
        $scope.chats.push({
            "person": false,
            "userMsg": "How can I assist you ?"
        });
        $scope.enter = function($event) {
            var keyCode = $event.which || $event.keyCode;
            if (keyCode == 13) {
                $event.preventDefault();
                $scope.insert();
            }
        };
        /*:::::::::::form validations::::::::*/

        /*::::: RADIO SHOW/HIDE :::*/
        $scope.Weight = 'standard';
        $scope.isShownWeight = function(Weight) {
            return Weight === $scope.Weight;
        };
        $scope.Height = 'standard';
        $scope.isShownHeight = function(Height) {
            return Height === $scope.Height;
        };
        $scope.Head = 'standard';
        $scope.isShownHead = function(Head) {
            return Head === $scope.Head;
        };

        /*  unit converstion*/
        $scope.edited = null;
        $scope.markEdited = function(which, height) {
            $scope.maxlength = false;
            $scope.maxlength1 = false;
            $scope.maxlength2 = false;
            if (which == 'S') {
                if (height < 0.5 || height > 12) {
                    $scope.maxlength = true;
                    $scope.height_Valid = true;
                } else {
                    $scope.maxlength = false;
                    $scope.height_Valid = false;
                }
                $scope.edited = which;
            }
            if (which == 'S') {
                if (height < 0 || height > 12) {
                    $scope.maxlength1 = true;
                    $scope.height_Valid = true;
                } else {
                    $scope.maxlength1 = false;
                    $scope.height_Valid = false;
                }
                $scope.edited = which;
            }
            if (which == 'M') {
                if (height <= 15 || height > 305) {
                    $scope.maxlength2 = true;
                    $scope.height_Valid = true;
                } else {
                    $scope.maxlength2 = false;
                    $scope.height_Valid = false;
                }
                $scope.edited = which;
            }
            if (which == 'L') {
                if (height < 1 || height > 440) {
                    $scope.maxWeight = true;
                    $scope.Weight_Valid = true;
                } else {
                    $scope.maxWeight = false;
                    $scope.Weight_Valid = false;
                }
                $scope.edited = which;
            }
            if (which == 'K') {
                if (height < 0.5 || height > 200) {
                    $scope.maxWeight1 = true;
                    $scope.Weight_Valid = true;
                } else {
                    $scope.maxWeight1 = false;
                    $scope.Weight_Valid = false;
                }
                $scope.edited = which;
            }
            if (which == 'F') {
                if (height <= 90 || height >= 110) {
                    $scope.maxTemp = true;
                    $scope.maxTemp1 = false;
                    $scope.Temp_Valid = true;
                } else {
                    $scope.maxTemp = false;
                    $scope.Temp_Valid = false;
                }
                $scope.edited = which;
            }
            if (which == 'C') {
                if (height <= 32 || height >= 46) {
                    $scope.maxTemp1 = true;
                    $scope.maxTemp = false;
                    $scope.Temp_Valid = true;
                } else {
                    $scope.maxTemp1 = false;
                    $scope.Temp_Valid = false;
                }
                $scope.edited = which;
            }
        };

        $scope.markEdited1 = function(which, height) {
            if (height < 0 || height >= 12) {
                $scope.maxlength1 = true;
            } else {
                $scope.maxlength1 = false;
            }
            $scope.edited = which;
        };
		
        /* Temp*/
        $scope.$watch('formData.Temp1', function(value) {
            if ($scope.formData.Temp1 == "") {
                $scope.formData.Temp2 = "";
            }
            if ($scope.edited == 'F') {
                console.log(value + 'C -> F');
                if (value != "") {
                    $scope.Temp2 = (value - 32) * 5.0 / 9.0;

                    function precisionRound(number, precision) {
                        var factor = Math.pow(10, precision);
                        return Math.round(number * factor) / factor;
                    }
                    $scope.Tval = precisionRound($scope.Temp2, 2)
                    console.log(precisionRound($scope.Temp2, 2));
                    $scope.formData.Temp2 = $scope.Tval;

                }
            }
        });

        $scope.$watch('formData.Temp2', function(value) {
            if ($scope.formData.Temp2 == "") {
                $scope.formData.Temp1 = "";
            }
            if ($scope.edited == 'C') {
                console.log(value + 'F -> C');
                if (value != "") {
                    $scope.Temp1 = value * 9.0 / 5.0 + 32;

                    function precisionRound(number, precision) {
                        var factor = Math.pow(10, precision);
                        return Math.round(number * factor) / factor;
                    }
                    $scope.Tval1 = precisionRound($scope.Temp1, 2)
                    console.log(precisionRound($scope.Temp1, 2));
                    $scope.formData.Temp1 = $scope.Tval1;
                }
            }

        });
		
        /*    KGS TO POUNDS & VICEVERSA*/

        $scope.$watch('formData.Sweight', function(value) {
            if (value <= 440) {

                if ($scope.edited == 'L') {
                    console.log(value + 'K -> L');
                    $scope.MweightVal = value / 2.2046;

                    function precisionRound(number, precision) {
                        var factor = Math.pow(10, precision);
                        return Math.round(number * factor) / factor;
                    }
                    $scope.Wval = precisionRound($scope.MweightVal, 2)
                    console.log($scope.Wval);
                    if ($scope.Wval == 0) {
                        $scope.formData.Mweight = "";
                    } else if ($scope.Wval <= 200) {
                        $scope.maxWeight1 = false;
                        $scope.formData.Mweight = $scope.Wval;
                    } else {
                        $scope.formData.Mweight = "";
                    }
                }
            } else {
                $scope.formData.Mweight = "";
            }
        });
        $scope.$watch('formData.Mweight', function(value) {
            if (value <= 200) {
                if ($scope.edited == 'K') {
                    console.log(value + 'L -> K');
                    $scope.MweightVal2 = value * 2.2046;

                    function precisionRound(number, precision) {
                        var factor = Math.pow(10, precision);
                        return Math.round(number * factor) / factor;
                    }
                    $scope.Wval2 = precisionRound($scope.MweightVal2, 2)
                    console.log($scope.Wval2);
                    if ($scope.Wval2 == 0) {
                        $scope.formData.Sweight = "";

                    } else if ($scope.Wval2 <= 440) {
                        $scope.maxWeight = false;
                        $scope.formData.Sweight = $scope.Wval2;

                    } else {
                        $scope.formData.Sweight = "";
                    }
                }
            } else {
                $scope.formData.Sweight = "";
            }
        });
		
        /*Height*/
        $scope.$watch('formData.height1', function(value) {
            if (value <= 10) {
                $scope.$watch('formData.height2', function(value) {
                    $scope.feetVal = $scope.formData.height1 * 30.48;
                    $scope.inchVal = $scope.formData.height2 * 2.54;

                    $scope.valIncm = $scope.feetVal + $scope.inchVal;
                    console.log($scope.valIncm);
                    if ($scope.edited == 'S') {
                        $scope.formData.MHeight = $scope.valIncm;
                    }
                })
            } else {
                $scope.formData.MHeight = "";
            }
        });

        $scope.$watch('formData.MHeight', function(value) {
            if (value == 0) {
                $scope.formData.MHeight = "";
            } else if (value > 0 && value <= 305) {
                if ($scope.edited == 'M') {
                    $scope.cmFeet = $scope.formData.MHeight / 30.48;
                    console.log($scope.cmFeet);
                    $scope.substr = $scope.cmFeet.toString().split('.');
                    console.log($scope.substr[0]);
                    var inchVal = $scope.formData.MHeight - ($scope.substr[0] * 30.48);
                    inchVal = inchVal / 2.54;
                    $scope.inch = inchVal.toString().split('.');
                    console.log($scope.inch[0]);
                    if ($scope.substr[0] == "NaN" || $scope.substr[0] == 0) {
                        $scope.formData.height1 = "";
                    } else {
                        $scope.formData.height1 = $scope.substr[0];
                    }
                    $scope.formData.height2 = $scope.inch[0];
                }
            } else {
                $scope.formData.height1 = "";
                $scope.formData.height2 = "";
            }
        });

        $scope.bpValid = function(mode, record) {
            record._invalid = false;
            var validbpExp = /^\d+$/;
            var bpsVal = record.vitalValue1;
            var bpdVal = record.vitalValue2;
            var bps = parseInt(bpsVal);
            var bpd = parseInt(bpdVal);
            record._color = false;
            record._color1 = false;
            if (bpsVal && bpdVal) {
                if (validbpExp.test(bpsVal) && validbpExp.test(bpsVal)) {
                    if ((bps >= 10 && bps <= 200) && (bpd >= 10 && bpd <= 200)) {
                        record._invalid = false;
                        $scope.Bp_Valid = false;
                    } else {
                        record._invalid = true;
                        $scope.Bp_Valid = true;
                    }
                } else {
                    record._invalid = true;
                    $scope.Bp_Valid = true;
                }
            }
            if (bpsVal && !bpdVal) {
                if (validbpExp.test(bps)) {
                    if (bps == 0) {
                        $scope.tempDetail.vitalValue = "";
                        record._invalid = false;
                        $scope.Bp_Valid = false;
                    }
                    if (bps >= 10 && bps <= 200) {
                        $log.log('correct');
                        record._invalid = false;
                        $scope.Bp_Valid = false;
                    } else {
                        $log.log('incorrect');
                        record._invalid = true;
                        $scope.Bp_Valid = true;
                    }
                } else {
                    $log.log('invalid');
                    record._invalid = true;
                    $scope.Bp_Valid = true;
                }
            } else if (!bpsVal && bpdVal) {
                if (validbpExp.test(bpd)) {
                    if (bpd == 0) {
                        $scope.tempDetail.vitalValue = "";
                        $scope.Bp_Valid = false;
                    } else if (bpd >= 10 && bpd <= 200) {
                        record._invalid = false;
                        $scope.Bp_Valid = false;
                    } else {
                        record._invalid = true;
                        $scope.Bp_Valid = true;
                    }
                } else {
                    record._invalid = true;
                    $scope.Bp_Valid = true;
                }
            }
        }
		
        //::::::::::PulseRate:::::::::
        $scope.prValid = function(mcode, val, record) {
            record._invalid = false;
            record._color = false;
            var validprExp = /^\d+$/;
            var rate = parseInt(val);
            if (validprExp.test(val)) {
                record._invalid = false;
                if (val == 0) {
                    $scope.tempDetail.vitalValue = "";
                } else if (val >= 10 && val <= 250) {
                    record._invalid = false;
                    $scope.newDiscoveryForm2.$invalid = false;
                    $scope.pulse_Valid = false;
                } else {
                    record._invalid = true;
                    $scope.newDiscoveryForm2.$invalid = true;
                    $scope.pulse_Valid = true;
                }
            } else {
                record._invalid = true;
                $scope.newDiscoveryForm2.$invalid = true;
                $scope.pulse_Valid = true;
            }
        }
		
        //:::::::::::: RR:::::::::::::
        $scope.rrValid = function(mcode, val, record) {
            record._invalid = false;
            record._color = false;
            var validprExp = /^\d+$/;
            var rate = parseInt(val);
            if (validprExp.test(val)) {
                if (val >= 10 && val <= 50) {
                    record._invalid = false;
                    $scope.newDiscoveryForm3.$invalid = false;
                    $scope.rr_Valid = false;
                } else {
                    record._invalid = true;
                    $scope.newDiscoveryForm3.$invalid = true;
                    $scope.rr_Valid = true;
                }
            } else {
                record._invalid = true;
                $scope.newDiscoveryForm3.$invalid = true;
                $scope.rr_Valid = true;
            }
        }
		
        //::::::::::O2:::::::::
        $scope.oxygenSValid = function(val, record) {
            record._invalid = false;
            record._color = false;
            var validExp = /^-?\d+(?:\.\d+)?$/;
            var oxy = val;
            if (oxy == "undefined" || oxy == "") {
                record._invalid = false;
                $scope.newDiscoveryForm5.$invalid = true;
                $scope.o2_Valid = true;
            } else {
                if (validExp.test(oxy)) {
                    if (oxy >= 10 && oxy <= 100) {
                        record._invalid = false;
                        $scope.newDiscoveryForm5.$invalid = false;
                        $scope.o2_Valid = false;
                    } else {
                        record._invalid = true;
                        $scope.newDiscoveryForm5.$invalid = true;
                        $scope.o2_Valid = true;
                    }
                } else {
                    record._invalid = true;
                    $scope.newDiscoveryForm5.$invalid = true;
                    $scope.o2_Valid = true;
                }
            }
        }
        /*::::::::::HEAD CIRCUMFERANCE::::::*/
        $scope.onHeadCircumSBlur = function(i, record) {
            if (i == "") {
                record._invalid = false;
                $scope.newDiscoveryForm8.$invalid = true;
            } else {
                var validExp = /^-?\d+(?:\.\d+)?$/;
                record._color = false;
                record._invalid = false;
                if (i <= 0) {
                    var hcInI = "";
                    record._invalid = true;
                    $scope.newDiscoveryForm8.$invalid = true;
                } else if (i > 0) {


                    if (validExp.test(i)) {
                        if (i >= 3.9 && i <= 39.37) {
                            record._invalid = false;
                            var hcInI = (i * 2.54).toFixed(2);
                            console.log(hcInI);
                            $scope.newDiscoveryForm8.$invalid = false;
                        } else {
                            record._invalid = true;
                            $scope.newDiscoveryForm8.$invalid = true;

                        }
                    } else {
                        record._invalid = true;
                        $scope.newDiscoveryForm8.$invalid = true;

                    }
                } else {
                    record._invalid = false;
                    $scope.newDiscoveryForm8.$invalid = true;

                }
                return hcInI;
            }
        }

        $scope.onHeadCircumMBlur = function(c, record) {
            if (c == "") {
                record._invalid = false;
                $scope.newDiscoveryForm8.$invalid = true;
            } else {
                var validExp = /^-?\d+(?:\.\d+)?$/;
                record._invalid = false;

                if (c <= 9) {
                    var hcInC = " ";
                    record._invalid = true;
                    $scope.newDiscoveryForm8.$invalid = true;
                } else if (c >= 10) {
                    if (validExp.test(c)) {
                        if (c >= 10 && c <= 100) {
                            record._invalid = false;
                            var hcInC = (c * 0.393701).toFixed(2);
                            $scope.newDiscoveryForm8.$invalid = false;
                            console.log(hcInC);
                        } else {
                            record._invalid = true;
                            $scope.newDiscoveryForm8.$invalid = true;

                        }
                    } else {
                        record._invalid = true;
                        $scope.newDiscoveryForm8.$invalid = true;

                    }
                } else {
                    record._invalid = false;
                    $scope.newDiscoveryForm8.$invalid = true;

                }
                return hcInC;

            }
        }
        $scope.formData = {}
        $scope.BP = function($event) {
            $scope.isBpValue = false;
            $scope.typing = true;
            var reply = $scope.tempDetail.vitalValue1 + " " + $scope.tempDetail.vitalValue2 + "," + $scope.formData.Position + "," + $scope.formData.site + ", bpValueSaved";
            console.log(reply);
            $scope.formReply(reply);
            $scope.tempDetail.vitalValue1 = '';
            $scope.tempDetail.vitalValue2 = '';
            $scope.formData.Position = null;
            $scope.formData.site = null;
            $event.preventDefault();
            $scope.reply = '';
        }

        $scope.Temp = function($event) {
            $scope.isTemperatureValue = false;
            $scope.typing = true;
            var reply = $scope.formData.Temp1 + " " + $scope.formData.Temp2 + "," + $scope.formData.TempSite + ", temperatureValueSaved";
            $scope.formReply(reply);
            $scope.formData.TempSite = null;
            $event.preventDefault();
            $scope.reply = '';
            $scope.empty();
        }
        $scope.empty = function() {
            $scope.formData.Temp1 = "";
            $scope.formData.Temp2 = "";
        }

        $scope.Pulse = function($event) {
            $scope.isPulseValue = false;
            $scope.typing = true;
            var reply = $scope.tempDetail.vitalValue + "," + $scope.formData.PulseSite + "," + $scope.formData.PulseRhytm + "," + $scope.formData.PulseVolume + ", pulseValueSaved";
            $scope.formReply(reply);
            $scope.tempDetail.vitalValue = "";
            $scope.formData.PulseSite = null;
            $scope.formData.PulseRhytm = null;
            $scope.formData.PulseVolume = null;
            $event.preventDefault();
            $scope.reply = "";
        }

        $scope.RR = function($event) {
            $scope.isRespiratoryRateValue = false;
            $scope.typing = true;
            var reply = $scope.tempDetail.rrValue + "," + $scope.formData.Drop1 + ", respiratoryValueSaved";
            $scope.formReply(reply);
            $scope.tempDetail.rrValue = "";
            $scope.formData.Drop1 = null;
            $event.preventDefault();
            $scope.reply = "";
        }


        $scope.HeartRate = function($event) {
            $scope.isHeartRateValue = false;
            $scope.typing = true;
            var reply = $scope.formData.HeartRate + "," + $scope.formData.Rhythm + "," + $scope.formData.sound + ", heartRateValueSaved";
            $scope.formReply(reply);
            $scope.formData.HeartRate = "";
            $scope.formData.Rhythm = null;
            $scope.formData.sound = null
            $event.preventDefault();
            $scope.reply = "";
        }

        $scope.PHeight = function($event) {
            $scope.isHeightValue = false;
            $scope.typing = true;
            var reply = "feet:" + $scope.formData.height1 + " Inch:" + $scope.formData.height2 + " MHeight :" + $scope.formData.MHeight + ", heightValueSaved";
            $scope.formReply(reply);
            $scope.formData.height1 = "";
            $scope.formData.height2 = "";
            $scope.formData.MHeight = "";
            $event.preventDefault();
            $scope.reply = "";
        }

        $scope.PWeight = function($event) {
            $scope.isWeightValue = false;
            $scope.typing = true;
            var reply = "Lbs:" + $scope.formData.Sweight + " Kgs:" + $scope.formData.Mweight + ", weightValueSaved";
            $scope.formReply(reply);
            $scope.formData.Sweight = "";
            $scope.formData.Mweight = "";
            $event.preventDefault();
            $scope.reply = "";
        }

        $scope.O2_Saturation = function($event) {
            $scope.isO2_SaturationValue = false;
            $scope.typing = true;
            var reply = $scope.tempDetail.o2Value + "," + $scope.formData.source + "," + $scope.tempDetail.o2Rate + ", o2ValueSaved";
            $scope.formReply(reply);
            $scope.tempDetail.o2Value = "";
            $scope.formData.source = null;
            $scope.tempDetail.o2Rate = "";
            $event.preventDefault();
            $scope.reply = "";
        }

        $scope.HcValue = function($event) {
            $scope.isHeadCircumference = false;
            $scope.typing = true;
            var reply = $scope.tempDetail.vitalValue + "," + $scope.tempDetail.vitalValue1 + ", hcValueSaved ";
            $scope.formReply(reply);
            $scope.tempDetail.vitalValue = "";
            $scope.tempDetail.vitalValue1 = "";
            $scope.newDiscoveryForm8.$invalid = true;
            $scope.reply = "";
        }

        //formReply::::function reply is binded from the form value
        $scope.formReply = function(reply) {
            var dataObj = {
                userMsg: reply,
                userId: Id,
				userUrl:selectedUrl
            };
            var config = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            }

            $http.post($scope.PostUrl, JSON.stringify(dataObj)).then(function(response) {
                    debugger
					if (response.data)
                        $scope.key = response.data.nodeKey;
                    $scope.buttonKey = response.data.buttonKey;
					$scope.tokenValidation=response.data.errorCode;
                    $scope.msg = response.data.response;
                    $scope.dropdown1 = response.data.dropDown1;
                    $scope.dropdown2 = response.data.dropDown2;
                    $scope.dropdown3 = response.data.dropDown3;
						
                    $scope.typing = false;
					if($scope.tokenValidation=="1050")
					{
					alert("Session Expired");
					return false;
					}
                    if ($scope.msg == null) {
                        return false;
                    } else if ($scope.buttonKey == "1") {
                        $scope.isBpValue = false;
                        $scope.isTemperatureValue = false;
                        $scope.isPulseValue = false;
                        $scope.isRespiratoryRateValue = false;
                        $scope.isHeartRateValue = false;
                        $scope.isO2_SaturationValue = false;
                        $scope.isHeightValue = false;
                        $scope.isWeightValue = false;
                        $scope.isHeadCircumference = false;
                        if ($scope.speechStatus == true) {
                            msg.text = $scope.msg;
                            speechSynthesis.speak(msg);
                        }
                        $scope.chats.push({
                            "person": false,
                            "userMsg": $scope.msg
                        })
                        $timeout(function() {
                            var scroller = document.getElementById("autoscroll");
                            scroller.scrollTop = scroller.scrollHeight;
                        }, 0, false);
                        $scope.isVitalKeys = true;

                    } else if ($scope.buttonKey == "2") {
                        $scope.isBpValue = false;
                        $scope.isTemperatureValue = false;
                        $scope.isPulseValue = false;
                        $scope.isRespiratoryRateValue = false;
                        $scope.isHeartRateValue = false;
                        $scope.isO2_SaturationValue = false;
                        $scope.isHeightValue = false;
                        $scope.isWeightValue = false;
                        $scope.isHeadCircumference = false;
                        if ($scope.speechStatus == true) {
                            msg.text = $scope.msg;
                            speechSynthesis.speak(msg);
                        }
                        $scope.chats.push({
                            "person": false,
                            "userMsg": $scope.msg
                        })
                        $timeout(function() {
                            var scroller = document.getElementById("autoscroll");
                            scroller.scrollTop = scroller.scrollHeight;
                        }, 0, false);
                        $scope.isVacant = true;
                    } else if ($scope.buttonKey == "3") {
                        $scope.isBpValue = false;
                        $scope.isTemperatureValue = false;
                        $scope.isPulseValue = false;
                        $scope.isRespiratoryRateValue = false;
                        $scope.isHeartRateValue = false;
                        $scope.isO2_SaturationValue = false;
                        $scope.isHeightValue = false;
                        $scope.isWeightValue = false;
                        $scope.isHeadCircumference = false;
                        if ($scope.speechStatus == true) {
                            msg.text = $scope.msg;
                            speechSynthesis.speak(msg);
                        }
                        $scope.chats.push({
                            "person": false,
                            "userMsg": $scope.msg
                        })
                        $timeout(function() {
                            var scroller = document.getElementById("autoscroll");
                            scroller.scrollTop = scroller.scrollHeight;
                        }, 0, false);
                        $scope.isBlocked = true;
                    } else if ($scope.buttonKey == "4") {
                        $scope.isBpValue = false;
                        $scope.isTemperatureValue = false;
                        $scope.isPulseValue = false;
                        $scope.isRespiratoryRateValue = false;
                        $scope.isHeartRateValue = false;
                        $scope.isO2_SaturationValue = false;
                        $scope.isHeightValue = false;
                        $scope.isWeightValue = false;
                        $scope.isHeadCircumference = false;
                        if ($scope.speechStatus == true) {
                            msg.text = $scope.msg;
                            speechSynthesis.speak(msg);
                        }
                        $scope.chats.push({
                            "person": false,
                            "userMsg": $scope.msg
                        })
                        $timeout(function() {
                            var scroller = document.getElementById("autoscroll");
                            scroller.scrollTop = scroller.scrollHeight;
                        }, 0, false);
                        $scope.isCleaning = true;
                    } 
					
					
					else if ($scope.key == "1") {
                        $scope.buttonsDisabled = true;
                        $scope.isTemperatureValue = false;
                        $scope.isPulseValue = false;
                        $scope.isRespiratoryRateValue = false;
                        $scope.isHeartRateValue = false;
                        $scope.isO2_SaturationValue = false;
                        $scope.isHeightValue = false;
                        $scope.isWeightValue = false;
                        $scope.isHeadCircumference = false;
                        if ($scope.speechStatus == true) {
                            msg.text = $scope.msg;
                            speechSynthesis.speak(msg);
                        }
                        $scope.chats.push({
                            "person": false,
                            "userMsg": $scope.msg
                        })
                        $timeout(function() {
                            var scroller = document.getElementById("autoscroll");
                            scroller.scrollTop = scroller.scrollHeight;
                        }, 0, false);

                        var splitDD = $scope.dropdown2;
                        console.log($scope.dropDown2);
                        $scope.siteDropDown = splitDD.split(",");

                        var splitDD = $scope.dropdown1;
                        console.log($scope.dropDown1);
                        $scope.siteDropDown1 = splitDD.split(",");

                        $scope.isBpValue = true;
                    } 
					
					
					else if ($scope.key == "2") {
                        $scope.buttonsDisabled = true;
                        $scope.isBpValue = false;
                        $scope.isPulseValue = false;
                        $scope.isRespiratoryRateValue = false;
                        $scope.isHeartRateValue = false;
                        $scope.isO2_SaturationValue = false;
                        $scope.isHeightValue = false;
                        $scope.isWeightValue = false;
                        $scope.isHeadCircumference = false;
                        if ($scope.speechStatus == true) {
                            msg.text = $scope.msg;
                            speechSynthesis.speak(msg);
                        }
                        $scope.chats.push({
                            "person": false,
                            "userMsg": $scope.msg
                        })
                        $timeout(function() {
                            var scroller = document.getElementById("autoscroll");
                            scroller.scrollTop = scroller.scrollHeight;
                        }, 0, false);

                        var splitDD = $scope.dropdown1;
                        console.log($scope.dropdown1);
                        $scope.siteDropDown2 = splitDD.split(",");

                        $scope.isTemperatureValue = true;

                    } else if ($scope.key == "3") {
                        $scope.buttonsDisabled = true;
                        $scope.isBpValue = false;
                        $scope.isTemperatureValue = false;
                        $scope.isRespiratoryRateValue = false;
                        $scope.isHeartRateValue = false;
                        $scope.isO2_SaturationValue = false;
                        $scope.isHeightValue = false;
                        $scope.isWeightValue = false;
                        $scope.isHeadCircumference = false;
                        if ($scope.speechStatus == true) {
                            msg.text = $scope.msg;
                            speechSynthesis.speak(msg);
                        }
                        $scope.chats.push({
                            "person": false,
                            "userMsg": $scope.msg
                        })
                        $timeout(function() {
                            var scroller = document.getElementById("autoscroll");
                            scroller.scrollTop = scroller.scrollHeight;
                        }, 0, false);

                        var splitDD = $scope.dropdown3;
                        console.log($scope.dropdown3);
                        $scope.siteDropDown3 = splitDD.split(",");

                        var splitDD = $scope.dropdown2;
                        console.log($scope.dropdown2);
                        $scope.siteDropDown4 = splitDD.split(",");

                        var splitDD = $scope.dropdown1;
                        console.log($scope.dropdown1);
                        $scope.siteDropDown5 = splitDD.split(",");

                        $scope.isPulseValue = true;

                    } else if ($scope.key == "4") {
                        $scope.buttonsDisabled = true;
                        $scope.isBpValue = false;
                        $scope.isTemperatureValue = false;
                        $scope.isPulseValue = false;
                        $scope.isHeartRateValue = false;
                        $scope.isO2_SaturationValue = false;
                        $scope.isHeightValue = false;
                        $scope.isWeightValue = false;
                        $scope.isHeadCircumference = false;
                        if ($scope.speechStatus == true) {
                            msg.text = $scope.msg;
                            speechSynthesis.speak(msg);
                        }
                        $scope.chats.push({
                            "person": false,
                            "userMsg": $scope.msg
                        })
                        $timeout(function() {
                            var scroller = document.getElementById("autoscroll");
                            scroller.scrollTop = scroller.scrollHeight;
                        }, 0, false);

                        var splitDD = $scope.dropdown1;
                        console.log($scope.dropdown1);
                        $scope.siteDropDown6 = splitDD.split(",");
                        $scope.isRespiratoryRateValue = true;

                    } else if ($scope.key == "5") {
                        $scope.buttonsDisabled = true;
                        $scope.isBpValue = false;
                        $scope.isTemperatureValue = false;
                        $scope.isPulseValue = false;
                        $scope.isRespiratoryRateValue = false;
                        $scope.isO2_SaturationValue = false;
                        $scope.isHeightValue = false;
                        $scope.isWeightValue = false;
                        $scope.isHeadCircumference = false;
                        if ($scope.speechStatus == true) {
                            msg.text = $scope.msg;
                            speechSynthesis.speak(msg);
                        }
                        $scope.chats.push({
                            "person": false,
                            "userMsg": $scope.msg
                        })
                        $timeout(function() {
                            var scroller = document.getElementById("autoscroll");
                            scroller.scrollTop = scroller.scrollHeight;
                        }, 0, false);

                        var splitDD = $scope.dropdown1;
                        console.log($scope.dropdown1);
                        $scope.siteDropDown7 = splitDD.split(",");

                        $scope.isHeartRateValue = true;

                    } else if ($scope.key == "6") {
                        $scope.buttonsDisabled = true;
                        $scope.isBpValue = false;
                        $scope.isTemperatureValue = false;
                        $scope.isPulseValue = false;
                        $scope.isRespiratoryRateValue = false;
                        $scope.isHeartRateValue = false;
                        $scope.isHeadCircumference = false;
                        $scope.isHeightValue = false;
                        $scope.isWeightValue = false;
                        if ($scope.speechStatus == true) {
                            msg.text = $scope.msg;
                            speechSynthesis.speak(msg);
                        }
                        $scope.chats.push({
                            "person": false,
                            "userMsg": $scope.msg
                        })
                        $timeout(function() {
                            var scroller = document.getElementById("autoscroll");
                            scroller.scrollTop = scroller.scrollHeight;
                        }, 0, false);

                        var splitDD = $scope.dropdown1;
                        console.log($scope.dropdown1);
                        $scope.siteDropDown8 = splitDD.split(",");

                        $scope.isO2_SaturationValue = true;

                    } else if ($scope.key == "7") {
                        $scope.buttonsDisabled = true;
                        $scope.isBpValue = false;
                        $scope.isTemperatureValue = false;
                        $scope.isPulseValue = false;
                        $scope.isRespiratoryRateValue = false;
                        $scope.isHeartRateValue = false;
                        $scope.isO2_SaturationValue = false;
                        $scope.isWeightValue = false;
                        $scope.isHeadCircumference = false;
                        if ($scope.speechStatus == true) {
                            msg.text = $scope.msg;
                            speechSynthesis.speak(msg);
                        }
                        $scope.chats.push({
                            "person": false,
                            "userMsg": $scope.msg
                        })
                        $timeout(function() {
                            var scroller = document.getElementById("autoscroll");
                            scroller.scrollTop = scroller.scrollHeight;
                        }, 0, false);
                        $scope.isHeightValue = true;
                    } else if ($scope.key == "8") {
                        $scope.buttonsDisabled = true;
                        $scope.isBpValue = false;
                        $scope.isTemperatureValue = false;
                        $scope.isPulseValue = false;
                        $scope.isRespiratoryRateValue = false;
                        $scope.isHeartRateValue = false;
                        $scope.isO2_SaturationValue = false;
                        $scope.isHeightValue = false;
                        $scope.isHeadCircumference = false;
                        if ($scope.speechStatus == true) {
                            msg.text = $scope.msg;
                            speechSynthesis.speak(msg);
                        }
                        $scope.chats.push({
                            "person": false,
                            "userMsg": $scope.msg
                        })
                        $timeout(function() {
                            var scroller = document.getElementById("autoscroll");
                            scroller.scrollTop = scroller.scrollHeight;
                        }, 0, false);
                        $scope.isWeightValue = true;

                    } else if ($scope.key == "9") {
                        $scope.buttonsDisabled = true;
                        $scope.isBpValue = false;
                        $scope.isTemperatureValue = false;
                        $scope.isPulseValue = false;
                        $scope.isRespiratoryRateValue = false;
                        $scope.isHeartRateValue = false;
                        $scope.isO2_SaturationValue = false;
                        $scope.isHeightValue = false;
                        $scope.isVitalKeys = false;
                        $scope.isVacant = false;
                        $scope.isCleaning = false;
                        $scope.isBlocked = false;
                        if ($scope.speechStatus == true) {
                            msg.text = $scope.msg;
                            speechSynthesis.speak(msg);
                        }
                        $scope.chats.push({
                            "person": false,
                            "userMsg": $scope.msg
                        })
                        $timeout(function() {
                            var scroller = document.getElementById("autoscroll");
                            scroller.scrollTop = scroller.scrollHeight;
                        }, 0, false);
                        $scope.isHeadCircumference = true;

                    } else {
                        $scope.isBpValue = false;
                        $scope.isTemperatureValue = false;
                        $scope.isPulseValue = false;
                        $scope.isRespiratoryRateValue = false;
                        $scope.isHeartRateValue = false;
                        $scope.isO2_SaturationValue = false;
                        $scope.isHeightValue = false;
                        $scope.isWeightValue = false;
                        $scope.isHeadCircumference = false;
                        if ($scope.speechStatus == true) {
                            msg.text = $scope.msg;
                            speechSynthesis.speak(msg);
                        }
                        $scope.chats.push({
                            "person": false,
                            "userMsg": $scope.msg
                        })

                        $timeout(function() {
                            var scroller = document.getElementById("autoscroll");
                            scroller.scrollTop = scroller.scrollHeight;
                        }, 0, false);
                    }

                },
                function(response) {
                    $scope.msg = "Service not Exists";
                    $scope.statusval = response.status;
                    $scope.statustext = response.statusText;
                    $scope.headers = response.headers();
                })

        }

        //voice speech control//
        $scope.placeHolder = "";
        $scope.speechRecognizer = "";
        $scope.recordState = "";
        $scope.audioButtonClick = function() {
            if ($scope.recordState == "recording") {
                $scope.stopRecording();
            } else {
                $scope.startRecording();
            }
        }

        $scope.startRecording = function() {
            $scope.micImgId = document.getElementById('micID');
            $scope.recordState = "recording";
            $scope.speechRecognizer = new webkitSpeechRecognition();
            $scope.speechRecognizer.continuous = false;
            $scope.speechRecognizer.interimResults = true;
              $scope.speechRecognizer.onerror = function(event) {
				micImgId.src = "./images/micStopImg.jpg"
                alert('This browser does not support speech plugins. Try to run on Google Chrome browser using https:')
                console.log('error!');
			
            }; 
            $scope.speechRecognizer.onend = function() {
                console.log("speech is ended");
				while($scope.autoSendText == true){
                if ($scope.inputValue == "" || $scope.inputValue == undefined) {
                    return false;
                } else {
                    $scope.insert($scope.inputValue);
                    $timeout(function() {
                        var scroller = document.getElementById("autoscroll");
                        scroller.scrollTop = scroller.scrollHeight;
                    }, 0, false);
                }
				$scope.isMicOn = true;
                $scope.micImgId.src = "./images/micStopImg.jpg"
                $scope.placeHolder.placeholder = "Type your text here..."
				}
                $scope.isMicOn = true;
                $scope.micImgId.src = "./images/micStopImg.jpg"
                $scope.placeHolder.placeholder = "Type your text here..."
            }
            $scope.placeHolder = document.getElementById('message');
            $scope.placeHolder.placeholder = "Speak now..."
            $scope.micImgId.src = "./images/micStartImg.jpg";
            $scope.STTVal = $scope.mySelection.value;
            $scope.speechRecognizer.lang = $scope.STTVal;
            $scope.speechRecognizer.start();
            $scope.isMicOn = true;
            $scope.finalTranscripts = '';

            $scope.speechRecognizer.onresult = function(event) {
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

        $scope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        }
        $scope.stopRecording = function() {
            $scope.recordState = "stopped";
            if ($scope.inputValue == "" || $scope.inputValue == undefined) {
                return false;
            } else {
                $scope.insert($scope.inputValue);
                $timeout(function() {
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
		$scope.inDetailResFun=function(){
		  var botArray = $scope.inDetailResponse.split("###@@@")
								var botMsg="";
								var i;
								//for (i = 0; i < cars.length; i++)
								for(i=0; i<botArray.length;i++){
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
		$scope.isInDetail=false;
		}
        $scope.insert = function(inputValue) {
		$scope.isInDetail=false;
			if(/\breset\b/g.test($scope.inputValue)){
					$scope.autoSendText = false;
					$scope.reset();
					
				}
				if(/\blog out\b/g.test($scope.inputValue)||/\blogout\b/g.test($scope.inputValue)){
					$scope.autoSendText = false;
					$scope.logout();
					
				}
            $scope.isVitalKeys = false;
            $scope.isVacant = false;
            $scope.isCleaning = false;
            $scope.isBlocked = false;
            $scope.isBpValue = false;
            $scope.isTemperatureValue = false;
            $scope.isPulseValue = false;
            $scope.isRespiratoryRateValue = false;
            $scope.isHeartRateValue = false;
            $scope.isO2_SaturationValue = false;
            $scope.isHeightValue = false;
            $scope.isWeightValue = false;
            $scope.isHeadCircumference = false;
            var userVal = inputValue;
            if (userVal === null || userVal === undefined) {
                console.log($scope.key);
                console.log("button key:" + $scope.buttonKey);
                if ($scope.buttonKey == "1") {
                    $scope.isVitalKeys = true;
                } else if ($scope.buttonKey == "2") {
                    $scope.isVacant = true;
                } else if ($scope.buttonKey == "3") {
                    $scope.isBlocked = true;
                } else if ($scope.buttonKey == "4") {
                    $scope.isCleaning = true;
                } else if ($scope.key == "1") {
                    $scope.isBpValue = true;
                } else if ($scope.key == "2") {
                    $scope.isTemperatureValue = true;
                } else if ($scope.key == "3") {
                    $scope.isPulseValue = true;
                } else if ($scope.key == "4") {
                    $scope.isRespiratoryRateValue = true;
                } else if ($scope.key == "5") {
                    $scope.isHeartRateValue = true;
                } else if ($scope.key == "6") {
                    $scope.isO2_SaturationValue = true;
                } else if ($scope.key == "7") {
                    $scope.isHeightValue = true;
                } else if ($scope.key == "8") {
                    $scope.isWeightValue = true;
                } else {
                    return false;
                }
                return;
            } else {
                $scope.typing = false;
                $scope.chats.push({
                    "person": $scope.check,
                    "userMsg": userVal
                })
                $timeout(function() {
                    var scroller = document.getElementById("autoscroll");
                    scroller.scrollTop = scroller.scrollHeight;
                }, 0, false);
                $scope.typing = true;
                var dataObj = {
                    userMsg: userVal,
                    userId: Id,
					userUrl:selectedUrl
                };
                var config = {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }
				
                $http.post($scope.PostUrl, JSON.stringify(dataObj)).then(function(response) {
					
				if (response.data)
                            $scope.msg = response.data.response;
                        $scope.key = response.data.nodeKey;
						$scope.tokenValidation=response.data.errorCode;
                        $scope.buttonKey = response.data.buttonKey;
                        $scope.typing = false;
                        $scope.dropdown1 = response.data.dropDown1;
                        $scope.dropdown2 = response.data.dropDown2;
                        $scope.dropdown3 = response.data.dropDown3;
						
						$scope.inDetailResponse= response.data.inDetailResponse;
						
						
						if($scope.tokenValidation=="1050")
					{
					alert("Session Expired");
					location.href = "./index.html";
                    sessionStorage.setItem("username", "redirect");
					}
                        if ($scope.msg == null) {
                            return false;
                        } else if ($scope.buttonKey == "1") {
                            $scope.isBpValue = false;
                            $scope.isTemperatureValue = false;
                            $scope.isPulseValue = false;
                            $scope.isRespiratoryRateValue = false;
                            $scope.isHeartRateValue = false;
                            $scope.isO2_SaturationValue = false;
                            $scope.isHeightValue = false;
                            $scope.isWeightValue = false;
                            $scope.isVacant = false;
                            $scope.isCleaning = false;
                            $scope.isBlocked = false;
                            $scope.isHeadCircumference = false;
                            if ($scope.speechStatus == true) {
                                msg.text = $scope.msg;
                                speechSynthesis.speak(msg);
                            }
                            $scope.chats.push({
                                "person": false,
                                "userMsg": $scope.msg
                            })
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                            $scope.isVitalKeys = true;
                        } else if ($scope.buttonKey == "2") {
                            $scope.isBpValue = false;
                            $scope.isTemperatureValue = false;
                            $scope.isPulseValue = false;
                            $scope.isRespiratoryRateValue = false;
                            $scope.isHeartRateValue = false;
                            $scope.isO2_SaturationValue = false;
                            $scope.isHeightValue = false;
                            $scope.isWeightValue = false;
                            $scope.isVitalKeys = false;
                            $scope.isCleaning = false;
                            $scope.isBlocked = false;
                            $scope.isHeadCircumference = false;
                            if ($scope.speechStatus == true) {
                                msg.text = $scope.msg;
                                speechSynthesis.speak(msg);
                            }
                            $scope.chats.push({
                                "person": false,
                                "userMsg": $scope.msg
                            })
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                            $scope.isVacant = true;
                        } else if ($scope.buttonKey == "3") {
                            $scope.isBpValue = false;
                            $scope.isTemperatureValue = false;
                            $scope.isPulseValue = false;
                            $scope.isRespiratoryRateValue = false;
                            $scope.isHeartRateValue = false;
                            $scope.isO2_SaturationValue = false;
                            $scope.isHeightValue = false;
                            $scope.isWeightValue = false;
                            $scope.isVitalKeys = false;
                            $scope.isVacant = false;
                            $scope.isCleaning = false;
                            $scope.isHeadCircumference = false;
                            if ($scope.speechStatus == true) {
                                msg.text = $scope.msg;
                                speechSynthesis.speak(msg);
                            }
                            $scope.chats.push({
                                "person": false,
                                "userMsg": $scope.msg
                            })
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                            $scope.isBlocked = true;
                        } else if ($scope.buttonKey == "4") {
                            $scope.isBpValue = false;
                            $scope.isTemperatureValue = false;
                            $scope.isPulseValue = false;
                            $scope.isRespiratoryRateValue = false;
                            $scope.isHeartRateValue = false;
                            $scope.isO2_SaturationValue = false;
                            $scope.isHeightValue = false;
                            $scope.isWeightValue = false;
                            $scope.isVitalKeys = false;
                            $scope.isVacant = false;
                            $scope.isBlocked = false;
                            $scope.isHeadCircumference = false;
                            if ($scope.speechStatus == true) {
                                msg.text = $scope.msg;
                                speechSynthesis.speak(msg);
                            }
                            $scope.chats.push({
                                "person": false,
                                "userMsg": $scope.msg
                            })
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                            $scope.isCleaning = true;
                        }
													
							else if ($scope.key == "1") {
                            $scope.buttonsDisabled = true;
                            $scope.isTemperatureValue = false;
                            $scope.isPulseValue = false;
                            $scope.isRespiratoryRateValue = false;
                            $scope.isHeartRateValue = false;
                            $scope.isO2_SaturationValue = false;
                            $scope.isHeightValue = false;
                            $scope.isWeightValue = false;
                            $scope.isVitalKeys = false;
                            $scope.isVacant = false;
                            $scope.isCleaning = false;
                            $scope.isBlocked = false;
                            $scope.isHeadCircumference = false;
                            if ($scope.speechStatus == true) {
                                msg.text = $scope.msg;
                                speechSynthesis.speak(msg);
                            }
                            $scope.chats.push({
                                "person": false,
                                "userMsg": $scope.msg
                            })
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                            var splitDD = $scope.dropdown2;
                            console.log($scope.dropDown2);
                            $scope.siteDropDown = splitDD.split(",");
                            var splitDD = $scope.dropdown1;
                            console.log($scope.dropDown1);
                            $scope.siteDropDown1 = splitDD.split(",");
                            $scope.isBpValue = true;
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                        } else if ($scope.key == "2") {
                            $scope.buttonsDisabled = true;
                            $scope.isBpValue = false;
                            $scope.isPulseValue = false;
                            $scope.isRespiratoryRateValue = false;
                            $scope.isHeartRateValue = false;
                            $scope.isO2_SaturationValue = false;
                            $scope.isHeightValue = false;
                            $scope.isWeightValue = false;
                            $scope.isVitalKeys = false;
                            $scope.isVacant = false;
                            $scope.isCleaning = false;
                            $scope.isBlocked = false;
                            $scope.isHeadCircumference = false;
                            if ($scope.speechStatus == true) {
                                msg.text = $scope.msg;
                                speechSynthesis.speak(msg);
                            }
                            $scope.chats.push({
                                "person": false,
                                "userMsg": $scope.msg
                            })
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);

                            var splitDD = $scope.dropdown1;
                            console.log($scope.dropdown1);
                            $scope.siteDropDown2 = splitDD.split(",");

                            $scope.isTemperatureValue = true;
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                        } else if ($scope.key == "3") {
                            $scope.buttonsDisabled = true;
                            $scope.isBpValue = false;
                            $scope.isTemperatureValue = false;
                            $scope.isRespiratoryRateValue = false;
                            $scope.isHeartRateValue = false;
                            $scope.isO2_SaturationValue = false;
                            $scope.isHeightValue = false;
                            $scope.isWeightValue = false;
                            $scope.isVitalKeys = false;
                            $scope.isVacant = false;
                            $scope.isCleaning = false;
                            $scope.isBlocked = false;
                            $scope.isHeadCircumference = false;
                            if ($scope.speechStatus == true) {
                                msg.text = $scope.msg;
                                speechSynthesis.speak(msg);
                            }
                            $scope.chats.push({
                                "person": false,
                                "userMsg": $scope.msg
                            })
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                            // site
                            var splitDD = $scope.dropdown3;
                            console.log($scope.dropdown3);
                            $scope.siteDropDown3 = splitDD.split(",");
                            /* rhythm*/
                            var splitDD = $scope.dropdown2;
                            console.log($scope.dropdown2);
                            $scope.siteDropDown4 = splitDD.split(",");
                            /* volume*/
                            var splitDD = $scope.dropdown1;
                            console.log($scope.dropdown1);
                            $scope.siteDropDown5 = splitDD.split(",");
                            $scope.isPulseValue = true;
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                        } else if ($scope.key == "4") {
                            $scope.buttonsDisabled = true;
                            $scope.isBpValue = false;
                            $scope.isTemperatureValue = false;
                            $scope.isPulseValue = false;
                            $scope.isHeartRateValue = false;
                            $scope.isO2_SaturationValue = false;
                            $scope.isHeightValue = false;
                            $scope.isWeightValue = false;
                            $scope.isVitalKeys = false;
                            $scope.isVacant = false;
                            $scope.isCleaning = false;
                            $scope.isBlocked = false;
                            $scope.isHeadCircumference = false;
                            if ($scope.speechStatus == true) {
                                msg.text = $scope.msg;
                                speechSynthesis.speak(msg);
                            }
                            $scope.chats.push({
                                "person": false,
                                "userMsg": $scope.msg
                            })
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                            var splitDD = $scope.dropdown1;
                            console.log($scope.dropdown1);
                            $scope.siteDropDown6 = splitDD.split(",");
                            $scope.isRespiratoryRateValue = true;
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                        } else if ($scope.key == "5") {
                            $scope.buttonsDisabled = true;
                            $scope.isBpValue = false;
                            $scope.isTemperatureValue = false;
                            $scope.isPulseValue = false;
                            $scope.isRespiratoryRateValue = false;
                            $scope.isO2_SaturationValue = false;
                            $scope.isHeightValue = false;
                            $scope.isWeightValue = false;
                            $scope.isVitalKeys = false;
                            $scope.isVacant = false;
                            $scope.isCleaning = false;
                            $scope.isBlocked = false;
                            $scope.isHeadCircumference = false;
                            if ($scope.speechStatus == true) {
                                msg.text = $scope.msg;
                                speechSynthesis.speak(msg);
                            };
                            $scope.chats.push({
                                "person": false,
                                "userMsg": $scope.msg
                            })
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                            var splitDD = $scope.dropdown1;
                            console.log($scope.dropdown1);
                            $scope.siteDropDown7 = splitDD.split(",");
                            $scope.isHeartRateValue = true;
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                        } else if ($scope.key == "6") {
                            $scope.buttonsDisabled = true;
                            $scope.isBpValue = false;
                            $scope.isTemperatureValue = false;
                            $scope.isPulseValue = false;
                            $scope.isRespiratoryRateValue = false;
                            $scope.isHeartRateValue = false;
                            $scope.isVitalKeys = false;
                            $scope.isVacant = false;
                            $scope.isCleaning = false;
                            $scope.isBlocked = false;
                            $scope.isHeightValue = false;
                            $scope.isWeightValue = false;
                            $scope.isHeadCircumference = false;
                            if ($scope.speechStatus == true) {
                                msg.text = $scope.msg;
                                speechSynthesis.speak(msg);
                            }
                            $scope.chats.push({
                                "person": false,
                                "userMsg": $scope.msg
                            })
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                            var splitDD = $scope.dropdown1;
                            console.log($scope.dropdown1);
                            $scope.siteDropDown8 = splitDD.split(",");
                            $scope.isO2_SaturationValue = true;
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                        } else if ($scope.key == "7") {
                            $scope.buttonsDisabled = true;
                            $scope.isBpValue = false;
                            $scope.isTemperatureValue = false;
                            $scope.isPulseValue = false;
                            $scope.isRespiratoryRateValue = false;
                            $scope.isHeartRateValue = false;
                            $scope.isO2_SaturationValue = false;
                            $scope.isWeightValue = false;
                            $scope.isVitalKeys = false;
                            $scope.isVacant = false;
                            $scope.isCleaning = false;
                            $scope.isBlocked = false;
                            $scope.isHeadCircumference = false;
                            if ($scope.speechStatus == true) {
                                msg.text = $scope.msg;
                                speechSynthesis.speak(msg);
                            }
                            $scope.chats.push({
                                "person": false,
                                "userMsg": $scope.msg
                            })
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                            $scope.isHeightValue = true;
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                        } else if ($scope.key == "8") {
                            $scope.buttonsDisabled = true;
                            $scope.isBpValue = false;
                            $scope.isTemperatureValue = false;
                            $scope.isPulseValue = false;
                            $scope.isRespiratoryRateValue = false;
                            $scope.isHeartRateValue = false;
                            $scope.isO2_SaturationValue = false;
                            $scope.isHeightValue = false;
                            $scope.isVitalKeys = false;
                            $scope.isVacant = false;
                            $scope.isCleaning = false;
                            $scope.isBlocked = false;
                            $scope.isHeadCircumference = false;
                            if ($scope.speechStatus == true) {
                                msg.text = $scope.msg;
                                speechSynthesis.speak(msg);
                            }
                            $scope.chats.push({
                                "person": false,
                                "userMsg": $scope.msg
                            })
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                            $scope.isWeightValue = true;
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                        } else if ($scope.key == "9") {
                            $scope.buttonsDisabled = true;
                            $scope.isBpValue = false;
                            $scope.isTemperatureValue = false;
                            $scope.isPulseValue = false;
                            $scope.isRespiratoryRateValue = false;
                            $scope.isHeartRateValue = false;
                            $scope.isO2_SaturationValue = false;
                            $scope.isHeightValue = false;
                            $scope.isVitalKeys = false;
                            $scope.isVacant = false;
                            $scope.isCleaning = false;
                            $scope.isBlocked = false;
                            if ($scope.speechStatus == true) {
                                msg.text = $scope.msg;
                                speechSynthesis.speak(msg);
                            }
                            $scope.chats.push({
                                "person": false,
                                "userMsg": $scope.msg
                            })
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                            $scope.isHeadCircumference = true;
                        } else {
                            $scope.isBpValue = false;
                            $scope.isTemperatureValue = false;
                            $scope.isPulseValue = false;
                            $scope.isRespiratoryRateValue = false;
                            $scope.isHeartRateValue = false;
                            $scope.isO2_SaturationValue = false;
                            $scope.isHeightValue = false;
                            $scope.isWeightValue = false;
                            $scope.isVitalKeys = false;
                            $scope.isVacant = false;
                            $scope.isCleaning = false;
                            $scope.isBlocked = false;
                            $scope.isHeadCircumference = false;
                            if ($scope.speechStatus == true) {
                                msg.text = $scope.msg;
                                speechSynthesis.speak(msg);
                            }
                            var botArray = $scope.msg.split("###@@@")
								var botMsg="";
								var i;
								//for (i = 0; i < cars.length; i++)
								for(i=0; i<botArray.length;i++){
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
							if($scope.buttonKey == "6"){
							$scope.isInDetail=true;
					
							}
							/* 
							$scope.chats.push({
                                "person": false,
                                "userMsg": botMsg
                            }) */
                            $timeout(function() {
                                var scroller = document.getElementById("autoscroll");
                                scroller.scrollTop = scroller.scrollHeight;
                            }, 0, false);
                        }
                    },
                    function(response) {
                        $scope.msg = "Service not Exists";
                        $scope.statusval = response.status;
                        $scope.statustext = response.statusText;
                        $scope.headers = response.headers();
                    });
            }
            $scope.inputValue = null;
            console.log($scope.key);
            finaSpeechResult = '';
            messageId.value = "";
        }
		$scope.logout = function(cache) {
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
            $http.post($scope.logoutUrl, JSON.stringify(dataObj)).then(function(response) {
                    console.log(response.data);

                    location.href = "./index.html";
                    sessionStorage.setItem("username", "redirect");
                },
                function(response) {
                    $scope.msg = "Service not Exists";
                    $scope.statusval = response.status;
                    $scope.statustext = response.statusText;
                    $scope.headers = response.headers();
                });
		}
        $scope.reset = function(cache) {
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
            $http.post($scope.resetUrl, JSON.stringify(dataObj)).then(function(response) {
                    console.log(response.data);

                    location.href = "./Chatbot.html";
                },
                function(response) {
                    $scope.msg = "Service not Exists";
                    $scope.statusval = response.status;
                    $scope.statustext = response.statusText;
                    $scope.headers = response.headers();
                });
        }
    }
]);
