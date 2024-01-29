const TOPEDERECHA = 550;

class NaveDefesora extends Nave {

    constructor(x_, y_) {

        super(x_, y_);
               
    }

    generaPosicionDerecha(){

       // this.x = this.x + this.velocidad+2;
       // this.posicionActualX=this.x;
       this.posicionActualX += this.velocidad+2;
        
        if (this.posicionActualX > TOPEDERECHA) {
    
            // If at edge, reset ship position and set flag.
            this.posicionActualX = TOPEDERECHA;
        }
    
    }

    generaPosicionIzquierda  () {
        this.posicionActualX  -= (this.velocidad+2);
        //this.x = this.x - (this.velocidad+2);
        //this.posicionActualX=this.x;
            
        if (this.posicionActualX < 20) {
    
            // If at edge, reset ship position and set flag.
            this.posicionActualX = 20;
        }
    
    }
   

}



