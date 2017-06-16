(function () {

    angular
        .module('app')
        .factory('progressBarFactory', progressBarFactory);

    //factoria para manejar la progressBar
    /**
     * @namespace progressBarFactory
     * @description 
     * Factoria para manejar el progreso de la progressBar
     */
    function progressBarFactory() {
        var progress = 0;

        var factory = {
            /**
             * @method getProgress 
             * @memberof progressBarFactory
             * @return cantidad de progreso actual
             * @description Devuelve el progreso actual
             */
            getProgress: function () {
                return parseInt(progress);
            },
            /**
             * @method setProgress 
             * @memberof progressBarFactory
             * @param {number} num numero para poner
             * @description
             * Setea el progreso, si es mayor que 100 pone 100
             */
            setProgress: function (num) {
                progress = num > 100 ? 100 : num;
            },
            /**
             * @method initProgress 
             * @memberof progressBarFactory
             * @description
             * Inicializa el progreso a 0
             */
            initProgress: function () {
                progress = 0;
            },
            /**
             * @method sumProgress 
             * @memberof progressBarFactory
             * @param {number} num numero que suma
             * @description
             * Suma al progreso actual si supera 100 pone 100
             */
            sumProgress: function (num) {
                progress + num > 100 ? progress = 100 : progress += num;
            }
        };

        return factory;
    }
})();