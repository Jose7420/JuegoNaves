// UT4 - Animaciones

window.onload = function () {

    const TOPEDERECHA = 550;

    const ANCHURA_MAX_COLISION_NAVE = 22;
    const ALTURA_MAX_COLISION_NAVE = 22;

    let audioStart;
    let audioDisparo;
    let audioDestruncion;

    let vidas = 3;
    let ronda = 1;


    let nEnemiga;
    let bala;
    let x = 250;//20;
    let y = 580;
    let canvas;
    let ctx;

    let xIzquierda;
    let xDerecha
    let ejecutarDerecha = true;
    let barraSpace;

    let puntos = 0;

    let idSonidoStart;


    let nivelDelJuego = 1;

    let posicionInicio = 0;
    let posicion = 0;
    let miNave;
    let imagen;
    let naveEnemigas = new Array();
    let disparoBalaDefesora = new Array();
    let disparoBalaEnemiga = new Array();



    // rellena en array con naves Enemigas
    // se recorrera unos bucles anidados para enviar por parametro las coordenadas 'x' e 'y',
    // y el sprite que corresponda segun la posicion de la coordenadas.
    // se enviara por parametro las coordenadas y el sprite a una funcion que creara el objeto 
    // y lo introducira dentro de un array.
    function crearNavesEnemigas() {

        let filaDiferencia = 60
        for (let fila = 0; fila < 5; fila++) {
            diferencia = 50;
            filaDiferencia += 37;
            for (let celda = 0; celda < 10; celda++) {
                diferencia += 40;

                if (fila == 0 && (celda > 2 && celda < 7)) {
                    crearNaveEnemiga(fila, celda, diferencia, filaDiferencia, 3, 300);
                }
                else if ((fila == 1 || fila == 2) && (celda > 0 && celda < 9)) {
                    crearNaveEnemiga(fila, celda, diferencia, filaDiferencia, 2, 200);

                } else if (fila > 2) {
                    crearNaveEnemiga(fila, celda, diferencia, filaDiferencia, 1, 100);
                }

            }

        }

    }


    // crear una nave enemiga con las coordenadas pasadas por parametro.
    // y con el sprite correspondiente para la posicion que tenga.
    // y introducirla en el array.
    function crearNaveEnemiga(fila_, celda_, x_, y_, spriterEnemy_, puntos_) {

        nEnemiga = new NaveEnemy(x_, y_, fila_, celda_, spriterEnemy_);
        nEnemiga.filas = spriterEnemy_;
        nEnemiga.nivel = nivelDelJuego;
        nEnemiga.puntos = puntos_
        naveEnemigas.push(nEnemiga);


    }

    // crear la una bala con las coordenadas pasadas por parametros.
    function crearBala(x_, y_, objBala, arrayDisparo) {

        bala = new objBala(x_, y_);
        arrayDisparo.push(bala);

    }


    // elegir una nave aleatoriamente para que dispare.
    function disparoAleatorio(numeroInferior, numeroSuperior) {

        let posibilidades = numeroSuperior - numeroInferior;
        let numeroAleatorio = Math.floor(Math.random() * posibilidades);

        return (numeroInferior + numeroAleatorio);

    }



    function pintarNaveDefensora() {


        if (xDerecha) {
            miNave.generaPosicionDerecha();
        }
        if (xIzquierda) {

            miNave.generaPosicionIzquierda();

        }
        if (barraSpace) {
            reproducirSonidoDisparo();
            crearBala(miNave.posicionActualX, miNave.posicionActualY, BalaDefesora, disparoBalaDefesora);
        }


        // Pintar nave Defensora
        ctx.drawImage(miNave.imagen,
            miNave.animacionNave[posicion][0],
            miNave.animacionNave[posicion][1],
            miNave.tamañoX,
            miNave.tamañoY,
            miNave.posicionActualX,
            miNave.posicionActualY,
            miNave.tamañoX + 22,
            miNave.tamañoY + 22);


    }


    // Metodo para dibujar las naves Enemigas y comprobar la colision 
    // con la nave defensora.
    function dijujarNavesEnemiga() {

        for (let i = 0; i < naveEnemigas.length; i++) {


            // crear nueva la coordenada Y
            naveEnemigas[i].nuevasCoordenadasY();

            // crear aleatorieda para los disparos
            if (disparoAleatorio(0, naveEnemigas.length * 10) == 4) {

                // reproducir el sonido del disparo y crear la bala para la nave selecionada.
                reproducirSonidoDisparo();

                // Para la creacion de la bala.
                // se envia por parametros las coordenadas de la nave, el objeto de balaEnemiga y el array de disparo para el enemigo.                
                crearBala(naveEnemigas[i].posicionActualX, naveEnemigas[i].posicionActualY, BalaEnemiga, disparoBalaEnemiga);

            }

            // comprobar si la naveEnemiga y naveDefesora han colisionado.
            if (colision(naveEnemigas[i], miNave)) {

                reproducirSonidoDestruccion();
                vidas--;
                naveEnemigas[i].destruida = true;
            }


            // Recoger la posicion almacenada en el array
            // de naveEnemiga del sprite para dibujar el que le corresponda.
            let spriterEnemiga = naveEnemigas[i].spriterEnemy;

            // prototipo para comprobar si se ha llegado al limite inferior del canvas para cambiar las coordenadas.
            naveEnemigas[i].comprobarLimiteInferiorYCambioCoordenadas();


            // Dibjuar nave Enemiga.
            ctx.drawImage(imagen,
                naveEnemigas[i].animacionNave[spriterEnemiga][0],
                naveEnemigas[i].animacionNave[spriterEnemiga][1],
                18, 16,
                naveEnemigas[i].posicionActualX /*+ despazamiento*/,
                naveEnemigas[i].posicionActualY,
                naveEnemigas[i].tamañoX + 22,
                naveEnemigas[i].tamañoY + 22
            );

        }

    }

    // Dibujar los disparos con los parametros enviados
    // para el obj1 bala disparoBalaDefensora obj2 naveEnemigas y un caso y en otro caso es
    // obj1 disparoBalaEnemiga  obj2 nave Defensora 
    function dibujarDisparo(obj1, obj2) {

        for (let i = 0; i < obj1.length; i++) {


            // comprobar si las balas han llegado al limite inferior o superior.
            // para ser destruidas o sino dibujar los objetos enviados.
            if (obj1[i].comprobarLimiteSuperior() || obj1[i].comprobarLimiteInferior()) {

                obj1[i].modificarCoordenada();

                ctx.drawImage(imagen,
                    312,
                    120,
                    10,
                    10,
                    obj1[i].posicionActualX,
                    obj1[i].posicionActualY,
                    22,
                    22
                );

                // comprobar si nave es la nave defensora.
                // si es la nave defesora se comprobara que tenga colision con otro objeto.
                if (obj2 == miNave) {

                    if (colision(obj1[i], miNave)) {
                        obj1[i].destruida = true;
                        vidas--;
                        console.log(obj1[i]);
                        console.log("vidas " + vidas);
                    }


                } else {

                    // recorer la lista para comprobar si hay colision con alguno de la lista
                    // de naves enemigas.
                    // para poner al objeto como destruido si hay colision con la bala.
                    obj2.forEach(naveE => {
                        if (colision(obj1[i], naveE)) {

                            naveE.destruida = true;
                            obj1[i].destruida = true;

                        }
                    });
                }



            } else {
                // destruir el objeto si llega a los limites inferior o superior y continuar con el bucle.
                obj1.splice(i, 1);
                continue;
            }


        }

        console.log("disparo:  " + obj1.length);

    }

    // dibujar las vidas que quedan.
    function dibujarNavesDeVida() {

        let i2 = 10;

        let y1 = 640;

        for (let i = 0; i < vidas; i++) {
            ctx.drawImage(imagen,
                108, 2, 18, 16, i2, y1, 28, 26);
            i2 += 30;

        }

    }

    // Dibujar el marcador del juego.
    function dibujarPuntos() {

        ctx.font = "20px consolas"
        ctx.fillStyle = "white";
        ctx.fillText("Puntos: " + sumaDePuntos(), 20, 40);
    }

    // Dibujar el texto de Ganador o Perdedor.
    function pintarTextoGanadorPerdedor(text_) {
        ctx.font = "20px consolas"
        ctx.fillStyle = "white";
        ctx.fillText(text_, 150, 350);
    }

    function activaMovimiento(evt) {

        switch (evt.keyCode) {

            // Left arrow.
            case 37:

                xIzquierda = true;
                break;

            // Right arrow.
            case 39:

                xDerecha = true;
                break;

            // Space bar.   
            case 32:
                barraSpace = true;
                break;

        }
    }


    function desactivaMovimiento(evt) {


        switch (evt.keyCode) {

            // Left arrow
            case 37:
                xIzquierda = false;
                break;

            // Right arrow 
            case 39:
                xDerecha = false;
                break;
            case 32:
                barraSpace = false;
                break;

        }

    }

    // Destruir el objeto enviado por parametro.
    // los objetos puede ser balas y nave enemiga.
    function destruirObjeto(obj) {

        for (let elemento in obj) {
            if (obj[elemento].destruida) {
                reproducirSonidoDestruccion();
                obj.splice(elemento, 1);
                continue;
            }
        }
    }


    // metodo par sumar los puntos de las naves enemigas destruidas. 
    function sumaDePuntos() {

        // comprobar que exista naves enemigas para hacer el foreach para el recuento de los puntos.
        // si no hubiera nave enemigas se sumaria cero.
        (naveEnemigas.length > 0) ? naveEnemigas.forEach(elemento => {
            if (elemento.destruida == true)
                puntos += elemento.puntos;
        }) : 0;

        console.log(puntos);
        return puntos;


    }


    // Comprobar que hay colision de los objetos envidos por parametros.
    function colision(obj, obj2) {

        if (
            (obj.posicionActualX < obj2.posicionActualX + ANCHURA_MAX_COLISION_NAVE) &&
            (obj.posicionActualX + ANCHURA_MAX_COLISION_NAVE > obj2.posicionActualX) &&
            (obj.posicionActualY + ALTURA_MAX_COLISION_NAVE > obj2.posicionActualY) &&
            (obj.posicionActualY < obj2.posicionActualY + ANCHURA_MAX_COLISION_NAVE)) {

            return true;

        }
        return false;

    }

    // Metodo para resetear los valores.
    function resetearValores() {
        ronda = 1;
        vidas = 3;
        nivelDelJuego = 2;
        puntos = 0;
        miNave.posicionActualX = miNave.x;
        borrarDisparosNaves();
        posicion = 0;

    }

    // Metodo para cambiar los valores 
    // poner las vidas a tres y subir el nivel del juego
    // haciendo que las naves enemigas vayan más rapidas.
    function nextNivel() {
        vidas = 3;
        nivelDelJuego += 2.5;
        miNave.posicionActualX = miNave.x;
        borrarDisparosNaves();
        posicion = 0;

    }


    // Borrar las naves enemigas y los disparos de los enemigos como de la nave Defesora.
    // y la creacion de naves enemigas desde cero.
    function borrarDisparosNaves() {

        naveEnemigas.splice(0, naveEnemigas.length);
        disparoBalaDefesora.splice(0, disparoBalaDefesora.length);
        disparoBalaEnemiga.slice(0, disparoBalaEnemiga.length);
        crearNavesEnemigas();


    }


    // Reproducion de los Sonidos del juego.
    // para el inicio, los disparos y la destruccion.
    function reproducirSonidoStart() {
        // reproducir el sonido del inicio por un intervalo de un segundo.
        idSonidoStart = setInterval(() => {
            audioStart.play();
        }, 1000);

    }

    function reproducirSonidoDisparo() {
        audioDisparo.play();

    }


    function reproducirSonidoDestruccion() {
        audioDestruncion.currentTime = 0;
        audioDestruncion.play();
    }

    // metodo del comienzo del juego.
    function inicioDelJuego() {

        // pausar el audio del inicio.
        audioStart.pause();

        // para la iteracion del audio de inicio.
        clearInterval(idSonidoStart);

        // desabilitar el boton y ocultarlo.
        botonInicio.disabled = true;
        botonInicio.style.display = "none";

        // resetear los valores.
        resetearValores();

        // establecer el nivel del juego cuando empieza en uno.
        nivelDelJuego = 1;


        // interacion para el juego.
        id = setInterval(() => {

            // comprobar que existan naves enemigas y que las vidas sea superiores a cero.
            if (naveEnemigas.length > 0 && vidas > 0) {

                ctx.clearRect(0, 0, 600, 700);
                dibujarPuntos();
                destruirObjeto(naveEnemigas);
                destruirObjeto(disparoBalaDefesora);
                destruirObjeto(disparoBalaEnemiga);
                dijujarNavesEnemiga();
                dibujarNavesDeVida();

                pintarNaveDefensora();

                // comprobar que exista balas para nave del jugador
                // si existe dibujar los disparos.
                if (disparoBalaDefesora.length > 0) {

                    dibujarDisparo(disparoBalaDefesora, naveEnemigas);
                }

                // comprobar que exista balas para nave enemiga.
                // si existe dibujar los disparos.
                if (disparoBalaEnemiga.length > 0) {

                    dibujarDisparo(disparoBalaEnemiga, miNave);
                }


            } else {


                if (vidas == 0) {

                    ctx.clearRect(0, 640, 600, 700);
                    pintarTextoGanadorPerdedor("¡¡¡ Has Perdido. !!!");
                    clearInterval(id);
                    botonInicio.disabled = false;
                    botonInicio.style.display = "inline";
                    reproducirSonidoStart();





                } else {
                    //resetear el juego con otro nivel.
                    if (ronda >= 1 && ronda <= 3) {
                        ronda++;
                        console.log("Nivel " + ronda);
                        nextNivel();
                    } else {

                        console.log("has ganado");
                        clearInterval(id);
                        botonInicio.disabled = false;
                        botonInicio.style.display = "inline";
                        pintarTextoGanadorPerdedor("¡¡¡¡ Has Ganado!!! \npor " + puntos + ".");
                        reproducirSonidoStart();


                    }

                }

            }

        }, 1000 / 20);



    }

    // localizar los Sonidos.
    audioStart = document.getElementById("start");
    audioDisparo = document.getElementById("disparo");
    audioDestruncion = document.getElementById("destruccion");


    // localizamos el canvas
    canvas = document.getElementById("miCanvas");

    // Generamos el contexto de trabajo
    ctx = canvas.getContext("2d");

    // Selecionar la ruta del Sprite board y asignarselo al una variable image para
    // usarla en la selecion de imagenes para el juego.
    imagen = new Image();
    imagen.src = "./imagenes/navesgif.gif";

    // creacion en la classe nave el prototipo de imagen y asignarle la imagen del sprite board.
    Nave.prototype.imagen = imagen;

    // creacion de la nave del jugador.
    miNave = new NaveDefesora(x, y);

    // creacion de escuchadores  para el teclado.
    document.addEventListener("keydown", activaMovimiento, false);
    document.addEventListener("keyup", desactivaMovimiento, false);

    let botonInicio = document.getElementById("boton");
    botonInicio.disabled = false;

    // creacion del escuchador para el boton inicion.
    botonInicio.addEventListener("click", inicioDelJuego, false);

    // reproducir el sonido del inicio por un intervalo de un segundo.
    reproducirSonidoStart();


}
