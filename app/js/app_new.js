var app = angular.module('NapierAssistant', []);
app.directive('ngEnter', function () {
    return {
        restrict: 'A',
        controller: 'LoginController',
        controllerAs: 'lc',
        link: function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        }
    };
});
app.directive('scrollBottom', function() {
	return {
        restrict: 'A',
        controller: 'LoginController',
        controllerAs: 'lc',
		link: function(scope, element) {
			scope.$watchCollection('lc.messageList', function() {
		    var $list = $(element).find('.message-list');
				var scrollHeight = $list.prop('scrollHeight');
				$list.animate({scrollTop: scrollHeight}, 500);			    
			});
		}
	};
});
app.controller('LoginController', ['$scope', function ($scope) {
    var lc = this;
    lc.themeCss = 'assets/css/color_new2.css';
    lc.lightTheme = true;
    lc.currentTheme = 'Light';
    
    lc.messageList = [{
        text: "Hi! How Can I help you? Please write or say something",
        person: false
    }, {
        text: "Hello I am Animesh. PLease book a doctor appointment",
        person: true
    }, {
        text: "Ok tell me the date",
        person: false
    }, {
        text: "I want to book for next wednesday",
        person: true
    }, {
        text: "Let me check if any doctor is available",
        person: false
    }, {
        text: "I am unable to find any availability. Do you want to try other days?",
        person: false
    }, {
        text: "Sure.",
        person: true
        }
//    , {
//        text: "There is availability for next Friday. Should I book the appointment?",
//        person: false
//    }, {
//        text: "Ok",
//        person: true
//    }, {
//        text: "Your appointment is booked for Friday 10:00AM at ABC Hospital.",
//        person: false
//    }, {
//        text: "Thank You",
//        person: true
//    }, {
//        text: "Your Welcome, Animesh!",
//        person: false
//    }
    ];

    lc.send = function () {
        if (lc.inputMsg && lc.inputMsg !== '') {
            lc.messageList.push({
                text: lc.inputMsg,
                person: true
            });

            lc.inputMsg = '';
        }
    };
    
    lc.changeTheme = function(){
        lc.lightTheme = !lc.lightTheme;
        if( !lc.lightTheme ){
            lc.currentTheme = 'Dark';
            lc.themeCss = 'assets/css/color.css';
        } else {
            lc.currentTheme = 'Light';
            lc.themeCss = 'assets/css/color_new2.css';
        }
    };

}]);
