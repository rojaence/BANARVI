const multimediaContainer = document.getElementById("multimedia");
const controlContainer = document.getElementById("control");
const divImage1 = document.getElementById("div-image-1");
const divImage2 = document.getElementById("div-image-2");
const canvasImage1 = document.getElementById("canvas-image-1");
const canvasImage2 = document.getElementById("canvas-image-2");
const cameraButton = document.getElementById("camera-button");
const deleteButton = document.getElementById("delete-button");
const analizeButton = document.getElementById("analize-button");
const listCamDevice = document.getElementById("camera-device");
const refreshButton = document.getElementById("refresh-button");
const playButton = document.getElementById("play-button");
const saveButton = document.getElementById("save-button");
const imageOptionSelect = document.getElementById("image-options");
const optionCaptures = document.getElementById("option-captures");
const optionProcessing = document.getElementById("option-processing");
const controlProcessing = document.getElementById("control-processing");
const originalImageButton = document.getElementById("original-img-btn");
const contourImageButton = document.getElementById("contour-img-btn");
const inRangeImageButton = document.getElementById("in-range-img-btn");
const spinner = document.getElementById("spinner");
const dimensionValueImg1 = document.getElementById("dimension-value-img1");
const areaValueImg1 = document.getElementById("area-value-img1");
const perimeterValueImg1 = document.getElementById("perimeter-value-img1");
const greenValueImg1 = document.getElementById("green-value-img1");
const yellowValueImg1 = document.getElementById("yellow-value-img1");
const dimensionValueImg2 = document.getElementById("dimension-value-img2");
const areaValueImg2 = document.getElementById("area-value-img2");
const perimeterValueImg2 = document.getElementById("perimeter-value-img2");
const greenValueImg2 = document.getElementById("green-value-img2");
const yellowValueImg2 = document.getElementById("yellow-value-img2");
const modalWindow = document.getElementById("modal-window");
const modalCloseButton = document.getElementById("btn-close-modal");
const imageModalWindow = document.getElementById("image-modal");
const main = document.getElementById("main");
const header = document.getElementById("header");
const buttonTheme = document.getElementById("button-theme");
const localStorage = window.localStorage;
const gaugeValue = document.getElementById("gauge-value");
const colorVeredict = document.getElementById("color-veredict");
const gauge = document.getElementById("gauge");

let dataContourImg1;
let dataContourImg2;
let dataColourImg1;
let dataColourImg2;
let videoStreaming = document.getElementById("stream");
let width = 1280;
let height = 0;
let canvasSelected;
let image1 = new Image();
let image2 = new Image();
let contourImage1 = new Image();
let contourImage2 = new Image();
let inRangeImage1 = new Image();
let inRangeImage2 = new Image();
let flagButtonCamera = false;

// Variables para determinar el veredicto de madiración
let percentYellow, percentGreen;

multimediaContainer.addEventListener("click", (e) => {
  if (
    e.target.dataset.image == "image-1" ||
    e.target.dataset.image == "image-2"
  ) {
    changeCanvasSelected(e.target.dataset.image);
  }
});

refreshButton.addEventListener("click", (e) => {
  fillDeviceList();
});

cameraButton.addEventListener("click", () => {
  takePicture();
});

playButton.addEventListener("click", () => {
  startStream();
});

deleteButton.addEventListener("click", () => {
  clearData();
});

listCamDevice.addEventListener("change", () => {
  startStream();
});

saveButton.addEventListener("click", () => {
  Swal.fire({
    title: "¿Desea guardar este análisis?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#237AA8",
    cancelButtonColor: "#D17384",
    confirmButtonText: "Sí, Guardar",
    cancelButtonText: "Cancelar",
    background: "#e6f0e65",
    iconColor: "#D17384",
  }).then((result) => {
    if (result.isConfirmed) {
      saveProcessingData();
    }
  });
});

modalWindow.addEventListener("click", (e) => {
  switch (e.target.dataset.modal) {
    case "outside":
      modalWindow.classList.add("modal-container--disabled");
      main.classList.remove("element-hidden");
      header.classList.remove("element-hidden");
      break;
  }
});

modalCloseButton.addEventListener("click", () => {
  modalWindow.classList.add("modal-container--disabled");
});

