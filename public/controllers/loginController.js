(function () {
    angular.module('app').controller('LoginController', loginController);

    function loginController(AUTH, DATABASE, modalFactory, $location) {
        var vm = this;
        vm.animationsEnabled = true;
        vm.loginForm = modalFactory.loginForm;
        vm.adminForm = modalFactory.adminForm;
        vm.standarForm = modalFactory.standarForm;

        AUTH.onAuthStateChanged(function (user) {
            if (user) { //el usuario esta logueao 
                if (AUTH.currentUser.emailVerified) {
                    DATABASE.ref("user/").orderByChild("id").equalTo(AUTH.currentUser.uid).once("value", function (snapshot) {
                       if(!snapshot.val()[Object.keys(snapshot.val())[0]].verificado){
                        DATABASE.ref("user/" + Object.keys(snapshot.val())[0]).update({
                            verificado: true
                        }).then(function () {
                            window.location = "index.html";
                        });
                       }else{
                           window.location = "index.html";
                       }
                    });


                } else {
                    AUTH.signOut();
                }
            } else { //si no esta logueado te redirigira al login
                // window.location = "login.html"; // si se desloguea que sea enviado a este otro html
                //firebase.auth().signOut() para desloguearme
            }
        });


    }
})();