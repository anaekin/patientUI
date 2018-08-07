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
    
    /************ Initialization **************************/
    lc.lightTheme = false;
    lc.botThinking = true;
    lc.maxMessageCount = 30;
    lc.messageList = [];
    /***************** Initialization End ********************************/
    
    /***** Dummy Data *******************************/
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
    ];
/***** Dummy Data End *******************************/
    lc.send = function () {
        
        //delete the top element if count is greater than declared in 'lc.maxMessageCount' above
        if(lc.messageList.length > lc.maxMessageCount){
            lc.messageList.splice(0, lc.messageList.length - lc.maxMessageCount);
        }
        
        //insert the message typed in messageList
        if (lc.inputMsg && lc.inputMsg !== '') {
            lc.messageList.push({
                text: lc.inputMsg,
                person: true
            });

            lc.inputMsg = '';
        }
    };
    
    
    // changing theme dynamically
    lc.changeTheme = function(){
        lc.lightTheme = !lc.lightTheme;
        if( !lc.lightTheme ){
            lc.currentTheme = 'Dark';
            lc.themeCss = 'assets/css/color_dark.css';
            lc.botIconPath = 'assets/images/logo_light.png';
            lc.themeColor = '#00aa9d';
        } else {
            lc.currentTheme = 'Light';
            lc.themeCss = 'assets/css/color_light.css';
            lc.botIconPath = 'assets/images/logo_dark.png';
            lc.themeColor = '#FF5722';
        }
    };
    lc.changeTheme();

}]);
