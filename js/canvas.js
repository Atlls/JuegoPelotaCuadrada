/** 

Bugs: (Observar Notas de lineas...)
	+ Mov's de LennyFace 0,0: Si son 0,0; LennyFace se queda en un solo sitio y no se mueve.
	+- Traspaso de borde: LannyFace traspasa el borde ocultandose, esto pasa en las parte Der y Abajo del canvas.
	+- Sobrado de linea: LennyFace cuando llega a la Izq y Arriba, queda un espacio sin rellenar.
	+ No hay límites de click's: Si da mas clicks, LennyFace va mas rápido.
	- A veces suma mas de un punto el rebote: Cuando tiene un vector grande y choca y cambia a un vector pequeño, avanza y vuelve a chocar causando que sume mas de un punto. No estoy muy seguro de que ese sea el motivo, pero el bug pasa 1 de cada 12 veces mas o menos
	+ Marca nuevo tiempo al dar clock mientras juegas.
Mojoras:
	+- El movimiento de LennyFace a veces es MUY lento y MUY rápido.
	+ El codigo de movimiento al principio se hace dos veces seguidas.

**/

/* Variables Globales */

// Lenny Face
const lfi = new Image(23,17);
lfi.src = 'img/Lenny Face.png';
// Canvas
const canvas = document.getElementById('myCanvas');
// Objetos del canvas
const ctx = canvas.getContext('2d');
const points = canvas.getContext('2d');
const rectangle = canvas.getContext('2d');
// Definicion de los límites
const maxWidth = canvas.width - lfi.width * 1.5 + 1; // Capricho extraño que tengo
const maxHeight = canvas.height - lfi.height;



/* Objetos */

class InterfazCanvas {

	constructor (backgroundColor) { 

		this.backgroundColor = 'white';
		this.time = null;

	}

	showInit = (text) => {

		points.font = '20px Arial';
		points.fillStyle = 'black';
		points.fillText(text, canvas.width/3, canvas.height/2);

	}

	drawBackgound = () => {

		ctx.fillStyle = `${this.backgroundColor}`;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

	}

	drawPoints = (number) => {

		points.font = '30px Arial';
		points.fillStyle = 'white';

		if(number < 10)
			points.fillText(number, canvas.width/2, canvas.height/2);
		else
			points.fillText(number, canvas.width/2 - 8, canvas.height/2);

	}

	drawRectangle = () => {

		let width = 72, height = 55;

		rectangle.fillStyle = 'black';
		rectangle.fillRect((canvas.width - width/1.3)/2, (canvas.height - height - 3)/2, width, height/1.5);

	}

	showTime = () => {

		const out = document.getElementById('outTime');
		out.innerHTML = `Tiempo de juego: ${this.time/1000} Segundos!`;

	}

};

class ObjetoCvs {

	constructor (img) {

		this.img = img;
		this.posX = maxWidth/2;
		this.posY = maxHeight/2;

		this.movX = 0;
		this.movY = 0;

		this.points = -1;
	}

	// Bug del doble rebote
	changeDirection = () => {

		this.movX = getRanNumber(-4,4);
		this.movY = getRanNumber(-4,4);

		if(!this.crashing()) 
			this.points++;
		else
			this.changeDirection();

		console.log('Direccion Cambiada');

	}

	upgradePos = () => {

		if (!(this.crashing() || (this.movX == 0 && this.movY == 0))){

			/* Mover el objeto */
			this.posX = Math.ceil(this.posX) + this.movX;
			this.posY = Math.ceil(this.posY) + this.movY;

			ctx.drawImage(this.img,this.posX,this.posY);

		} else { // Caso de que choque

			this.changeDirection();

			/* Llamada recursiva */
			this.upgradePos();

		}

	}

	crashing = () => this.posX + this.movX >= maxWidth || this.posX + this.movX <= 0 || this.posY + this.movY >= maxHeight || this.posY + this.movY <= 0;

}

const interfazCvs = new InterfazCanvas();
const LennyFace = new ObjetoCvs(lfi);



/* Events Listener */

// Inicializar juego
document.addEventListener('DOMContentLoaded', () => {

	interfazCvs.showInit('¡Haz click para jugar!');

});

// Iniciar juego
document.addEventListener('click', launch);



/** Principal **/

var setInterval;

function launch () {

	/* Inicializar tiempo */

	if (interfazCvs.time === null)
		interfazCvs.time = new Date().getTime();

	setInterval = setInterval( render , 10 );

}



/* Funciones y Porcedimientos */

render = () => {

	if(LennyFace.points < 20) {
	
		/* Dibujar fondo */
	
		if(LennyFace.crashing() && LennyFace.points > 8)
			interfazCvs.backgroundColor = getColorBasic();
		interfazCvs.drawBackgound();
	

		/* Dibujar LennyFace */

		LennyFace.upgradePos();

	} else { // Caso base, llegó a 20 puntos.
		
		/* Procesar tiempo de juego */

		interfazCvs.time = new Date().getTime() - interfazCvs.time;
		interfazCvs.showTime();


		// Termina el ciclo
		clearInterval(setInterval);

	}

	/* Dibujar los puntos */

	interfazCvs.drawRectangle();
	interfazCvs.drawPoints(LennyFace.points);

}

// Mejorar...
getColorBasic = () => {

	const colors = ['b71c1c','880e4f','6a1b9a','4527a0','283593','1565c0','01579b','006064','004d40','009688','4caf50','1b5e20','f57f17','ffeb3b','ffc107']
	return `#${colors[getRanNumber(0,colors.length-1)]}`;

}

function getRanNumber (min,max) { return Math.floor(Math.random()*((max+1)-min)+min) }

