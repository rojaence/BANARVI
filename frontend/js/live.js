const controlContainer = document.getElementById("control");
const buttonTheme = document.getElementById("button-theme");
const localStorage = window.localStorage;
const playButton = document.getElementById("play-button");
const refreshButton = document.getElementById("refresh-button");
const listCamDevice = document.getElementById("camera-device");
const canvasOutput = document.getElementById("canvas");
const canvasAux = document.getElementById("canvas-aux");
const dataDimension = document.getElementById("data-dimension");
const dataArea = document.getElementById("data-area");
const dataPerimeter = document.getElementById("data-perimeter");
const dataGreen = document.getElementById("data-green");
const dataYellow = document.getElementById("data-yellow");
const colourTag = document.getElementById("data-colour");
let streaming = false;

let videoStreaming = document.getElementById("stream");
let width = 960;
let height = 720;
let cap, dst, src, gray, begin, dstAux, contours, hierarchy, contoursColor;
const FPS = 30;


let utils = new Utils('errorMessage');
let faceCascadeFile = "haarcascade_frontalface_default.xml";

const getSupportUserMedia = () => {
  return !!(
    navigator.getUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.mediaDevices.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.msGetUserMedia
  );
};

const setTheme = (value) => {
  switch (value) {
    case "light":
      buttonTheme.classList.add("fa-moon");
      buttonTheme.classList.remove("fa-sun")
      document.body.classList.remove("theme--dark");
      localStorage.setItem("theme", "light");
      break;
    case "dark":
      buttonTheme.classList.remove("fa-moon");
      buttonTheme.classList.add("fa-sun")
      document.body.classList.add("theme--dark");
      localStorage.setItem("theme", "dark");
      break;
  }
};

refreshButton.addEventListener("click", (e) => {
  fillDeviceList();
  clearData();
});

buttonTheme.addEventListener('click', () => {
  buttonTheme.classList.contains("fa-moon")
  ? setTheme("dark")
  : setTheme("light");
});

playButton.addEventListener("click", () => {
  startStream();
});

listCamDevice.addEventListener("change", () => {
  startStream();
});

const fillDeviceList = () => {
  MediaStreamHelper.requestStream().then(function (stream) {
    MediaStreamHelper._stream = stream;
    listCamDevice.selectedIndex = [...listCamDevice.options].findIndex(
      (option) => option.text === stream.getVideoTracks()[0].label
    );
    videoStreaming.srcObject = stream;
    MediaStreamHelper.getDevices().then((devices) => {
      cleanSelect(listCamDevice);
      devices.forEach((device) => {
        let option = document.createElement("OPTION");
        option.value = device.deviceId;
        if (device.kind == "videoinput") {
          option.text = device.label || `Camera ${listCamDevice.lenght + 1}`;
          listCamDevice.appendChild(option);
        }
      });
    });
  });
};

const startStream = () => {
  flagButtonCamera = true;
  MediaStreamHelper.requestStream().then(function (stream) {
    MediaStreamHelper._stream = stream;
    videoStreaming.srcObject = stream;
    videoStreaming.play();
    streaming = true;
    // Aquí se llama a la función que detecta patrones
    processVideo();
  });
};

const cleanSelect = (element) => {
  for (let x = element.options.length - 1; x >= 0; x--) {
    element.options.remove(x);
  }
};

const adjustAspectSize = () => {
  height = videoStreaming.videoHeight / (videoStreaming.videoWidth / width);
  height = 720;
  videoStreaming.setAttribute("width", width);
  videoStreaming.setAttribute("height", height);
  canvasOutput.setAttribute("width", width);
  canvasOutput.setAttribute("height", height);
};


