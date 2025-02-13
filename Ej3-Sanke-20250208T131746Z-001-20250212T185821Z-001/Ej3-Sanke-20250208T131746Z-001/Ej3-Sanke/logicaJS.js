/* *************************************************************************** */ 
/* * CLASES ****************************************************************** */
/* *************************************************************************** */
class Coord {
    constructor (x,y,comida) {
        this.x = x;
        this.y = y;
        this.comida=comida
    }
}

/* *************************************************************************** */ 
/* * CONSTANTES ************************************************************** */
/* *************************************************************************** */

const KEY_LEFT = "ArrowLeft";
const KEY_UP = "ArrowUp";
const KEY_RIGHT = "ArrowRight";
const KEY_DOWN = "ArrowDown";
const KEY_SPACE = "Space";

const MATRIZ_BORDE = "1";
const MATRIZ_BARRERA = "2";
const MATRIZ_FRUTA = "3";
const MATRIZ_LIBRE = " ";

/* *************************************************************************** */ 
/* * VAR GLOBALES ************************************************************ */
/* *************************************************************************** */

let global_serpiente = [];
let global_x, global_y;

let global_canvas, global_lienzo;
let global_pixelsXCelda;

let global_matriz;
let global_matrizNumFilas;
let global_matrizNumColumnas;

let global_LastKey=null; 
let global_pause = true; 

let global_barreras=[];
let global_frutasComidas=0;
let global_musicaFondo;
let global_frutaComida = new Audio("sounds/mario-coin.mp3");
let global_FrutaScore = 0;
let global_retardo = 100;

/* *************************************************************************** */ 
/* * INICIO ****************************************************************** */
/* *************************************************************************** */

window.addEventListener("load", iniciar, false);

/* *************************************************************************** */ 
/* * FUNCIONES *************************************************************** */
/* *************************************************************************** */

function iniciar(){
    // Configurar la música de fondo
    global_musicaFondo = new Audio("sounds/soundtrack1.mp3");
    global_musicaFondo.loop = true;
    global_musicaFondo.volume = 0.5;
    global_musicaFondo.play();
    // Posicion inicial de la serpiente
    global_x=10;
    global_y=10;
    global_serpiente.push(new Coord(global_x,global_y,false));
    
    // Crear la matriz controlado
    if(createMatriz() == false) {
        return;
    }
    //printMatrizTxt();

    configLienzo();
    genFood(); 
    pintarLienzo();

    // Configurar el manejador que atiende al evento keydown
    document.addEventListener('keydown', handlerKeyDown, false);
  
    // Iniciar juego
    global_idAnimationFrame = window.requestAnimationFrame(run);


}

// ----------------------------------------------------------------------------------

function createMatriz (){
    // Crear matriz a partir de la pantalla
    global_matriz = [];

    let filas = global_pantalla.split("-");
    for(let fila of filas){
        global_matriz.push(fila.split(""));
    }


    // Calcular el numero de filas y columnas de la ma triz
    global_matrizNumFilas = global_matriz.length;
    global_matrizNumColumnas = global_matriz[0].length;

    // Verificar todas las filas tienen el mismo numero de columnas
    for(let i = 0; i < global_matrizNumFilas;i++){
        if(global_matriz[i].length != global_matrizNumColumnas){
          alert("La fila " + i + " tiene " + global_matriz[i].length + " columnas, deberia tener " + global_matrizNumColumnas);
          return false;
      }
    }
    return true;

}

// ----------------------------------------------------------------------------------

function printMatrizTxt (){
    let result = "<pre>";
    for(let fila of global_matriz){
        for(let celda of fila){
            result += celda;
        }
        result += "\n";
    }
    result += "</pre>";


    document.getElementById("demo").innerHTML = result;
}

// ----------------------------------------------------------------------------------

function configLienzo(){
    // Numero de pixeles por celdA
    global_pixelsXCelda = 10;

    // Establece el tamaño del canvas al tamaño de la matriz teniendo en cuenta el numero de pixeles por celda
    global_canvas=document.getElementById('canvas');
    global_canvas.height = global_matrizNumFilas    * global_pixelsXCelda;
    global_canvas.width  = global_matrizNumColumnas * global_pixelsXCelda;
       
    // Obtiene el lienzo
	global_lienzo = global_canvas.getContext('2d');    
}

// ----------------------------------------------------------------------------------

function pintarLienzo(){
    // Limpiar el lienzo antes de pintar
    global_lienzo.clearRect(0, 0, global_canvas.width, global_canvas.height);
    // Pintar el fondo
    global_lienzo.fillStyle="rgba(255, 255, 255, 0.5)"; 
    global_lienzo.fillRect(0,0,global_canvas.width,global_canvas.height);     

    // Pintar la matriz ( Bordes, Barreras y Comida)    
    for(let f = 0; f < global_matrizNumFilas; f++){
    	for(let c = 0; c < global_matrizNumColumnas; c++){
        	if(global_matriz[f][c] == MATRIZ_BORDE){
                printRect (f, c, '#000');

            }else if(global_matriz[f][c] == MATRIZ_BARRERA){
                printRect (f, c, '#00f');

            }else if(global_matriz[f][c] == MATRIZ_FRUTA){
                printRect (f, c, '#f00');
            }
        }
    }

    // Pintar serpiente
    for(let c of global_serpiente){
        if(c.comida){
            printRect (c.y, c.x, '#0a0');
        }else{         
            printRect (c.y, c.x, '#0f0');
        }
        
    }
    
}

