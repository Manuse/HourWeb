(function () {
    angular
        .module('app')
        .factory('userFactory', userFactory);

    function userFactory(DATABASE, AUTH, $timeout) {
        var users;
        var photo;
        var code;

        /**
         * Consulta los datos del usuario actual
         */
        function getData() {
            DATABASE.ref("user/").orderByChild("id").equalTo(AUTH.currentUser.uid).on("value", function (snapshot) {
                $timeout(function () {
                    users = snapshot.val()[Object.keys(snapshot.val())[0]];
                    photo = AUTH.currentUser.photoURL;
                    code = Object.keys(snapshot.val())[0];
                }, 0);
            });
        }

        var factory = {
            getUser: function () {
                return users;
            },
            getPhoto: function () {
                return photo;
            },
            setPhoto:function(url){
                photo=url;
            },
            setUser:function(user){
                users=user;
            },
            getCode: function(){
                return code;
            },
            getData : function(){
                getData();
            }
        };
        return factory;
    }
})();