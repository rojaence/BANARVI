# BANARVI

Proyecto de visión por computadora con tecnologías web

## Descripción

En principio es un proyecto orientado al entorno web para analizar objetos  
con visión  por computadora y detectar diferentes tipos de aspectos como el  
contorno, área y perímetro en píxeles, además de la detección de colores.

El programa permite seleccionar desde el navegador una cámara conectada  
al ordenador y realizar dos capturas del objeto a analizar, aunque se puede  
testear con diferentes objetos, la detección de colores está programada para  
detectar únicamente amarillo y verde hasta un cierto rango en HSV.  

Adicional se ha agregado una página para realizar estas mismas operaciones  
de detección pero en tiempo real, aunque requiere algunas optimizaciones.  

Se utilizan algunas de las funciones principales de OpenCV.js tales como:  
inRange, threshold, findContours, imread, cvtColor, entre otras.

También están programadas algunas funciones para almacenar registros en  
una base SQL aunque están deshabilitadas por lo que sólo está habilitado  
el frontend para realizar análisis.  

Aclaro que este proyecto lo he realizado como una práctica mientras cursaba  
un semestre en la universidad con motivos de aprendizaje de tecnologías tanto  
web como visión por computadora, por lo que asumo que se pueden mejorar  
muchos aspectos.

## Características

- Selección de cámara  
- Panel de control con vista previa  
- Representación de imágenes mediante canvas  
- Detección de contorno, área y perímetro  
- Dibujado de contorno  
- Detección de colores (verde y amnarillo)  

## Tecnologías utilizadas

### Frontend
- HTML
- SCSS
- Vanilla JavaScript
- FontAwesome
- OpenCV.js

### Backend
- PHP
- MySql

## Probar la aplicación

⚠️ Es necesario utilizar un servidor local como XAMPP o liveServer en VSCode 
para permitir el acceso a los dispositivos de cámara desde el navegador.

⚠️ Es importante que al realizar pruebas el entorno tenga:

- Buena iluminación  
- Fondo de color blanco  

## Test realizado con un cubo de Rubik  

### Capturas de pantalla

## Capturas originales  
![All text](/frontend/assets/screenshots/screenshot_captureTest1.png?raw=true)

## Detección de colores
![All text](/frontend/assets/screenshots/screenshot_captureTest2.png?raw=true)

## Detección en tiempo real
![All text](/frontend/assets/screenshots/screenshot_captureTest3.png?raw=true)
## 