// ----------------------------------------------------------------------------------

function printRect (y, x, color) {
    global_lienzo.fillStyle=color;
    global_lienzo.fillRect(x*global_pixelsXCelda, y*global_pixelsXCelda, global_pixelsXCelda, global_pixelsXCelda); 
}

// ----------------------------------------------------------------------------------

function handlerKeyDown (event) { 
    
    // Impedir la dirección contraria
    if( (global_LastKey == KEY_UP    && event.code == KEY_DOWN ) || 
        (global_LastKey == KEY_DOWN  && event.code == KEY_UP   ) ||
        (global_LastKey == KEY_RIGHT && event.code == KEY_LEFT ) ||
        (global_LastKey == KEY_LEFT  && event.code == KEY_RIGHT)){
        return;
    }

    // Detectar y activar pausa
    if(event.code == KEY_SPACE){
        global_pause = true;
        return;
    }
    
    // Detectar la dirección y guardarla en LastKey
    if (event.code == KEY_RIGHT || event.code == KEY_LEFT || event.code == KEY_UP || event.code == KEY_DOWN) {
        global_pause = false;
        global_LastKey=event.code;
    }
    
}

// ----------------------------------------------------------------------------------

function run(){
    if(accionesJuego() == true){
        pintarLienzo();
    }
    window.requestAnimationFrame(run); 
    sleep(global_retardo);
}

// ----------------------------------------------------------------------------------

function accionesJuego(){
    if(global_pause) return false;

    //Modificamos la dirección que tendrá nuestro player en función de la tecla presionada   
    if (global_LastKey == KEY_RIGHT) {
        global_x += 1; 
    } else if (global_LastKey == KEY_LEFT) {
        global_x -= 1; 
    } else if (global_LastKey == KEY_UP) {
        global_y -= 1; 
    } else if (global_LastKey == KEY_DOWN) {
        global_y += 1; 
    } 

    check();  

    global_serpiente.unshift(new Coord(global_x,global_y,false));
    global_serpiente.pop();

    return true;
}

// ----------------------------------------------------------------------------------

function sleep(millis){
    var date = new Date();
    var curDate = null;
    do { 
        curDate = new Date(); 

    }while(curDate-date < millis);
}

// ----------------------------------------------------------------------------------

function check() {
    if (global_x > global_matrizNumColumnas-1) {
        global_x = 0; 

    }else if (global_x < 0) { 
        global_x = global_matrizNumColumnas-1;

    }else if (global_y > global_matrizNumFilas-1) {
        global_y = 0;
        
    }else if (global_y < 0){
        global_y = global_matrizNumFilas-1;

    }else if(global_matriz[global_y][global_x] == MATRIZ_BORDE || 
             global_matriz[global_y][global_x] == MATRIZ_BARRERA ||
             chocarConSerpiente()){
        alert("Has perdido :(");
        window.location.reload();
        
    }else if(global_matriz[global_y][global_x] == MATRIZ_FRUTA){
        global_frutaComida.play();
        global_frutasComidas++;
        global_serpiente.unshift(new Coord(global_x,global_y,true));
        global_matriz[global_y][global_x] = MATRIZ_LIBRE;   
        global_FrutaScore++;
        document.getElementById("contadorFrutaValue").innerHTML = global_FrutaScore;
        genFood();  
        genBarreras();
        if(global_retardo > 0){
            global_retardo -= 5;
        }

    }
}

// ----------------------------------------------------------------------------------

function chocarConSerpiente() {
    if(global_serpiente.length < 4){
        return false;
    }
    for(let i = 4; i < global_serpiente.length; i++ ){
        if(global_serpiente[0].x == global_serpiente[i].x &&
           global_serpiente[0].y == global_serpiente[i].y ){
            return true;
        }  
    }
    return false;
}

// ----------------------------------------------------------------------------------

function genFood() {    
    
    while(true){
        let randomY = rango(1,global_matrizNumFilas-2);
        let randomX = rango(1,global_matrizNumColumnas-2);
        if(global_matriz[randomY][randomX] == MATRIZ_LIBRE){
            global_matriz[randomY][randomX] = MATRIZ_FRUTA;
            
            return;
        }
    }
}

function rango(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
  
function genBarreras() {
    // borrar barreras
    for(let b of global_barreras){
        global_matriz[b.y][b.x] = MATRIZ_LIBRE;
    }
    global_barreras=[];

    // Generar barreras aleatoriamente
    for(let i = 0; i < global_frutasComidas; i++){
        let barrera = genBarrera();
        global_barreras.push(barrera);
        global_matriz[barrera.y][barrera.x] = MATRIZ_BARRERA;
    }

}

function genBarrera() {    
    
    while(true){
        let randomY = rango(0,global_matrizNumFilas-1);
        let randomX = rango(0,global_matrizNumColumnas-1);
        if(global_matriz[randomY][randomX] == MATRIZ_LIBRE){
            
            return new Coord(randomX,randomY);
        }
    }
}