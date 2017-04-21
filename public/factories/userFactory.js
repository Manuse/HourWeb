(function () {
    angular
        .module('app')
        .factory('userFactory', userFactory);

    function userFactory(DATABASE, AUTH) {
        var users;
        var photo;
        AUTH.onAuthStateChanged(function (user) {
            if (user) { //el usuario esta logueao 
                if(firebase.auth().currentUser.emailVerified){
                //window.location = "index.html"
				}else{
					 firebase.auth().signOut();
				}
                 DATABASE.ref("user/").orderByChild("id").equalTo(AUTH.currentUser.uid).once("value", function (snapshot) {
                    for (var user in snapshot.val()) {                       
                        users = snapshot.val()[user];
                        photo = AUTH.currentUser.photoURL;
                    }
                });
            } else { //si no esta logueado te redirigira al login
                window.location = "login.html"; // si se desloguea que sea enviado a este otro html
                //firebase.auth().signOut() para desloguearme
            }
        });
        var factory = {
            getUser: function () {
                return users;
            },
            getPhoto: function(){
                return photo;
            }
        };
        return factory;
    }
})();