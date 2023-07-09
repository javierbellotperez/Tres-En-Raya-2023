import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss']
})
export class TableroComponent{

  tablero:string[][] = [["","",""],
                        ["","",""],
                        ["","",""]];
  playerONE : boolean = true;
  playerTWO : boolean = false;
  numeroPartidas: number = 0;
  partidasGanadasO: number = 0;
  partidasGanadasX: number = 0;
  numeroEmpates : number = 0;
  numeroTurnos:number = 0;
  victoriaLineasYColumnas: boolean = false; //variable booleana que dice si se ha encontrado 3 en raya en la alguna linea o columna
  victoriaDiagonalPrincipal:boolean = false; //variable booleana que dice si se ha encontrado 3 en raya en la diagonal 1
  victoriaDiagonalInversa:boolean = false; //variable booleana que dice si se ha encontrado 3 en raya en la diagonal 2
  hijosGanadores:number[] =[0,0,0]; //array con los posibles ganadores de las filas y columnas
  hijosGanadoresDiagonal1:number[] =[0,0,0];//array con los posibles ganadores de la diagonal 1
  hijosGanadoresDiagonal2:number[] =[0,0,0];//array con los posibles ganadores de la diagonal 2
  arrayCombinacion: string[] =["","",""]; //array auxiliar para comprobar 3 casillas seguidas
  auxVictoriaDiagonalPrincipal: string[] =["","",""];
  auxVictoriaDiagonalInversa: string[] =["","",""];
  fichaJ1: string = "X"
  fichaJ2: string = "O";
  victoria : boolean = false;
  empate : boolean = false;


  //Audio de las animaciones

   audioX = new Audio();
   audioO = new Audio();
   audioEmpate = new Audio();
   audioVictoria = new Audio();




  constructor() {

  }

  ngOnInit(): void {
    this.audioX.src = '../../assets/sonido3enRaya/sonidoX.wav'
    this.audioO.src = '../../assets/sonido3enRaya/sonidoO.wav'
    this.audioEmpate.src = '../../assets/sonido3enRaya/sonidoVictoriaMEH.wav'
    this.audioVictoria.src = '../../assets/sonido3enRaya/sonidoVictoriaBUENO.wav'

  }


    cambioTurno(casillaX: number, casillaY:number, numeroHijo:number){
      // console.log(this.numeroTurnos);
      // console.log(this.tablero);
      // console.log(this.playerONE);
      // console.log(this.playerTWO);

      if(this.playerONE == true && this.tablero[casillaX][casillaY] == ""){
        this.tablero[casillaX][casillaY] = this.fichaJ1;
        this.pintarX(casillaX, casillaY,numeroHijo);
        this.audioX.play();
        this.playerONE = false;
        this.playerTWO = true;
        this.empateFinOSeguir("P1");
      }else if(this.playerTWO == true && this.tablero[casillaX][casillaY]  == ""){
        this.tablero[casillaX][casillaY] = this.fichaJ2;
        this.pintarO(casillaX, casillaY,numeroHijo);
        this.audioO.play();
        this.playerTWO = false;
        this.playerONE = true;
        this.empateFinOSeguir("P2");
      }

    }




