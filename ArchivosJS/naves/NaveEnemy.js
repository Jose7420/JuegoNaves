class NaveEnemy extends Nave {



    constructor(posicionx_, posiciony_, fila_, celda_, spriterEnemy_) {

        super(posicionx_, posiciony_);

        this.filas = fila_;
        this.celda = celda_;

        this.spriterEnemy = spriterEnemy_;
        this.puntos = 0;
        
    }



    comprobarLimiteInferiorYCambioCoordenadas() {

        if (this.posicionActualY > 590) {
            console.log("Destruir la nave de la fila" + this.filas + " celda " + this.celda);
           this.posicionActualY = Math.random() * this.y + 1;
           this.posicionActualX = this.x + (Math.random() * 580 - this.x);           
            return true;
        }
        return false;

    }

    // dispararBala() {
    //     return Math.random() > 0.1 ? false :true;




    // }





}