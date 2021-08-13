const records = document.getElementById("records");
const searchButton = document.getElementById("search-button");
const initialDate = document.getElementById("initial-date");
const finalDate = document.getElementById("final-date");
const colorSelect = document.getElementById("color-select");
const orderSelect = document.getElementById("order-select");

window.addEventListener("load", () => {
  setInitialDate();
});

searchButton.addEventListener("click", () => {
  clearRecords();
  getProcessingData('All');
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

const getProcessingData = (type) => {
  let data;
  const url = "http://localhost/banarvi/backend/getProcessingData.php";
  switch (type) {
    case "All":
      const formData = new FormData();
      formData.append("typeQuery", type);
      fetch(url, { method: "POST", body: formData})
        .then((res) => res.json())
        .then(data => fillData(data))
      break;
  }
  return data;
};


const fillData = (data) => {
  for (item of data) {
    const fragment = document.createDocumentFragment();
    const cardContainer = document.createElement("ARTICLE");
    const date = document.createElement("DIV");
    const dateLabel = document.createElement("SPAN");
    const dateValue = document.createElement("SPAN");
    cardContainer.className = "card-container";
    date.className = "date";
    dateLabel.className = "date__label";
    dateValue.className = "date__value";
    dateLabel.textContent = "Fecha: ";
    dateValue.textContent = item.dateData;
    date.appendChild(dateLabel);
    date.appendChild(dateValue);
    cardContainer.appendChild(date);
    const dataImage1 = {
      dimension : `${item.widthRectImg1} × ${item.heightRectImg1}`,
      area: item.areaImg1,
      perimeter: item.perimeterImg1,
      yellow: item.yellowImg1,
      green: item.greenImg1,
      originImg: `data:image/png;base64,${item.originImg1}`,
      contourImg: `data:image/png;base64,${item.contourImg1}`,
      colourImg: `data:image/png;base64,${item.colourImg1}`,
      numberImg: 1
    }
    const dataImage2 = {
      dimension : `${item.widthRectImg2} × ${item.heightRectImg2}`,
      area: item.areaImg2,
      perimeter: item.perimeterImg2,
      yellow: item.yellowImg2,
      green: item.greenImg2,
      originImg: `data:image/png;base64,${item.originImg2}`,
      contourImg: `data:image/png;base64,${item.contourImg2}`,
      colourImg: `data:image/png;base64,${item.colourImg2}`,
      numberImg: 2
    }
    const cardImage1 = createNewCard(dataImage1);
    const cardImage2 = createNewCard(dataImage2);
    cardContainer.appendChild(cardImage1);
    cardContainer.appendChild(cardImage2);
    fragment.appendChild(cardContainer);
    records.appendChild(fragment);
  }
}

const clearRecords = () => {
  while(records.firstChild) {
    records.removeChild(records.firstChild);
  }
} 