  reiniciarPartida(){

    this.inhabilitarHabilitarClicks();


    this.quitarClaseEquisCirculo();
    if( this.victoria == true){
      this.añadirQuitarClaseVictoria();
      this.añadirQuitarOpacidad();
    }

    if ( this.empate == true){
      this.añadirQuitarClaseEmpate();
      for (let i = 0; i < 9; i++) {
        let hijo = document.querySelector(".opacidadBajada");
        hijo?.classList.remove("opacidadBajada")
      }
    }


    this.victoria = false;
    this.empate =false;


    this.tablero = [["","",""],
                  ["","",""],
                  ["","",""]];
    this.hijosGanadores = [0,0,0];
    this.hijosGanadoresDiagonal1 = [0,0,0];
    this.hijosGanadoresDiagonal2 = [0,0,0];
    this.arrayCombinacion = ["","",""];
    this.auxVictoriaDiagonalPrincipal = ["","",""];
    this.auxVictoriaDiagonalInversa = ["","",""];
    this.victoriaLineasYColumnas = false;
    this.victoriaDiagonalPrincipal = false;
    this.victoriaDiagonalInversa = false;
    this.numeroTurnos = 0;

  }


//comprueba si se ha de declarar empate o seguir con la partida
empateFinOSeguir(jugador: string){
  this.numeroTurnos=this.numeroTurnos + 1;
  if(this.numeroTurnos == 9){
    if(this.comprobarFinPartida(jugador) == false){
      this.declararEmpate();
    }
    else{
      this.comprobarFinPartida(jugador);
    }
  }

  if(this.numeroTurnos>=5){
    this.comprobarFinPartida(jugador);
  }


}



//declaramos empate en el tablero
declararEmpate(){
  this.empate = true;
  this.animacionEmpate();
  this.numeroEmpates = this.numeroEmpates + 1;
  setTimeout(() => {
    this.reiniciarPartida();
  }, 1500);
}


//comprueba que turno es , para así comprobar si el ultimo movimiento ha sido victoria. Esto lo hará llamando al método recorridoTablero
// el cual comprueba recorriendo el tablero si hay 3 X u O´s alineadas
comprobarFinPartida(jugador:string){
  if(jugador == "P1"){
    if(this.recorridoTablero("X") == true){
      this.sumarVictoria("X");
      this.animacionVictoria("X");
      return true;
    }
    return false;
  }
  else if(jugador == "P2"){
    if(this.recorridoTablero("O") == true){
      this.sumarVictoria("O");
      this.animacionVictoria("O");
      return true;
    }
    return false;
  }
  return null;
}


// recorre el tablero comprobando si existen 3 piezas alineadas
recorridoTablero(ficha:string){

  //compruebo filas ganadoras

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      this.arrayCombinacion[j]=this.tablero[i][j]
      switch(i){
        case 0: this.hijosGanadores[j] = i+1+j; break;
        case 1: this.hijosGanadores[j] = i+3+j; break;
        case 2: this.hijosGanadores[j] = i+5+j; break;
      }
    }

    for (let index = 0; index < 3; index++) {
      if(this.arrayCombinacion[index] != ficha){
        break;
      }
      if(index==2){
        this.victoriaLineasYColumnas = true;
        return true;
      }

    }
  }

  //compruebo columnas ganadoras

  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      this.arrayCombinacion[i]=this.tablero[i][j]
      switch(i){
        case 0: this.hijosGanadores[i] = i+1+j;
        break;
        case 1: this.hijosGanadores[i] = i+3+j;
        break;
        case 2: this.hijosGanadores[i] = i+5+j;
        break;
      }
    }
    for (let index = 0; index < 3; index++) {
      if(this.arrayCombinacion[index] != ficha){
        break;
      }
      if(index==2){
        this.victoriaLineasYColumnas = true;
        return true;
      }

    }
  }


  //compruebo diagonales 1 y 2 ganadoras
  let jDiag1=0;
  let jDiag2=2;
  for (let indi = 0; indi < 3; indi++) {
    this.auxVictoriaDiagonalPrincipal[indi] = this.tablero[indi][jDiag1];
    this.auxVictoriaDiagonalInversa[indi] = this.tablero[indi][jDiag2];
    this.hijosGanadoresDiagonal1[indi] = (indi*3) + (jDiag1 +1);
    this.hijosGanadoresDiagonal2[indi] = (indi*3) + (jDiag2 +1);
    jDiag1 = jDiag1+1;
    jDiag2 = jDiag2-1;
  }
  for (let index = 0; index < 3; index++) {
    if(this.auxVictoriaDiagonalPrincipal[index] != ficha){
      break;
    }
    if(index==2){
      this.victoriaDiagonalPrincipal = true;
      return true;
    }
  }
  for (let index = 0; index < 3; index++) {
    if(this.auxVictoriaDiagonalInversa[index] != ficha){
      break;
    }
    if(index==2){
      this.victoriaDiagonalInversa = true;
      return true;
    }

  }

  //en caso de que no exista un patrón ganador retorna false y el juego sigue.
  return false;

}






pintarX(casillaX : number,casillaY : number,numeroHijo:number){

  let casillaMarcada = document.querySelector(".hijo" + numeroHijo);
  casillaMarcada?.classList.add("equis");
  return true;
}

pintarO(casillaX : number,casillaY : number, numeroHijo:number){
  let casillaMarcada = document.querySelector(".hijo" + numeroHijo);
  casillaMarcada?.classList.add("circulo");
}







sumarVictoria(ficha: string){
  if ( ficha =="X"){
    this.partidasGanadasX = this.partidasGanadasX + 1;


    // let containerStrong = document.querySelector(".strongX");
    // document.querySelector(".strongX").innerHTML = this.partidasGanadasX.toString();
    // containerStrong?.classList.add('animacionMarcador');
    // setTimeout(function(){
    //   containerStrong?.classList.remove('animacionMarcador')
    // },100)
  }
  else if(ficha == "O"){
    this.partidasGanadasO = this.partidasGanadasO + 1;
  }
}