buttonTheme.addEventListener('click', () => {
  buttonTheme.classList.contains("fa-moon")
  ? setTheme("dark")
  : setTheme("light");
})

canvasImage1.addEventListener("dblclick", () => {
  modalWindow.classList.remove("modal-container--disabled");
  main.classList.add("element-hidden");
  header.classList.add("element-hidden");
  imageModalWindow.src = canvasImage1.toDataURL("image/png");
});

canvasImage2.addEventListener("dblclick", () => {
  modalWindow.classList.remove("modal-container--disabled");
  main.classList.add("element-hidden");
  header.classList.add("element-hidden");
  imageModalWindow.src = canvasImage2.toDataURL("image/png");
});

controlProcessing.addEventListener("click", (e) => {
  switch (e.target.dataset.action) {
    case "original-image":
      changeCanvasImage("original");
      changeControlButtonsStyle("original");
      break;
    case "contour-image":
      changeCanvasImage("contour");
      changeControlButtonsStyle("contour");
      break;
    case "in-range-image":
      changeCanvasImage("in-range");
      changeControlButtonsStyle("in-range");
      break;
    case "cancel":
      changeControlButtonsStyle("cancel");
      clearData();
      changeCanvasImage("original");
      changeImageProcess("captures");
      break;
    case "save":
      break;
  }
});

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

const changeControlButtonsStyle = (type) => {
  switch (type) {
    case "original":
      originalImageButton.classList.add("control-processing__button--active");
      contourImageButton.classList.remove("control-processing__button--active");
      inRangeImageButton.classList.remove("control-processing__button--active");
      break;
    case "contour":
      originalImageButton.classList.remove(
        "control-processing__button--active"
      );
      contourImageButton.classList.add("control-processing__button--active");
      inRangeImageButton.classList.remove("control-processing__button--active");
      break;
    case "in-range":
      originalImageButton.classList.remove(
        "control-processing__button--active"
      );
      contourImageButton.classList.remove("control-processing__button--active");
      inRangeImageButton.classList.add("control-processing__button--active");
      break;
    case "cancel":
      originalImageButton.classList.remove(
        "control-processing__button--active"
      );
      contourImageButton.classList.remove("control-processing__button--active");
      inRangeImageButton.classList.remove("control-processing__button--active");
      break;
  }
};

const changeCanvasSelected = (value) => {
  if (value == "image-1") {
    divImage1.classList.add("multimedia__image--active");
    divImage2.classList.remove("multimedia__image--active");
    canvasSelected = canvasImage1;
  } else if (value == "image-2") {
    divImage1.classList.remove("multimedia__image--active");
    divImage2.classList.add("multimedia__image--active");
    canvasSelected = canvasImage2;
  }
};

const changeCanvasImage = (type) => {
  let ctxCanvas1 = canvasImage1.getContext("2d");
  let ctxCanvas2 = canvasImage2.getContext("2d");
  if (type == "original") {
    ctxCanvas1.drawImage(image1, 0, 0);
    ctxCanvas2.drawImage(image2, 0, 0);
  } else if (type == "contour") {
    ctxCanvas1.drawImage(contourImage1, 0, 0);
    ctxCanvas2.drawImage(contourImage2, 0, 0);
  } else if (type == "in-range") {
    ctxCanvas1.drawImage(inRangeImage1, 0, 0);
    ctxCanvas2.drawImage(inRangeImage2, 0, 0);
  }
  changeControlButtonsStyle(type);
};

const changeImageProcess = (type) => {
  switch (type) {
    case "captures":
      optionCaptures.classList.add("image-select__option--active");
      optionProcessing.classList.remove("image-select__option--active");
      controlProcessing.classList.remove("control-processing--active");
      controlContainer.classList.remove("control--disabled");
      break;
    case "processing":
      optionCaptures.classList.remove("image-select__option--active");
      optionProcessing.classList.add("image-select__option--active");
      controlContainer.classList.add("control--disabled");
      controlProcessing.classList.add("control-processing--active");
      break;
  }
};

analizeButton.addEventListener("click", () => {
  controlContainer.classList.add("control--processing");
  image1.src = canvasImage1.toDataURL("image/png");
  image2.src = canvasImage2.toDataURL("image/png");
  spinner.classList.remove("spinner--hidden");
  imageProcessing();
  changeCanvasImage("original");
  changeImageProcess("processing");
  fillData();
  controlContainer.classList.remove("control--processing");
  spinner.classList.add("spinner--hidden");
});

