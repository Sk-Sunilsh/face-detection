const video =document.getElementById("sk1");


Promise.all([
  
  faceapi.nets.tinyFaceDetector.loadFromUri("/applications"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/applications"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/applications"),
  faceapi.nets.faceExpressionNet.loadFromUri("/applications"),
]).then(startVideo());



function startVideo() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (sk) {
        video.srcObject = sk;
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMedia(sk1);
    document.body.append(canvas);
    const displaySize = {
      width: sk1.width,
      height: sk1.height,
    };
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      // console.log(detections);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }, 100);
  });