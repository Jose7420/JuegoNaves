

function Nave(x_, y_) {

    this.nivel=1;

    this.x = x_;
    this.y = y_;
    this.animacionNave = [[108, 2], [126, 90], [126, 74],  [126, 38],[126, 56],[152,2],[181,2],[214,2],[249,2]];
   
    //(0 cerrado derecha, 1 abierto derecha, 2 cerrado izquierda, 3 cerrado izquierda)
    this.velocidad =  2;// Math.random()*3+1.5; 2.5;//1.4;
    this.tamañoX = 18;
    this.tamañoY = 16;

    this.posicionActualX = this.x;
    this.posicionActualY = this.y;

    this.destruida=false;
         

}
   
Nave.prototype.nuevasCoordenadasY = function(){
   
   // this.posicionActualY += this.velocidad +this.nivel*(Math.PI*Math.cos(this.posicionActualX))+5; //0.5;
   this.posicionActualY += this.velocidad +this.nivel+(Math.cos(this.posicionActualX+1));
  
    this.posicionActualX = (this.posicionActualX+1) + Math.sin(this.posicionActualY);
   


    
}







