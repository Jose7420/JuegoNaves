class BalaEnemiga extends Bala {

    constructor(x_, y_) {
        
        

        super(x_, (y_ +44));
       
        
        
    }

    modificarCoordenada() {

        this.posicionActualY += 10;

    }

    


}