const imageProcessing = () => {
  dataContourImg1 = contoursProcessing(canvasImage1);
  dataColourImg1 = inRangeProcessing(canvasImage1);
  dataContourImg2 = contoursProcessing(canvasImage2);
  dataColourImg2 = inRangeProcessing(canvasImage2);
  contourImage1.src = dataContourImg1.image;
  contourImage2.src = dataContourImg2.image;
  inRangeImage1.src = dataColourImg1.image;
  inRangeImage2.src = dataColourImg2.image;
  calculatePercentColor();
};

const calculatePercentColor = () => {
  percentYellow = dataColourImg1.yellowArea + dataColourImg2.yellowArea;
  percentGreen = dataColourImg1.greenArea + dataColourImg2.greenArea;
  let totalColorArea = percentYellow + percentGreen;
  // Porcentaje de color amarillo 
  percentYellow = (percentYellow * 100) / totalColorArea;
  // Porcentaje de color verde
  percentGreen = (percentGreen * 100) / totalColorArea;
  gaugeValue.textContent = `${percentYellow.toFixed(2)}%`;
  gauge.classList.remove("gauge--undefined");
  if (percentGreen < percentYellow) {
    colorVeredict.textContent = "Maduro";
    gauge.classList.add("gauge--ripe");
  } else if (percentGreen > percentYellow) {
    colorVeredict.textContent = "Verde";
    gauge.classList.add("gauge--optimum");
  }  else if (percentGreen == 0 && percentYellow == 0) {
    colorVeredict.textContent = "Indefinido";
    gauge.classList.add("gauge--undefined");
  }
};

const contoursProcessing = (canvas) => {
  let src = cv.imread(canvas);
  let srcAux = cv.imread(canvas);
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
  cv.imshow(canvas, dst);
  let result = canvas.toDataURL();
  cv.imshow(canvas, srcAux);
  src.delete();
  srcAux.delete();
  contours.delete();
  hierarchy.delete();
  cnt.delete();
  dst.delete();
  let dimensionImg = [rect.width, rect.height];
  const data = {
    image: result,
    dimension: dimensionImg,
    area: parseInt(area),
    perimeter: parseInt(perimeter),
  };
  return data;
};

const inRangeProcessing = (canvas) => {
  let src = cv.imread(canvas);
  let srcAux = cv.imread(canvas);
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
  if (totalYellowArea > totalGreenArea) {
    cv.imshow(canvas, dstYellow);
  } else {
    cv.imshow(canvas, dstGreen);
  }
  let result = canvas.toDataURL();
  cv.imshow(canvas, srcAux);
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
    image: result,
    yellowArea: parseInt(totalYellowArea),
    greenArea: parseInt(totalGreenArea),
  };
  return data;
};

const fillData = () => {
  dimensionValueImg1.textContent = `${dataContourImg1.dimension[0]} × ${dataContourImg1.dimension[1]}`;
  areaValueImg1.textContent = dataContourImg1.area;
  perimeterValueImg1.textContent = dataContourImg1.perimeter;
  greenValueImg1.textContent = dataColourImg1.greenArea;
  yellowValueImg1.textContent = dataColourImg1.yellowArea;
  dimensionValueImg2.textContent = `${dataContourImg2.dimension[0]} × ${dataContourImg2.dimension[1]}`;
  areaValueImg2.textContent = dataContourImg2.area;
  perimeterValueImg2.textContent = dataContourImg2.perimeter;
  greenValueImg2.textContent = dataColourImg2.greenArea;
  yellowValueImg2.textContent = dataColourImg2.yellowArea;
};

const clearData = () => {
  let ctxCanvas1 = canvasImage1.getContext("2d");
  let ctxCanvas2 = canvasImage2.getContext("2d");
  ctxCanvas1.clearRect(0, 0, canvasImage1.width, canvasImage1.height);
  ctxCanvas2.clearRect(0, 0, canvasImage2.width, canvasImage2.height);
  dimensionValueImg1.textContent = "";
  areaValueImg1.textContent = "";
  perimeterValueImg1.textContent = "";
  greenValueImg1.textContent = "";
  yellowValueImg1.textContent = "";
  dimensionValueImg2.textContent = "";
  areaValueImg2.textContent = "";
  perimeterValueImg2.textContent = "";
  greenValueImg2.textContent = "";
  yellowValueImg2.textContent = "";
  gaugeValue.textContent = "";
  colorVeredict.textContent = "";
  gauge.classList.remove("gauge--undefined");
  gauge.classList.remove("gauge--ripe");
  gauge.classList.remove("gauge--optimum");
};

