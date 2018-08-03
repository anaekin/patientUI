var app = angular.module('LoginChat', []);
app.controller('LoginChatController', ['$scope', '$http', '$filter', '$log', '$timeout', '$sce',
	function ($scope, $http, $filter, $log, $timeout, $sce) {

	$scope.loginUrl = "http://10.5.6.15:8080/ChatBot/app/loginPage";
	$scope.discardUrl = "http://10.5.6.15:8080/ChatBot/app/discardingAndCreatingNewService";
	$scope.directUrl =  "http://10.5.6.15:8080/ChatBot/patientPortal/patientLogin";

		$scope.login = function (cache) {

			var environment = $scope.login.Environment;
			var username = document.getElementById('username').value;
			var password = document.getElementById('password').value;
			var SelectedUrl = document.getElementById('Environment').value;
			var encPassword = window.btoa(password);
			var input = document.getElementById("username");
			var selectUrl = document.getElementById('Environment');
			sessionStorage.setItem("username", input.value);
			sessionStorage.setItem('Environment', selectUrl.value);

			if (username == "" || password == "" || SelectedUrl == "") {
				alert("Please fill all the details.");
				return false;
			}
			else {
				var dataObj = { "userName": username, "userPassword": encPassword, "hisUrl": SelectedUrl };
				console.log(dataObj);
				var config = {
					headers: {
						'Content-Type': 'application/json;charset=UTF-8'
					}
				}
				$http.post($scope.loginUrl, JSON.stringify(dataObj)).then(function (response) {
					console.log(response.data);
					console.log(response.data.authenticateResponseMessage);
					if (response.data.authenticateResponseCode == 0) {
						location.href = "./Chatbot.html";

					}
					else if (response.data.authenticateResponseCode == 1070) {
						if (confirm('User session already exist. Do you want to discard and start new session?')) {
							var dataObj = { "userName": username };
							var config = {
								headers: {
									'Content-Type': 'application/json;charset=UTF-8'
								}
							}
							$http.post($scope.discardUrl, JSON.stringify(dataObj)).then(function (response) {
								console.log(response.data);
								if (response.data.isTokenValid == 1) {
									location.href = "./Chatbot.html";
								}
								else {
									alert("Please Refresh the page and try to Re-Login Again.")
								}
							},
								function (response) {
									$scope.msg = "Service not Exists";
									$scope.statusval = response.status;
									$scope.statustext = response.statusText;
									$scope.headers = response.headers();
								});
						}
					}
					else {
						alert(response.data.authenticateResponseMessage);
					}

				},
					function (response) {
						$scope.msg = "Service not Exists";
						$scope.statusval = response.status;
						$scope.statustext = response.statusText;
						$scope.headers = response.headers();
					});
			}
		}
		$scope.hospitalFrontpage = function(){
			location.href = "./hospitalLogin.html";
		}
		$scope.patientFrontpage = function(){
            location.href = "./patientChatbot.html";
//			$http.get($scope.directUrl).then(function (response) {
//				if(response.data.token)
//				{	
//					$scope.sessionToken= response.data.token;
//					location.href = "./patientChatbot.html";
//				}
//					else
//					alert("Token Failed");
//			});
			
		}
	}]);
