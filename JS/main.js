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
    constructor(x, y, radius, color, textColor, text, speed) {
        this.posX = x; // Posición x del centro del círculo
        this.posY = y; // Posición y del centro del círculo
        this.radius = radius; // Radio del círculo
        this.color = color; // Color del círculo
        this.textColor = textColor; // Color del texto
        this.text = text; // Texto a mostrar en el centro del círculo
        this.speed = speed; // Velocidad de movimiento del círculo en píxeles por fotograma

        // Velocidad de desplazamiento en los ejes x e y
        this.dx = 0;
        this.dy = -1 * this.speed; // Hacia arriba

        // Atributo para marcar si el círculo debe ser eliminado
        this.shouldBeRemoved = false;
    }

    // Método para dibujar el círculo en el canvas
    draw(context) {
        context.beginPath();

        context.fillStyle = this.color; // Establece el color de relleno del círculo
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill(); // Aplica el relleno al círculo en lugar del trazo

        // Dibuja el texto con el color especificado
        context.fillStyle = this.textColor;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);

        context.closePath();
    }

    // Método para actualizar la posición del círculo
    update(context) {
        this.draw(context); // Dibuja el círculo en su nueva posición

        // Si el círculo alcanza los límites del canvas en los ejes y, marca que debe ser eliminado
        if (this.posY - this.radius <= 0) {
            this.shouldBeRemoved = true;
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
        let randomY = window_height + randomRadius; // Comienza desde la parte inferior del canvas
        let randomSpeed = Math.floor(Math.random() * 6) + 1;

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

            function getRandomColor() {
                // Genera un componente de color aleatorio en formato hexadecimal (de 0 a 255)
                const randomComponent = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
                
                // Concatena los componentes de color aleatorios para formar el color hexadecimal
                return `#${randomComponent()}${randomComponent()}${randomComponent()}`;
            }
            const colorRandom = getRandomColor(); // Obtiene un color aleatorio

            
            let miCirculo = new Circle(randomX, randomY, randomRadius, colorRandom, "black", (i + 1).toString(), randomSpeed);

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

    // Filtra los círculos que deben ser eliminados
    ArregloCirculos = ArregloCirculos.filter(circle => !circle.shouldBeRemoved);

    requestAnimationFrame(updateCircle); // Llama a la función de actualización nuevamente para el siguiente fotograma
}

// Agregar el evento de clic para eliminar círculos
canvas.addEventListener('click', function (event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Verifica si el clic está dentro de algún círculo
    for (let i = 0; i < ArregloCirculos.length; i++) {
        const circle = ArregloCirculos[i];
        const distanceFromCenter = getDistance(mouseX, mouseY, circle.posX, circle.posY);
        // Si el clic está dentro del círculo, marca que debe ser eliminado
        if (distanceFromCenter <= circle.radius) {
            circle.shouldBeRemoved = true;
            break; // Sale del bucle una vez que se marca el círculo para eliminación
        }
    }
});

updateCircle(); // Llama a la función de actualización inicialmente para iniciar la animación
