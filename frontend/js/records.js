const records = document.getElementById("records");
const searchButton = document.getElementById("search-button");
const initialDate = document.getElementById("initial-date");
const finalDate = document.getElementById("final-date");
const paramSelect = document.getElementById("param-order-select");
const orderSelect = document.getElementById("order-select");
const modalWindow = document.getElementById("modal-window");
const modalCloseButton = document.getElementById("btn-close-modal");
const imageModalWindow = document.getElementById("image-modal");
const main = document.getElementById("main");
const header = document.getElementById("header");
const buttonTheme = document.getElementById("button-theme");
const localStorage = window.localStorage;

modalWindow.addEventListener("click", (e) => {
  console.log(e.target.dataset.modal);
  switch (e.target.dataset.modal) {
    case "outside":
      modalWindow.classList.add("modal-container--disabled");
      main.classList.remove("element-hidden");
      header.classList.remove("element-hidden");
      break;
  }
});

buttonTheme.addEventListener('click', () => {
  buttonTheme.classList.contains("fa-moon")
  ? setTheme("dark")
  : setTheme("light");
})

window.addEventListener("load", () => {
  setInitialDate();
});

records.addEventListener("click", (e) => {
  if (e.target.dataset.id) {
    let cardContainer;
    if (e.target.classList[0] == 'fas') {
      cardContainer = e.target.parentNode.parentNode.parentNode;
    }
    else if (e.target.classList[0] == 'button') {
      cardContainer = e.target.parentNode.parentNode
    }
    const url = "http://localhost/banarvi/backend/deleteData.php";
    const formData = new FormData();
    Swal.fire({
      title: `¿Desea eliminar el registro ${e.target.dataset.id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#237AA8',
      cancelButtonColor: '#D17384',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: "#e6f0e65",
      iconColor: '#D17384'
    }).then((result) => {
      if (result.isConfirmed) {
        formData.append('idProcessingResult', e.target.dataset.id);
        fetch(url, { method: 'POST', body: formData})
        .then(res => res.text())
        .then(res => {
          if (res == 'ok') {
            Swal.fire({
              title: "Registro eliminado",
              confirmButtonColor: "#4fbc61",
              icon: 'success',
              iconColor: "#4fbc61",
              background: "#e6f0e65",
            });
            records.removeChild(cardContainer);
          } else {
            console.log(res)
            Swal.fire({
              title: "No se ha logrado eliminar",
              confirmButtonColor: '#D17384',
              icon: 'error',
              iconColor: '#D17384',
              background: "#e6f0e65",
            });
          }
        })
      }
    })
  }
});

searchButton.addEventListener("click", () => {
  let initYear = parseInt(initialDate.value.substring(0, 4));
  let initMonth = parseInt(initialDate.value.substring(5, 7));
  let initDay = parseInt(initialDate.value.substring(8, 10));
  let finaYear = parseInt(finalDate.value.substring(0, 4));
  let finaMonth = parseInt(finalDate.value.substring(5, 7));
  let finaDay = parseInt(finalDate.value.substring(8, 10));
  if (initDay > finaDay) {
    Swal.fire({
      title: "La fecha inicial debe ser menor a la fecha final",
      confirmButtonColor: "#4fbc61",
      icon: "warning",
      iconColor: "#4fbc61",
      background: "#e6f0e65",
    });
  } else {
    clearRecords();
    getProcessingData();
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

window.addEventListener("load", () => {
  localStorage.getItem("theme")
  ? setTheme(localStorage.getItem("theme"))
  : localStorage.setItem("theme", "light");
});

const createNewCard = (data) => {
  const card = document.createElement("ARTICLE");
  const cardTitle = document.createElement("H3");
  const imageContainer = document.createElement("DIV");
  const originImg = document.createElement("IMG");
  const contourImg = document.createElement("IMG");
  const colourImg = document.createElement("IMG");
  const cardContour = document.createElement("DIV");
  const cardColour = document.createElement("DIV");
  const cardCntSubtitle = document.createElement("H4");
  const cardColSubtitle = document.createElement("H4");
  const cardParamDimen = document.createElement("DIV");
  const cardParamArea = document.createElement("DIV");
  const cardParamPerim = document.createElement("DIV");
  const cardParamYellow = document.createElement("DIV");
  const cardParamGreen = document.createElement("DIV");
  const cardDimenLabel = document.createElement("SPAN");
  const cardDimenValue = document.createElement("SPAN");
  const cardAreaLabel = document.createElement("SPAN");
  const cardAreaValue = document.createElement("SPAN");
  const cardPerimLabel = document.createElement("SPAN");
  const cardPerimValue = document.createElement("SPAN");
  const cardYellowLabel = document.createElement("SPAN");
  const cardYellowValue = document.createElement("SPAN");
  const cardGreenLabel = document.createElement("SPAN");
  const cardGreenValue = document.createElement("SPAN");

  card.classList.add("card");
  cardTitle.className = "card__title";
  imageContainer.className = "card__image-container";
  originImg.className = "card__image";
  contourImg.className = "card__image";
  colourImg.className = "card__image";
  cardContour.className = "card__contour";
  cardColour.className = "card__colour";
  cardCntSubtitle.className = "card__subtitle";
  cardColSubtitle.className = "card__subtitle";
  cardParamDimen.className = "card__parameter";
  cardParamArea.className = "card__parameter";
  cardParamPerim.className = "card__parameter";
  cardParamYellow.className = "card__parameter";
  cardParamGreen.className = "card__parameter";
  cardDimenLabel.className = "card__label";
  cardDimenValue.className = "card__value";
  cardAreaLabel.className = "card__label";
  cardAreaValue.className = "card__value";
  cardPerimLabel.className = "card__label";
  cardPerimValue.className = "card__value";
  cardYellowLabel.className = "card__label";
  cardYellowValue.className = "card__value";
  cardGreenLabel.className = "card__label";
  cardGreenValue.className = "card__value";

  cardTitle.textContent = `Imagen ${data.numberImg}`;
  card.appendChild(cardTitle);
  originImg.setAttribute("src", data.originImg);
  contourImg.setAttribute("src", data.contourImg);
  colourImg.setAttribute("src", data.colourImg);

  originImg.addEventListener("dblclick", () => {
    modalWindow.classList.remove("modal-container--disabled");
    main.classList.add("element-hidden");
    header.classList.add("element-hidden");
    imageModalWindow.src = originImg.src;
  });

  contourImg.addEventListener("dblclick", () => {
    console.log("Click");
    modalWindow.classList.remove("modal-container--disabled");
    main.classList.add("element-hidden");
    header.classList.add("element-hidden");
    imageModalWindow.src = contourImg.src;
  });

  colourImg.addEventListener("dblclick", () => {
    modalWindow.classList.remove("modal-container--disabled");
    main.classList.add("element-hidden");
    header.classList.add("element-hidden");
    imageModalWindow.src = colourImg.src;
  });

  imageContainer.appendChild(originImg);
  imageContainer.appendChild(contourImg);
  imageContainer.appendChild(colourImg);
  card.appendChild(imageContainer);

  cardCntSubtitle.textContent = "Contorno";
  cardContour.appendChild(cardCntSubtitle);
  cardDimenLabel.textContent = "Dimensión:";
  cardDimenValue.textContent = data.dimension;
  cardParamDimen.appendChild(cardDimenLabel);
  cardParamDimen.appendChild(cardDimenValue);
  cardContour.appendChild(cardParamDimen);
  cardAreaLabel.textContent = "Area:";
  cardAreaValue.textContent = data.area;
  cardParamArea.appendChild(cardAreaLabel);
  cardParamArea.appendChild(cardAreaValue);
  cardContour.appendChild(cardParamArea);
  cardPerimLabel.textContent = "Perímetro:";
  cardPerimValue.textContent = data.perimeter;
  cardParamPerim.appendChild(cardPerimLabel);
  cardParamPerim.appendChild(cardPerimValue);
  cardContour.appendChild(cardParamPerim);
  cardColSubtitle.textContent = "Colores";
  cardColour.appendChild(cardColSubtitle);
  cardYellowLabel.textContent = "Amarillo:";
  cardYellowValue.textContent = data.yellow;
  cardParamYellow.appendChild(cardYellowLabel);
  cardParamYellow.appendChild(cardYellowValue);
  cardColour.appendChild(cardParamYellow);
  cardGreenLabel.textContent = "Verde:";
  cardGreenValue.textContent = data.green;
  cardParamGreen.appendChild(cardGreenLabel);
  cardParamGreen.appendChild(cardGreenValue);
  cardColour.appendChild(cardParamGreen);
  card.appendChild(cardContour);
  card.appendChild(cardColour);
  return card;
};

const setInitialDate = () => {
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
  initialDate.setAttribute("max", currentDate);
  finalDate.setAttribute("max", currentDate);
  initialDate.setAttribute("value", currentDate);
  finalDate.setAttribute("value", currentDate);
};

const getProcessingData = () => {
  let data;
  const url = "http://localhost/banarvi/backend/getProcessingData.php";
  const formData = new FormData();
  formData.append("initDate", initialDate.value);
  formData.append("finDate", finalDate.value);
  formData.append("orderBy", paramSelect.value);
  formData.append("order", orderSelect.value);
  fetch(url, { method: "POST", body: formData })
    .then((res) => res.json())
    .then((data) => {
      if (data.length == 0) {
        Swal.fire({
          title: "No se encontraron registros",
          confirmButtonColor: "#4fbc61",
          icon: "warning",
          iconColor: "#4fbc61",
          background: "#e6f0e65",
        });
      } else {
        fillData(data);
    }
  });
};

const fillData = (data) => {
  for (item of data) {
    const fragment = document.createDocumentFragment();
    const cardContainer = document.createElement("ARTICLE");
    const date = document.createElement("DIV");
    const dateLabel = document.createElement("SPAN");
    const dateValue = document.createElement("SPAN");

    const idCardContainer = document.createElement("DIV");
    const idCardLabel = document.createElement("SPAN");
    const idCardValue = document.createElement("SPAN");
    const buttonDeleteCard = document.createElement("DIV");
    const buttonCardIcon = document.createElement("I");

    cardContainer.className = "card-container";
    date.className = "date";
    dateLabel.className = "date__label";
    dateValue.className = "date__value";
    dateLabel.textContent = "Fecha: ";
    dateValue.textContent = item.dateData;

    idCardContainer.className = "id-card";
    idCardLabel.className = "id-card__label";
    idCardValue.className = "id-card__value";
    buttonDeleteCard.classList.add("button", "button-delete");
    buttonCardIcon.classList.add("fas", "fa-trash-alt", "button__icon");

    idCardLabel.textContent = "ID:";
    idCardValue.textContent = item.idProcessingResult;

    buttonDeleteCard.appendChild(buttonCardIcon);
    buttonDeleteCard.setAttribute("data-id", item.idProcessingResult);
    buttonCardIcon.setAttribute("data-id", item.idProcessingResult);
    idCardContainer.appendChild(idCardLabel);
    idCardContainer.appendChild(idCardValue);

    date.appendChild(dateLabel);
    date.appendChild(dateValue);
    date.appendChild(idCardContainer);
    date.appendChild(buttonDeleteCard);
    cardContainer.appendChild(date);
    const dataImage1 = {
      dimension: `${item.widthRectImg1} × ${item.heightRectImg1}`,
      area: item.areaImg1,
      perimeter: item.perimeterImg1,
      yellow: item.yellowImg1,
      green: item.greenImg1,
      originImg: `data:image/png;base64,${item.originImg1}`,
      contourImg: `data:image/png;base64,${item.contourImg1}`,
      colourImg: `data:image/png;base64,${item.colourImg1}`,
      numberImg: 1,
    };
    const dataImage2 = {
      dimension: `${item.widthRectImg2} × ${item.heightRectImg2}`,
      area: item.areaImg2,
      perimeter: item.perimeterImg2,
      yellow: item.yellowImg2,
      green: item.greenImg2,
      originImg: `data:image/png;base64,${item.originImg2}`,
      contourImg: `data:image/png;base64,${item.contourImg2}`,
      colourImg: `data:image/png;base64,${item.colourImg2}`,
      numberImg: 2,
    };
    const cardImage1 = createNewCard(dataImage1);
    const cardImage2 = createNewCard(dataImage2);
    cardContainer.appendChild(cardImage1);
    cardContainer.appendChild(cardImage2);
    fragment.appendChild(cardContainer);
    records.appendChild(fragment);
  }
};

const clearRecords = () => {
  while (records.firstChild) {
    records.removeChild(records.firstChild);
  }
};
