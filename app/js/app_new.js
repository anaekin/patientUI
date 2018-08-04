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
app.controller('LoginController', ['$scope', function ($scope) {
    var lc = this;

    lc.messageList = [{
        text: "Hi! How Can I help you? Please write or say something",
        person: false
    }, {
        text: "Hello I am Animesh. PLease book a doctor appointment",
        person: true
    }, ];

    lc.send = function () {
        if (lc.inputMsg && lc.inputMsg !== '') {
            lc.messageList.push({
                text: lc.inputMsg,
                person: true
            });
        }
    };

}]);
