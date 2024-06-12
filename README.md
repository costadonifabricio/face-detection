# Face Detection App

Esta es una aplicación web que utiliza la biblioteca face-api.js para detectar rostros en una transmisión de video en tiempo real desde la cámara del usuario. Permite capturar y mostrar información sobre los rostros detectados, incluyendo la emoción dominante.

## Funcionamiento

El código HTML y JavaScript en este proyecto realiza lo siguiente:

### HTML (index.html)

El archivo HTML proporciona la estructura básica de la página web:

- Incluye referencias a los archivos necesarios de JavaScript y CSS.
- Contiene un elemento `<video>` para mostrar la transmisión de video desde la cámara.
- Un contenedor `<div>` (`resultsContainer`) para mostrar los resultados de la detección de caras.
- Un `<canvas>` (`faceCanvas`) oculto que se utiliza para capturar la imagen del rostro detectado.

### JavaScript (script.js)

El archivo JavaScript se encarga de:

1. **Inicializar la Cámara y Comenzar la Detección de Rostros:**

   - `startVideo()`: Accede a la cámara del usuario, muestra la transmisión de video en el elemento `<video>` y luego inicia la detección de rostros cuando el video está listo.

2. **Detección de Rostros y Expresiones:**

   - `startFaceDetection()`: Utiliza face-api.js para cargar los modelos de detección de rostros (`tinyFaceDetector`) y de expresiones faciales (`faceExpressionNet`). Luego, en un intervalo regular:
     - Detecta todos los rostros en el video utilizando `detectAllFaces` con opciones de `TinyFaceDetector`.
     - Para cada rostro detectado, crea un contenedor (`faceContainer`) que contiene:
       - Un `<canvas>` para mostrar el rostro detectado.
       - Un `<img>` que muestra la imagen capturada del rostro.
       - Un texto que indica la emoción dominante detectada en ese rostro.
     - Todos estos elementos se agregan al contenedor `resultsContainer` en el HTML.

3. **Funciones Auxiliares:**

   - `getDominantEmotion(expressions)`: Determina la emoción con mayor probabilidad basada en las expresiones faciales detectadas.

4. **Inicio Automático:**

   - Se cargan los modelos necesarios de face-api.js al inicio (`Promise.all([...])`) y se inicia automáticamente la detección de video y rostros.

## Configuración y Uso

1. **Instalación:**

   - Clona este repositorio o descarga los archivos necesarios.
   - Asegúrate de tener acceso a una conexión a internet para cargar los modelos de face-api.js desde `/models`.

2. **Ejecución:**

   - Abre `index.html` en un navegador web compatible.
   - Se solicitará acceso a la cámara del dispositivo; permite el acceso para comenzar la detección de rostros.

3. **Personalización:**

   - Puedes ajustar el intervalo de detección (`100ms` en el ejemplo) para que sea más rápido o más lento según tus necesidades.
   - Personaliza el estilo CSS en `style.css` para adaptarlo a tus preferencias visuales.

## Créditos

- Este proyecto utiliza la biblioteca face-api.js para la detección de rostros y expresiones faciales en tiempo real.
- Inspirado en ejemplos y documentación de face-api.js.