animacionVictoria(ficha:string){

  this.inhabilitarHabilitarClicks();
  this.añadirQuitarClaseVictoria();
  this.añadirQuitarOpacidad();
  this.victoria = true;
  this.audioVictoria.play();

  setTimeout(() => {
    this.reiniciarPartida();
  }, 1500);

}

animacionEmpate(){
  this.inhabilitarHabilitarClicks();
  this.añadirQuitarClaseEmpate();
  for (let i = 0; i < 9; i++) {
    let hijo = document.querySelector(".hijo" + (i+1));
    hijo?.classList.add("opacidadBajada");
  }
}

añadirQuitarOpacidad(){

  for (let i = 0; i < 9; i++) {

    if(this.victoriaDiagonalPrincipal == true){

      this.recorrerTableroOpacidad(i+1,"D1");
    }
    else if(this.victoriaDiagonalInversa == true){
      this.recorrerTableroOpacidad(i+1,"D2");
    }
    else if(this.victoriaLineasYColumnas == true){
      this.recorrerTableroOpacidad(i+1,"LC");
    }
  }
}

recorrerTableroOpacidad(i : number, diagonal : string){

  let hijo = document.querySelector(".hijo" + i);
  for(let j = 0; j < 3; j++){
    if(diagonal == "D1"){
      if( i == this.hijosGanadoresDiagonal1[j]){

        break;

      }
      else{
        if ( j == 2){

            hijo?.classList.toggle("opacidadBajada");

        }
      }
    }
    else if ( diagonal == "D2"){
      if( i == this.hijosGanadoresDiagonal2[j]){

        break;

      }
      else{
        if ( j == 2){

          hijo?.classList.toggle("opacidadBajada");

        }
      }
    }
    else if ( diagonal == "LC"){
      if( i == this.hijosGanadores[j]){

        break;

      }
      else{
        if ( j == 2){

          hijo?.classList.toggle("opacidadBajada");

        }
      }
    }
  }
}


inhabilitarHabilitarClicks(){
  for (let i = 0; i < 9; i++) {
    document.querySelector(".hijo" + (i+1))?.classList.toggle("inhabilitarClicks");
  }
}

añadirQuitarClaseEmpate(){
  let tablero = document.querySelector(".gridContainer");
  tablero?.classList.toggle("empate");
}


añadirQuitarClaseVictoria(){



  if(this.victoriaDiagonalPrincipal == true){

    let casillaGanadora1 = document.querySelector(".hijo" + this.hijosGanadoresDiagonal1[0]);
    let casillaGanadora2 = document.querySelector(".hijo" + this.hijosGanadoresDiagonal1[1]);
    let casillaGanadora3 = document.querySelector(".hijo" + this.hijosGanadoresDiagonal1[2]);

    casillaGanadora1?.classList.toggle("victoria");
    casillaGanadora2?.classList.toggle("victoria");
    casillaGanadora3?.classList.toggle("victoria");
  }
  else if(this.victoriaDiagonalInversa == true){
    let casillaGanadora1 = document.querySelector(".hijo" + this.hijosGanadoresDiagonal2[0]);
    let casillaGanadora2 = document.querySelector(".hijo" + this.hijosGanadoresDiagonal2[1]);
    let casillaGanadora3 = document.querySelector(".hijo" + this.hijosGanadoresDiagonal2[2]);

    casillaGanadora1?.classList.toggle("victoria");
    casillaGanadora2?.classList.toggle("victoria");
    casillaGanadora3?.classList.toggle("victoria");
  }
  else if(this.victoriaLineasYColumnas == true){
    let casillaGanadora1 = document.querySelector(".hijo" + this.hijosGanadores[0]);
    let casillaGanadora2 = document.querySelector(".hijo" + this.hijosGanadores[1]);
    let casillaGanadora3 = document.querySelector(".hijo" + this.hijosGanadores[2]);

    casillaGanadora1?.classList.toggle("victoria");
    casillaGanadora2?.classList.toggle("victoria");
    casillaGanadora3?.classList.toggle("victoria");
  }

}

quitarClaseEquisCirculo(){
  for (let i = 0; i < 9; i++) {
    document.querySelector(".hijo" + (i+1))?.classList.remove("equis");
    document.querySelector(".hijo" + (i+1))?.classList.remove("circulo");
  }
}


}



