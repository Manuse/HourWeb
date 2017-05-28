(function () {
    angular
        .module('app')
        .factory('userFactory', userFactory);

    function userFactory(DATABASE, AUTH, $timeout) {
        var users;
        var photo;
        AUTH.onAuthStateChanged(function (user) {
            if (user) { //el usuario esta logueao 
                if (AUTH.currentUser.emailVerified) {
                    //window.location = "index.html"
                } else {
                    AUTH.signOut();
                }
                getData();
            } else { //si no esta logueado te redirigira al login
                window.location = "login.html"; // si se desloguea que sea enviado a este otro html
                //firebase.auth().signOut() para desloguearme
            }
        });

        function getData() {
            DATABASE.ref("user/").orderByChild("id").equalTo(AUTH.currentUser.uid).once("value", function (snapshot) {
                $timeout(function () {
                    users = snapshot.val()[Object.keys(snapshot.val())[0]];
                    photo = AUTH.currentUser.photoURL;
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
            actualizarFactory: function () {
                getData();
            }
        };
        return factory;
    }
})();