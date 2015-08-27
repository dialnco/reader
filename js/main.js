var readerApp = angular.module("readerApp", []);

function ReaderCtrl($scope, $timeout){

    $scope.player = {
        playing: false,
        slider: {
            getSlider: function(){
                return angular.element('#slider');
            },
            updateSlider: function(){
                $scope.player.slider.getSlider().val($scope.textController.getProgressPercentage());
            },
            updateDisplay: function(){
                $scope.textController.counter = $scope.player.getCounterPositionByPercentage($scope.player.slider.getSlider().val());
                $scope.textController.showNextChunk();
                $scope.$apply();
            }
        },
        getCounterPositionByPercentage: function(percentage){
            if(percentage == 100){
                return $scope.textController.splitText.length - 1;
            }
            return parseInt((percentage * $scope.textController.splitText.length) / 100);
        },
        play: function(){
            $scope.player.playing = true;
            $scope.player.playLoop();
        },
        playLoop: function(){
            if($scope.textController.hasMoreWords() && $scope.player.playing == true) {
                $scope.textController.showNextChunk();
                $scope.player.slider.updateSlider();
                $timeout($scope.player.playLoop, (1000 / ($scope.config.wordsPerMinute / 60)) * $scope.config.wordsPerChunk);
            } else {
                $scope.player.playing = false;
            }
        },
        pause: function(){
            $scope.player.playing = false;
        },
        restart: function(){
            $scope.player.textAlreadyReadAlert = false;
            $scope.textController.init();
            $scope.player.slider.updateSlider();
        }
    };

    $scope.textController = {
        defaultText: "Lectura veloz es el arte de la subvocalización silenciosa. La mayoría de los lectores tienen una velocidad de lectura promedio de 200 Ppm, lo que es cerca de la rapidez con que pueden leer un fragmento en voz alta. Esto no es coincidencia. Es la voz interna la que marca el ritmo en el que se avanza por el texto, la que evita que se logren velocidades de lectura más altas. Ellos solo pueden leer tan rápido como puedan hablar, porque esa es la forma en la que se les enseñó a leer, a travez de sistemas de lectura como el silabario y repeticiones fonéticas.\n\n"
            + "Sin embargo, es totalmente posible leer a velocidades mucho mas altas, con una comprensión de lectura mucho mejor, silenciando esta voz interna. La solución es simple - absorber el material de lectura más rápido de lo que la voz interna pueda seguir.\n\n"
            + "En el mundo real, la lectura veloz es lograda a través de métodos como leer pasajes usando un dedo para marcar tu camino. Leer a través de una pagina de texto siguiendo tu dedo linea por linea, a una velocidad mayor a la que normalmente leerías. Esto funciona porque el ojo es muy bueno en seguir movimientos. Incluso si en este punto has perdido una comprensión de lectura completa, es exactamente este método de entrenamiento el que te permitirá leer mas rápido.\n\n"
            + "Con la ayuda de un software como R3ader, es mucho mas simple lograr el mismo resultado con mucho menos esfuerzo. Carga un texto (como este mismo), y el software pasara por el texto a una velocidad predefinida, la cual puedes ajustar a medida que incremente tu comprensión de lectura.\n\n"
            + "Entrenar para leer mas rápido, primero debes encontrar tu rango base. Tu rango base es la velocidad a la que puedes leer un pasaje de texto con una completa comprensión. Hemos dejado como predeterminado 200ppm, mostrando una palabra a la ves, lo que es cerca del promedio en el que la gente lee normalmente.\n\n"
            + "Luego de que termines, dobla la velocidad de lectura modificando el valor de Palabras Por Minuto en la ventana de ajustes, ubicada en el menú desplegable en la parte inferior. Relee el texto. No deberías esperar entender todo - de hecho, lo mas seguro es que es que captes solo unas cuantas palabras aquí y allá. Si tienes una comprensión alta, probablemente signifique que necesites elegir una velocidad base mas alta y volver a iniciar esta prueba. Deberías estar esforzándote para mantener la velocidad en las que las palabras aparecen. Esta velocidad debería ser mas rápida que lo que la voz interna pueda “leer”.\n\n"
            + "Ahora, relee este pasaje de nuevo en tu rango base. Debería sentirse mucho más lento – de los contrario, intenta volver a hacer la prueba del cambio de velocidad. Ahora, trata de moverte un poco más de la velocidad base – por ejemplo, a 300ppm o 400ppm – y ve cuanto puedes comprender a esa velocidad.\n\n"
            + "Es básicamente esto - constantemente leer pasajes de texto a velocidades mas altas de  lo que puedas seguir, y sigue empujando el limite de lo que eres capaz. Encontrarás que cuando bajes a velocidades menores, serás capaz de comprender mucho mas de lo hubieras pensado posible.\n\n"
            + "Otro ajuste digno de ser mencionado en esta introducción es el tamaño del pedazo de texto – el cual es el numero de palabras que aparecerán a cada intervalo en la pantalla. Cuando lees en voz alta, solo puedes decir una palabra a la vez. Sin embargo, este limite no se aplica a la lectura veloz. Una vez que tu voz interna es acallada, y con una practica constante, puedes leer múltiples palabras a la vez. Esta es la mejor forma de lograr velocidades de lectura de 1000+ ppm. Empieza de a poco con 2 palabras a la vez, y descubre que a medida que la incrementes, 3, 4, o incluso tamaños mas grandes son posibles.\n\n"
            + "Buena suerte!",
        rawText: '',
        splitText: [],
        chunk: '',
        counter: 0,
        wordsPerChunk: 1,
        wordsPerMinute: 200,
        showNextChunk: function(){
            $scope.textController.chunk = $scope.textController.getNextChunk();
        },
        getNextChunk: function(){
            var tempChunk = '';
            var currentCounter = $scope.textController.counter;
            for(var i = currentCounter ; i < (currentCounter + $scope.textController.wordsPerChunk) && $scope.textController.hasMoreWords(); i++){
                var word = $scope.textController.getNextWord();
                tempChunk = tempChunk + ' ' + word;
            }
            return tempChunk;
        },
        getNextWord: function(){
            var word = $scope.textController.splitText[$scope.textController.counter];
            $scope.textController.counter = $scope.textController.counter + 1;
            return word;
        },
        init: function(){
            $scope.textController.counter = 0;
            $scope.textController.breakRawText();
            $scope.textController.showNextChunk();
        },
        breakRawText: function(){
            $scope.textController.splitText = $scope.textController.rawText.split(/\s+/);
        },
        hasMoreWords: function(){
            return $scope.textController.counter < $scope.textController.splitText.length;
        },
        getProgressPercentage: function(){
            return parseInt($scope.textController.counter * 100 / $scope.textController.splitText.length);
        },
        resetTextToDefault: function(){
            $scope.textController.rawText = $scope.textController.defaultText;
        }
    }

    $scope.navigation = {
        showHomeScreen: true,
        showReaderScreen: false,
        launchReaderScreen: function(){
            $scope.navigation.showHomeScreen = false;
            $scope.navigation.showReaderScreen = true;
            $scope.textController.init();
        },
        launchHomeScreen: function(){
            $scope.navigation.showHomeScreen = true;
            $scope.navigation.showReaderScreen = false;
            $scope.player.pause();
        }
    }

    $scope.config = {
        wordsPerChunkValues: [1, 2, 3, 4, 5, 6],
        wordsPerChunk: 1,
        wordsPerMinute: 200,
        valid: true,
        validWordsPerChunk: true,
        validWordsPerMinute: true,
        initConfigModal: function(){
            $scope.config.validWordsPerChunk = true;
            $scope.config.validWordsPerMinute = true;
            $scope.config.wordsPerChunk = $scope.textController.wordsPerChunk;
            $scope.config.wordsPerMinute = $scope.textController.wordsPerMinute;
            $scope.player.pause();
        },
        closeConfigModal: function(){
            angular.element('#configModal').foundation('reveal', 'close');
        },
        saveConfiguration: function(){
            if($scope.config.validation.validWordsPerChunk() & $scope.config.validation.validWordsPerMinute()){
                $scope.textController.wordsPerChunk = $scope.config.wordsPerChunk;
                $scope.textController.wordsPerMinute = $scope.config.wordsPerMinute;
                $scope.textController.init();
                $scope.player.slider.updateSlider();
                $scope.config.closeConfigModal();
            }
        },
        validation: {
            validWordsPerChunk: function(){
                var e = angular.element('#wordsPerChunk');
                var value = parseInt(e.val()) + 1;
                var valid = isInteger(value) && value > 0 && value <= 6;

                $scope.config.validWordsPerChunk = valid;
                return valid;
            },
            validWordsPerMinute: function(){
                var e = angular.element('#wordsPerMinute');
                var value = e.val();
                var valid = isInteger(value) && value >= 200 && value <= 1000;

                $scope.config.validWordsPerMinute = valid;
                return valid;
            }
        }
    };


    //Necessary code to start and configure the slider
    angular.element("#slider").noUiSlider({
        start: 0,
        step: 1,
        connect: 'lower',
        range: {
            'min': 0,
            'max': 100
        }
    });

    // Callback method
    angular.element("#slider").on({
        slide: function(){
            $scope.player.slider.updateDisplay();
        },
        change: function(){
            $scope.player.slider.updateDisplay();
        }
    })


    //initializing main text
    function init(){
        $scope.textController.resetTextToDefault();
    }
    init();

}

function isInteger(n) {
    return !isNaN(parseInt(n)) && isFinite(n) && n == parseInt(n);
}
