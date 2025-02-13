class Coord {
    constructor (x,y,comida) {
        this.x = x;
        this.y = y;
        this.comida=comida
    }
}


let gusano = [];
gusano[0] = new Coord(10,10,false);



let canvas=null, lienzo=null, matriz=null ;
let size = 10;

let numFilas;
let numColumnas;

let pantalla = "11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111-";
pantalla	+= "1                                                                                                                                 1-";
pantalla	+= "1                                                                                                                                 1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                     3                                                         2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "         2                                                                                                               2         -";
pantalla	+= "         2                                                                                                               2         -";
pantalla	+= "         2                                                                                                               2         -";
pantalla	+= "         2                                                                                                               2         -";
pantalla	+= "         2                                                                                                               2         -";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1        2                                                                                                               2        1-";
pantalla	+= "1                                                                                                                                 1-";
pantalla	+= "1                                                                                                                                 1-";
pantalla    += "11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111";


//Posición inicial del personaje (un cuadrado)
let x=10,y=10;
let lastPress=null; //Variable para guardar la tecla presionada

let pause = true; 
//En nuestro juego, usaremos las teclas izquierda, arriba, derecha y abajo, cuyos codigos de teclado para la propriedad KeyboardEvent: code son
const KEY_LEFT = "ArrowLeft";
const KEY_UP = "ArrowUp";
const KEY_RIGHT = "ArrowRight";
const KEY_DOWN = "ArrowDown";
const KEY_SPACE = "Space";

function iniciar(){
    
    matriz = createMatriz (pantalla);
    configLienzo();
    pintarLienzo();
    //pintarMatrizTxt();
    document.addEventListener('keydown', function(event) { 
    
        if( (event.code == KEY_DOWN && lastPress == KEY_UP) || 
            (event.code == KEY_UP && lastPress == KEY_DOWN) ||
            (event.code == KEY_LEFT && lastPress == KEY_RIGHT) ||
            (event.code == KEY_RIGHT && lastPress == KEY_LEFT)){
            return;
        }
        if(event.code == KEY_SPACE){
            pause = true;
        }else if (event.code == KEY_RIGHT || event.code == KEY_LEFT || event.code == KEY_UP || event.code == KEY_DOWN) {
            pause = false;
            lastPress=event.code;
        }
        
    }, false);
  
   run();
}
function run(){
    //requestAnimationFrame(): informa al navegador de que quieres realizar una animación y solicita que el navegador programe el repintado de la ventana para el próximo ciclo de animación.

    sleep(100);
    requestAnimationFrame(run); //animación optimizada
    if(accionesJuego()){
        check();    
        pintarLienzo();
    }

}


function accionesJuego(){
    if(pause) return;
    //Modificamos la dirección que tendrá nuestro player en función de la tecla presionada   
    if (lastPress == KEY_RIGHT) {
        x += 1; 
    } else if (lastPress == KEY_LEFT) {
        x -= 1; 
    } else if (lastPress == KEY_UP) {
        y -= 1; 
    } else if (lastPress == KEY_DOWN) {
        y += 1; 
    } else if( lastPress == KEY_SPACE) {
        return false;
    }

    //verificaremos si el player ha salido del canvas, en cuyo caso, haremos que aparezca por el otro lado:
    if (x > numColumnas-1) x = 0; // Aparece por la izquierda
    if (x < 0) x = numColumnas-1; // Aparece por la derecha
    if (y > numFilas-1) y = 0; // Aparece por la parte superior
    if (y < 0) y = numFilas-1 ; // Aparece por la parte inferior

    gusano.unshift(new Coord(x,y,false));
    gusano.pop();

    return true;
}



function sleep(millis){
    var date = new Date();
    var curDate = null;
    do { 
        curDate = new Date(); 

    }while(curDate-date < millis);
}

window.addEventListener("load", iniciar, false);

function createMatriz (pantalla){
    let trozos = pantalla.split("-");
    
    let matriz = [];
    for(let trozo of trozos){
      matriz.push(trozo.split(""));
    }
    
    let numColumnas = matriz[0].length;
    for(let i = 0; i < matriz.length;i++){
        if(matriz[i].length != numColumnas){
          alert("La fila " + i + " tiene " + matriz[i].length + " columnas, deberia tener " + numColumnas);
          return null;
      }
    }
    
    return matriz;
}

function configLienzo(){

	numFilas = matriz.length;
    numColumnas = matriz[0].length;

    canvas=document.getElementById('canvas');
    canvas.height = numFilas * size;
    canvas.width = numColumnas * size;
    
    
	lienzo = canvas.getContext('2d');    
}

function pintarLienzo(){
    

    lienzo.fillStyle="#F7F9FA"; //le ponemos un color al lienzo
    lienzo.fillRect(0,0,canvas.width,canvas.height); //Dibujamos el lienzo
    
    
    for(let f = 0; f < numFilas; f++){
    	for(let c = 0; c < numColumnas; c++){
        	if(matriz[f][c] == "1"){
            	lienzo.fillStyle='#000';
                lienzo.fillRect(c*size,f*size,size,size); 
            }else if(matriz[f][c] == "2"){
            	lienzo.fillStyle='#00f';
                lienzo.fillRect(c*size,f*size,size,size); 
            }else if(matriz[f][c] == "3"){
                lienzo.fillStyle='#f00';
                lienzo.fillRect(c*size,f*size,size,size); 
            }
        }
    }

    
    for(let c of gusano){
        if(c.comida){
            lienzo.fillStyle='#0a0';
            lienzo.fillRect(c.x*size-1,c.y*size-1,size+2,size+2); 
        }else{
            lienzo.fillStyle='#0f0';
            lienzo.fillRect(c.x*size,c.y*size,size,size); 
            
        }
        
    }
    
}



function pintarMatrizTxt (){
    let result = "<pre>";
    for(let f of matriz){
        for(let c of f){
            result += c;
        }
        result += "\n";
    }
    result += "</pre>";


    document.getElementById("demo").innerHTML = result;
}

function check() {
    if(matriz[y][x] == 1 || matriz[y][x] == 2){
        alert("Has perdido :(");
    }else if(matriz[y][x] == 3){
        gusano[0].comida=true;
        gusano.unshift(new Coord(x,y,true));      
        genFood();  
    }
}

function genFood() {
    while(true){
        let randomX = rango(1,numFilas-2);
        let randomY = rango(1,numColumnas-2);
        if(matriz[randomX][randomY] == " "){
            matriz[randomX][randomY] = 3;
            
            return;
        }
    }
}

function rango(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
  