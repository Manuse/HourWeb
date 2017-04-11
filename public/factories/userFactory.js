(function () {
        angular
            .module('app')
            .factory('userFactory', userFactory);

        function userFactory(DATABASE, AUTH) {
            var user = {}
            DATABASE.ref("user/").orderByChild("id").equalTo(AUTH.currentUser.uid).once("value", function (snapshot) {
                for (var user in snapshot.val()) {
                    user = snapshot.val()[user];
                }
            });
            var factory = {
                getUser: function() {
                    return user;
                },
                signOut: function() {
                    AUTH.signOut();
                }
                
            }
                return factory;
            }
        })();