const getSupportUserMedia = () => {
  return !!(
    navigator.getUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.mediaDevices.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.msGetUserMedia
  );
};

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
    changeCanvasSelected("image-1");
  });
};

const cleanSelect = (element) => {
  for (let x = element.options.length - 1; x >= 0; x--) {
    element.options.remove(x);
  }
};

const takePicture = () => {
  if (flagButtonCamera) {
    adjustApectSize();
    canvasSelected.width = width;
    canvasSelected.height = height;
    canvasSelected
      .getContext("2d")
      .drawImage(videoStreaming, 0, 0, width, height);
  }
};

const adjustApectSize = () => {
  height = videoStreaming.videoHeight / (videoStreaming.videoWidth / width);
  videoStreaming.setAttribute("width", width);
  videoStreaming.setAttribute("height", height);
  canvasSelected.setAttribute("width", width);
  canvasSelected.setAttribute("height", height);
};

window.addEventListener("load", () => {
  localStorage.getItem("theme")
  ? setTheme(localStorage.getItem("theme"))
  : localStorage.setItem("theme", "light");
  if (getSupportUserMedia()) {
    fillDeviceList();
  }
});

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

const saveProcessingData = () => {
  const date = getDate();
  const url = "http://localhost/banarvi/backend/registerData.php";
  const formData = new FormData();
  formData.append("date", date);
  formData.append("widthRectImg1", dataContourImg1.dimension[0]);
  formData.append("heightRectImg1", dataContourImg1.dimension[1]);
  formData.append("areaImg1", dataContourImg1.area);
  formData.append("perimeterImg1", dataContourImg1.perimeter);
  formData.append("yellowImg1", dataColourImg1.yellowArea);
  formData.append("greenImg1", dataColourImg1.greenArea);
  formData.append("widthRectImg2", dataContourImg2.dimension[0]);
  formData.append("heightRectImg2", dataContourImg2.dimension[1]);
  formData.append("areaImg2", dataContourImg2.area);
  formData.append("perimeterImg2", dataContourImg2.perimeter);
  formData.append("yellowImg2", dataColourImg2.yellowArea);
  formData.append("greenImg2", dataColourImg2.greenArea);
  fetch(url, { method: "POST", body: formData })
    .then((res) => res.text())
    .then((res) => {
      if (!isNaN(res)) {
        saveProcessingImage(parseInt(res));
      } else {
        console.log("No se recibió un número");
        console.log(res);
      }
    });
};

const saveProcessingImage = (idProcessing) => {
  const url = "http://localhost/banarvi/backend/registerImageCollection.php";
  const formData = new FormData();
  formData.append("idProcessingResult", idProcessing);
  formData.append("originImg1", image1.src.split(",")[1]);
  formData.append("contourImg1", contourImage1.src.split(",")[1]);
  formData.append("colourImg1", inRangeImage1.src.split(",")[1]);
  formData.append("originImg2", image2.src.split(",")[1]);
  formData.append("contourImg2", contourImage2.src.split(",")[1]);
  formData.append("colourImg2", inRangeImage2.src.split(",")[1]);
  fetch(url, { method: "POST", body: formData })
    .then((res) => res.text())
    .then((res) => {
      if (res == "ok") {
        Swal.fire({
          icon: "success",
          title: "Registrado",
          iconColor: "#4fbc61",
          showConfirmButton: true,
          confirmButtonColor: "#4fbc61",
        }).then(
          changeControlButtonsStyle("cancel"),
          clearData(),
          changeCanvasImage("original"),
          changeImageProcess("captures")
        );
      } else {
        console.log(res);
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "No se realizó el registro",
          iconColor: "#D17384",
          confirmButtonColor: "#D17384",
        });
      }
    });
};

const getDate = () => {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }
  const currentDate = `${year}-${month}-${day}`;
  return currentDate;
};