let MediaStreamHelper = {
  _stream: null,
  getDevices: function () {
    return navigator.mediaDevices.enumerateDevices();
  },
  requestStream: function () {
    if (this._stream) {
      this._stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    const videoSource = listCamDevice.value;
    const constraints = {
      video: {
        deviceId: videoSource ? { exact: videoSource } : undefined,
      },
    };
    return navigator.mediaDevices.getUserMedia(constraints);
  },
};

window.addEventListener("load", () => {
  localStorage.getItem("theme")
  ? setTheme(localStorage.getItem("theme"))
  : localStorage.setItem("theme", "light");
  if (getSupportUserMedia()) {
    fillDeviceList();
  }
});


// Esta función no funciona correctamente (omitir la detección de rostros ^_^)

/* const faceDetection = () => {
  cap = new cv.VideoCapture(videoStreaming);
  src = new cv.Mat(videoStreaming.height, videoStreaming.width, cv.CV_8UC4);
  dst = new cv.Mat(videoStreaming.height, videoStreaming.width, cv.CV_8UC4);
  gray = new cv.Mat();

  // Variables para el reconocimiento de rostros
  faces = new cv.RectVector();
  classifier = new cv.CascadeClassifier();
  classifier.load("haarcascade_frontalface_default.xml");
  utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
    classifier.load(faceCascadeFile);
  });
  function detectFaces() {
    try{
      begin = Date.now();
      cap.read(src);
      src.copyTo(dst);
      cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
      classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
      for (let i = 0; i < faces.size(); ++i) {
        let face = faces.get(i);
        let point1 = new cv.Point(face.x, face.y);
        let point2 = new cv.Point(face.x + face.width, face.y + face.height);
        cv.rectangle(dst, point1, point2, [255, 0 , 0, 255]);
      }
      cv.imshow('canvas', dst);
      let delay = 1000 / FPS - (Date.now() - begin);
      timeOut = setTimeout(detectFaces, delay);
    } catch(error) {
      console.log(error);
    }
  }
  setTimeout(detectFaces, 0);
} */


const processVideo = () => {
  cap = new cv.VideoCapture(videoStreaming);
  src = new cv.Mat(videoStreaming.height, videoStreaming.width, cv.CV_8UC4);
  dst = new cv.Mat(videoStreaming.height, videoStreaming.width, cv.CV_8UC4);
  setTimeout(detectionProcess, 0);
};

const takePicture = () => {
  if (flagButtonCamera) {
    // adjustApectSize();
    canvasAux.width = width;
    canvasAux.height = height;
    canvasAux
      .getContext("2d")
      .drawImage(videoStreaming, 0, 0, width, height);
  }
};

const adjustApectSize = () => {
  height = videoStreaming.videoHeight / (videoStreaming.videoWidth / width);
  videoStreaming.setAttribute("width", width);
  videoStreaming.setAttribute("height", height);
  canvasAux.setAttribute("width", width);
  canvasAux.setAttribute("height", height);
};


const contoursProcessing = () => {
  let src = cv.imread(canvasAux);
  let srcAux = cv.imread(canvasAux);
  let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  let contoursColor = new cv.Scalar(255, 255, 255);
  cv.cvtColor(src, src, cv.COLOR_BGR2GRAY, 0);
  cv.threshold(src, src, 127, 255, cv.THRESH_BINARY_INV);
  cv.findContours(
    src,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
    );
    cv.drawContours(dst, contours, -1, contoursColor, 1, 8, hierarchy, 100);
    // Obteniendo el mayor contorno
    let lenContours = contours.size();
    let maxContourIndex = 0;
    let maxContourLenght = 0;
  for (let index = 0; index < lenContours; index++) {
    let cntTest = contours.get(index);
    let cntTestLenght = cv.arcLength(cntTest, true);
    if (maxContourLenght < cntTestLenght) {
      maxContourLenght = cntTestLenght;
      maxContourIndex = index;
    }
  }
  let cnt = contours.get(maxContourIndex);
  let moments = cv.moments(cnt);
  let cX = parseInt(moments.m10 / moments.m00);
  let cY = parseInt(moments.m01 / moments.m00);
  let area = cv.contourArea(cnt);
  let perimeter = cv.arcLength(cnt, true);
  let rect = cv.boundingRect(cnt);
  let rectangleColor = new cv.Scalar(255, 0, 0);
  let point1 = new cv.Point(rect.x, rect.y);
  let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
  let point3 = new cv.Point(rect.x + rect.width, rect.y);
  let point4 = new cv.Point(rect.x, rect.y + rect.height);
  cv.rectangle(dst, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);
  let center = new cv.Point(cX, cY);
  let circleColor = new cv.Scalar(0, 255, 0);
  cv.circle(dst, center, 10, circleColor, -1);
  cv.circle(dst, point1, 10, circleColor, -1);
  cv.circle(dst, point2, 10, circleColor, -1);
  cv.circle(dst, point3, 10, circleColor, -1);
  cv.circle(dst, point4, 10, circleColor, -1);
  cv.imshow(canvasOutput, dst);
  src.delete();
  srcAux.delete();
  contours.delete();
  hierarchy.delete();
  cnt.delete();
  dst.delete();
  let dimensionImg = [rect.width, rect.height];
  const data = {
    dimension: dimensionImg,
    area: parseInt(area),
    perimeter: parseInt(perimeter),
  };
  return data;
};

const detectionProcess = () => {
  try {
    if (!streaming) {
      src.delete();
      dst.delete();
      gray.delete();
      return;
    }
    let begin = Date.now();
    cap.read(src);
    src.copyTo(dst);
    takePicture();
    let dataContour = contoursProcessing();
    let dataColour = colourProcessing();
    dataDimension.textContent = `${dataContour.dimension[0]} x ${dataContour.dimension[1]}`;
    dataArea.textContent = dataContour.area;
    dataPerimeter.textContent = dataContour.perimeter;
    dataGreen.textContent = dataColour.greenArea;
    dataYellow.textContent = dataColour.yellowArea;
    if (dataColour.greenArea > dataColour.yellowArea) {
      colourTag.classList.add("data__color--green");
      colourTag.classList.remove("data__color--yellow");
    } else if (dataColour.greenArea < dataColour.yellowArea) {
      colourTag.classList.add("data__color--yellow");
      colourTag.classList.remove("data__color--green");
    } else if ( dataColour.greenArea == 0 && dataColour.yellowArea == 0) {
      colourTag.classList.remove("data__color--green");
      colourTag.classList.remove("data__color--yellow");
    } 
    let delay = 1000 / FPS - (Date.now() - begin);
    setTimeout(detectionProcess, delay);
  } catch (error) {
    console.log(error);
  }
};

const colourProcessing = () => {
  let src = cv.imread(canvasAux);
  let dstYellow = new cv.Mat();
  let dstGreen = new cv.Mat();
  let contoursYellow = new cv.MatVector();
  let hierarchyYellow = new cv.Mat();
  let contoursGreen = new cv.MatVector();
  let hierarchyGreen = new cv.Mat();
  cv.cvtColor(src, src, cv.COLOR_RGB2BGR, 0);
  cv.cvtColor(src, src, cv.COLOR_BGR2HSV, 0);

  // Valores mínimo y máximo ara detectar color amarillo
  let lowGreen = new cv.Mat(src.rows, src.cols, src.type(), [35, 50, 50, 255]);
  let highGreen = new cv.Mat(
    src.rows,
    src.cols,
    src.type(),
    [70, 255, 255, 255]
  );
  // Valores mínimo y máximo para detectar color verde
  let lowYellow = new cv.Mat(src.rows, src.cols, src.type(), [20, 50, 50, 255]);
  let highYellow = new cv.Mat(
    src.rows,
    src.cols,
    src.type(),
    [30, 255, 255, 255]
  );

  cv.inRange(src, lowYellow, highYellow, dstYellow);
  cv.inRange(src, lowGreen, highGreen, dstGreen);
  cv.findContours(
    dstYellow,
    contoursYellow,
    hierarchyYellow,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
  );
  cv.findContours(
    dstGreen,
    contoursGreen,
    hierarchyGreen,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
  );
  // Suma del total de área para color amarillo
  let lenContours = contoursYellow.size();
  let totalYellowArea = 0;
  for (let index = 0; index < lenContours; index++) {
    let cntTest = contoursYellow.get(index);
    let areaTest = cv.contourArea(cntTest);
    totalYellowArea += areaTest;
  }
  // Suma del total de área para color verde
  lenContours = contoursGreen.size();
  let totalGreenArea = 0;
  for (let index = 0; index < lenContours; index++) {
    let cntTest = contoursGreen.get(index);
    let areaTest = cv.contourArea(cntTest);
    totalGreenArea += areaTest;
  }
  src.delete();
  lowGreen.delete();
  highGreen.delete();
  lowYellow.delete();
  highYellow.delete();
  dstGreen.delete();
  dstYellow.delete();
  contoursGreen.delete();
  contoursYellow.delete();
  hierarchyGreen.delete();
  hierarchyYellow.delete();
  const data = {
    yellowArea: parseInt(totalYellowArea),
    greenArea: parseInt(totalGreenArea),
  };
  return data;
};

const clearData = () => {
  streaming = false;
  dataDimension.textContent = "";
  dataArea.textContent = "";
  dataPerimeter.textContent = "";
  dataGreen.textContent = "";
  dataYellow.textContent = "";
  colourTag.classList.remove("data__color--green");
  colourTag.classList.remove("data__color--yellow");
  canvasOutput.getContext("2d").clearRect(0, 0, canvasOutput.width, canvasOutput.height);
  canvasAux.getContext("2d").clearRect(0, 0, canvasAux.width, canvasAux.height);
}

const stopProcess = () => {
  videoStreaming.pause();
  videoStreaming.srcObject.getTracks().forEach((track) => {
    track.stop();
  });
  videoStreaming.srcObject = null;
  videoStreaming.load();
  cap = null;
  srcAux.delete();
  dst.delete();
  gray.delete();
  faces.delete();
  classifier.delete();
}