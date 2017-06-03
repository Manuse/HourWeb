(function() {

    angular
        .module('app')
        .factory('progressBarFactory', progressBarFactory);


    function progressBarFactory() {
        var progress = 0;
        var factory = {
            getProgress: function(){
                return parseInt(progress);
            },
            setProgress:function(num){
                progress = num;
            },
            initProgress:function(){
                progress = 0;
            },
            sumProgress:function(num){
                 progress+num > 100 ? progress=100:progress+=num; 
            }
        };
        
        return factory;
    }
})();