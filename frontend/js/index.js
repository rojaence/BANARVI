const multimediaContainer = document.getElementById("multimedia");
const divImage1 = document.getElementById("div-image-1");
const divImage2 = document.getElementById("div-image-2");
const canvasImage1 = document.getElementById("canvas-image-1");
const canvasImage2 = document.getElementById("canvas-image-2");
const cameraButton = document.getElementById("camera-button");
const deleteButton = document.getElementById("delete-button");
const analizeButton = document.getElementById("analize-butto");
const listCamDevice = document.getElementById("camera-device");
const refreshButton = document.getElementById("refresh-button");
const playButton = document.getElementById("play-button");
let videoStreaming = document.getElementById("stream");
let width = 320;
let height = 0;
let canvasSelected;

multimediaContainer.addEventListener("click", (e) => {
  if (e.target.dataset.image == "image-1") {
    divImage1.classList.add("multimedia__image--active");
    divImage2.classList.remove("multimedia__image--active");
  } else if (e.target.dataset.image == "image-2") {
    divImage1.classList.remove("multimedia__image--active");
    divImage2.classList.add("multimedia__image--active");
  }
});

listCamDevice.addEventListener("click", () => {});

refreshButton.addEventListener("click", (e) => {
  fillDeviceList();
});

cameraButton.addEventListener("click", () => {
  takePicture();
});

playButton.addEventListener("click", () => {
  startStream();
});

canvasImage1.addEventListener('click', () => {canvasSelected = canvasImage1});
canvasImage2.addEventListener('click', () => {canvasSelected = canvasImage2});

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

const cleanSelect = (element) => {
  for (let x = element.options.length - 1; x >= 0; x--) {
    element.options.remove(x);
  }
};


const startStream = () => {
  MediaStreamHelper.requestStream().then(function(stream){
    MediaStreamHelper._stream = stream;
    videoStreaming.srcObject = stream;
    videoStreaming.play();
  })
}

const takePicture = () => {
  adjustApectSize();
  canvasSelected.width = width;
  canvasSelected.height = height;
  canvasSelected.getContext("2d").drawImage(videoStreaming, 0, 0, width, height);
};

const adjustApectSize = () => {
  height = videoStreaming.videoHeight / (videoStreaming.videoWidth / width);
  videoStreaming.setAttribute("width", width);
  videoStreaming.setAttribute("height", height);
  canvasSelected.setAttribute("width", width);
  canvasSelected.setAttribute("height", height);
}

window.addEventListener("load", () => {
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
