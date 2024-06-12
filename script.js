// Obtiene una referencia al elemento de video en el documento HTML con el id "video".
const video = document.getElementById("video");

// Carga el modelo de detección de rostros llamado tinyFaceDetector desde el directorio "/models" utilizando FaceAPI.js.
// Una vez que el modelo se ha cargado correctamente, se llama a la función startVideo.
Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri("/models")]).then(startVideo);

// Función para iniciar la reproducción del video de la cámara del usuario y comenzar la detección facial.
function startVideo() {
  // Obtiene acceso a la cámara del usuario.
  navigator.getUserMedia(
    { video: {} },
    // Callback de éxito: asigna el stream de video al elemento de video y comienza la detección facial cuando el metadato del video está cargado.
    (stream) => {
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
        startFaceDetection(); // Inicia la detección facial.
      });
    },
    // Callback de error: muestra el error en la consola.
    (err) => console.error(err)
  );
}

// Función para iniciar la detección facial.
function startFaceDetection() {
  // Crea un lienzo HTML utilizando la biblioteca FaceAPI y lo añade al cuerpo del documento.
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  // Obtiene el tamaño de visualización del video.
  const displaySize = { width: video.videoWidth, height: video.videoHeight }; 

  // Ajusta las dimensiones del lienzo para que coincidan con el tamaño de visualización del video.
  faceapi.matchDimensions(canvas, displaySize);

  // Configura un intervalo para realizar la detección facial en el video a intervalos regulares.
  setInterval(async () => {
    // Detecta todos los rostros en el video utilizando el modelo tinyFaceDetector.
    const detections = await faceapi.detectAllFaces(
      video,
      new faceapi.TinyFaceDetectorOptions()
    );

    // Redimensiona las detecciones de acuerdo al tamaño de visualización del video.
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    // Borra el contenido previo del lienzo.
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    // Dibuja las detecciones de rostros en el lienzo.
    faceapi.draw.drawDetections(canvas, resizedDetections);
  }, 100); // Realiza la detección facial cada 100 milisegundos.
}
