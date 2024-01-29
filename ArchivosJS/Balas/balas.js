class Bala {


  constructor(x_, y_) {

    this.x = x_ + 13;//+10 //18;
    this.y = y_ - 22; //22;

    this.posicionActualX = this.x;
    this.posicionActualY = this.y;
    let destruida = false;


  }




  comprobarLimiteSuperior() {

    return this.posicionActualY < 10 ? false : true;

  }

  comprobarLimiteInferior() {

    return this.posicionActualY > 590 ? false : true;
  }

  

}

// Bala.prototype.modificarCoordenada = function () {

//   this.posicionActualX = this.x;

//   this.posicionActualY -= 1.5;

// }

