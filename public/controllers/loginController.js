(function () {
    angular.module('app').controller('LoginController', loginController);

    function loginController($uibModal) {
        var vm = this;
        vm.animationsEnabled = true;
        vm.loginForm = function() {
            var modalInstance = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'modal/mLoginForm.html',
                controller: 'LoginFormController',
                controllerAs: 'vmm'
            });

            modalInstance.result.then(function () {
     
            }, function () {
      
             });
        }

        vm.adminForm = function() {
           var modalInstance = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'modal/mAdminForm.html',
                controller: 'AdminFormController',
                controllerAs: 'vmm'
            });

            modalInstance.result.then(function () {
     
            }, function () {
      
             });
        }

        vm.standarForm = function() {
            var modalInstance = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'modal/mStandarForm.html',
                controller: 'StandarFormController',
                controllerAs: 'vmm'
            });

            modalInstance.result.then(function () {
     
            }, function () {
                
             });
        };

         firebase.auth().onAuthStateChanged(function(user) {
            if (user) {//el usuario esta logueao 
				if(firebase.auth().currentUser.emailVerified){
                window.location = "index.html"
				}else{
					 firebase.auth().signOut();
				}
            } else {//si no esta logueado te redirigira al login
                // window.location = "login.html"; // si se desloguea que sea enviado a este otro html
                //firebase.auth().signOut() para desloguearme
            }
        });


    }
})();