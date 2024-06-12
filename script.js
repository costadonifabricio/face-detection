const video = document.getElementById("video");
const resultsContainer = document.getElementById("resultsContainer");
let intervalId = null;
let timeoutId = null;

// Función para iniciar la transmisión de video desde la cámara del usuario
function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
        startFaceDetection();
      });
    })
    .catch((err) => {
      console.error("Error al acceder a la cámara:", err);
    });
}

// Función para iniciar la detección de rostros y expresiones
async function startFaceDetection() {
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]);

    const displaySize = { width: video.videoWidth, height: video.videoHeight };

    intervalId = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      // Limpiar el contenedor de resultados
      resultsContainer.innerHTML = "";

      detections.forEach((detection, index) => {
        const box = detection.detection.box;

        // Obtener la emoción dominante
        const emotion = getDominantEmotion(detection.expressions);

        // Crear un contenedor para cada rostro detectado
        const faceContainer = document.createElement("div");
        faceContainer.classList.add("face-container");
        faceContainer.style.border = "2px solid #fff"; // Establecer borde blanco de 2px
        faceContainer.style.margin = "10px"; // Espacio entre los contenedores

        // Crear un canvas con ID único para cada rostro detectado
        const faceCanvas = document.createElement("canvas");
        const canvasId = `faceCanvas_${index}`; // ID único para el canvas
        faceCanvas.id = canvasId;
        faceCanvas.width = box.width;
        faceCanvas.height = box.height;
        const ctx = faceCanvas.getContext("2d");
        ctx.drawImage(
          video,
          box.x,
          box.y,
          box.width,
          box.height,
          0,
          0,
          box.width,
          box.height
        );

        // Mostrar el canvas en el contenedor
        faceContainer.appendChild(faceCanvas);

        // Mostrar la cara capturada en un elemento <img>
        const capturedFaceImg = document.createElement("img");
        capturedFaceImg.src = faceCanvas.toDataURL("image/png");
        faceContainer.appendChild(capturedFaceImg);

        // Mostrar la emoción detectada
        const emotionText = document.createElement("h2");
        emotionText.textContent = "Emoción: " + emotion;
        faceContainer.appendChild(emotionText);

        // Agregar el contenedor al contenedor de resultados
        resultsContainer.appendChild(faceContainer);
      });
    }, 100); // Intervalo ajustable según sea necesario
  } catch (error) {
    console.error("Error al cargar el modelo:", error);
  }
}

// Función para obtener la emoción dominante
function getDominantEmotion(expressions) {
  let dominantEmotion = null;
  let maxProbability = 0;

  // Iterar sobre todas las expresiones y encontrar la de mayor probabilidad
  Object.keys(expressions).forEach((emotion) => {
    if (expressions[emotion] > maxProbability) {
      maxProbability = expressions[emotion];
      dominantEmotion = emotion;
    }
  });

  return dominantEmotion;
}

// Iniciar el video y la detección de rostros cuando se cargue la página
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
])
  .then(startVideo)
  .catch((err) => {
    console.error("Error al cargar el modelo:", err);
  });
