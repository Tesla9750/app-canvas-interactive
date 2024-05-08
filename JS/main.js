// Selecciona el elemento canvas del documento HTML
const canvas = document.getElementById("canvas");

// Obtiene el contexto de representación 2D del canvas
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la ventana del navegador
const window_height = window.innerHeight; // Alto de la ventana
const window_width = window.innerWidth; // Ancho de la ventana

// Asigna el alto y ancho del canvas igual al alto y ancho de la ventana
canvas.height = window_height;
canvas.width = window_width;

// Establece el color de fondo del canvas
canvas.style.background = "#E4D5F3";

// Define una clase para representar círculos
class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x; // Posición x del centro del círculo
        this.posY = y; // Posición y del centro del círculo
        this.radius = radius; // Radio del círculo
        this.color = color; // Color del círculo
        this.text = text; // Texto a mostrar en el centro del círculo
        this.speed = speed; // Velocidad de movimiento del círculo en píxeles por fotograma

        // Velocidad de desplazamiento en los ejes x e y
        this.dx = 1 * this.speed;
        this.dy = 1 * this.speed;
    }

    // Método para dibujar el círculo en el canvas
    draw(context) {
        context.beginPath();

        context.strokeStyle = this.color; // Establece el color del trazo del círculo
        context.textAlign = "center"; // Alinea el texto en el centro horizontalmente
        context.textBaseline = "middle"; // Alinea el texto en el centro verticalmente
        context.font = "20px Arial"; // Establece la fuente y tamaño del texto
        context.fillText(this.text, this.posX, this.posY); // Dibuja el texto en el centro del círculo

        context.lineWidth = 3; // Establece el grosor del trazo
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false); // Dibuja el círculo
        context.stroke(); // Aplica el trazo al círculo
        context.closePath(); // Finaliza el trazo
    }
    

    // Método para actualizar la posición del círculo
    update(context) {
        this.draw(context); // Dibuja el círculo en su nueva posición

        // Si el círculo alcanza los límites del canvas en los ejes x, invierte su dirección
        if ((this.posX + this.radius) > window_width || (this.posX - this.radius) < 0) {
            this.dx = -this.dx;
        }

        // Si el círculo alcanza los límites del canvas en los ejes y, invierte su dirección
        if ((this.posY - this.radius) < 0 || (this.posY + this.radius) > window_height) {
            this.dy = -this.dy;
        }

        // Actualiza las coordenadas del centro del círculo
        this.posX += this.dx;
        this.posY += this.dy;
    }
    
}

// Función para calcular la distancia entre dos puntos en el plano cartesiano
function getDistance(posx1, posy1, posx2, posy2) {
    let result = Math.sqrt(Math.pow(posx2 - posx1, 2) + Math.pow(posy2 - posy1, 2));
    return result;
}

// Arreglo para almacenar instancias de círculos
let ArregloCirculos = [];
// Número de círculos que se crearán
let NumeroCirculos = 10;

// Bucle para crear múltiples círculos y agregarlos al arreglo
for (let i = 0; i < NumeroCirculos; i++) {
    let CirculoCreado = false;
    while (!CirculoCreado) {
        // Genera valores aleatorios para la posición, radio y velocidad de cada círculo
        let randomRadius = Math.floor(Math.random() * 60 + 35);
        let randomX = Math.random() * (window_width - 2 * randomRadius) + randomRadius;
        let randomY = Math.random() * (window_height - 2 * randomRadius) + randomRadius;
        let randomSpeed = Math.floor(Math.random() * 8) + 1;

        let VerificacionCreacion = true;
        // Verifica si el nuevo círculo está demasiado cerca de los círculos existentes
        for (let j = 0; j < ArregloCirculos.length; j++) {
            if (getDistance(randomX, randomY, ArregloCirculos[j].posX, ArregloCirculos[j].posY) < (randomRadius + ArregloCirculos[j].radius)) {
                VerificacionCreacion = false;
                break;
            }
        }
        // Si el nuevo círculo no está demasiado cerca de los círculos existentes, lo crea y lo agrega al arreglo
        if (VerificacionCreacion) {
            let miCirculo = new Circle(randomX, randomY, randomRadius, "blue", i + 1, randomSpeed);
            ArregloCirculos.push(miCirculo);
            CirculoCreado = true;
        }
    }
}

// Función para actualizar la posición de los círculos y detectar colisiones
function updateCircle() {
    ctx.clearRect(0, 0, window_width, window_height); // Borra el canvas para cada fotograma

    // Itera sobre cada círculo en el arreglo y actualiza su posición
    ArregloCirculos.forEach(circle => {
        circle.update(ctx);
    });

    // Detección de colisiones entre los círculos
    for (let i = 0; i < ArregloCirculos.length; i++) {
        for (let j = i + 1; j < ArregloCirculos.length; j++) {
            // Si dos círculos están lo suficientemente cerca, cambia su color a uno aleatorio y hace que reboten
            if (getDistance(ArregloCirculos[i].posX, ArregloCirculos[i].posY, ArregloCirculos[j].posX, ArregloCirculos[j].posY) < (ArregloCirculos[i].radius + ArregloCirculos[j].radius)) {
                let ColorAleatorio = '#' + Math.floor(Math.random() * 16777215).toString(16); // Genera color aleatorio
                ArregloCirculos[i].color = ColorAleatorio;
                ArregloCirculos[j].color = ColorAleatorio;
    
                // Invierte la dirección de los círculos
                ArregloCirculos[i].dx = -ArregloCirculos[i].dx;
                ArregloCirculos[i].dy = -ArregloCirculos[i].dy;
                ArregloCirculos[j].dx = -ArregloCirculos[j].dx;
                ArregloCirculos[j].dy = -ArregloCirculos[j].dy;
            }
        }
    }

    requestAnimationFrame(updateCircle); // Llama a la función de actualización nuevamente para el siguiente fotograma
}

updateCircle(); // Llama a la función de actualización inicialmente para iniciar la animación