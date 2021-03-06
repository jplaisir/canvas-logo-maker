'use strict';
console.log('script loaded sucessfully');

const version = 'V1.03';
const workArea = document.getElementById('work-area');
let currentWidth = 0;
let currentHeight = 0;
let storedLayers = [];
let activeLayer = '';
let currentLineColor = '#000000';
let currenInfillColor = '#000000';
let infill = false;
let modeLine = true;
let modeDraw = false;

function CreateCanvas(name, height, width) {
  this.name = name;
  this.height = height;
  this.width = width;
  this.lines = [];
  this.infill = false;
  this.infillColor = '#000000';

  let newCanvas = document.createElement('canvas')
  newCanvas.setAttribute('id', this.name);
  newCanvas.setAttribute('class', 'canvas');
  newCanvas.setAttribute('height', this.height);
  newCanvas.setAttribute('width', this.width);
  newCanvas.setAttribute('style', `z-index: ${storedLayers.length};`)
  workArea.appendChild(newCanvas);
  activeLayer = this.name;
  currentWidth = this.width;
  currentHeight = this.height;
  storedLayers.push(this);
};

function renderActiveLayer() {
  for (let i = 0; i < storedLayers.length; i++) {
    if (storedLayers[i].name === activeLayer) {
      let thisCanvas = document.getElementById(storedLayers[i].name).getContext('2d');
      thisCanvas.clearRect(0, 0, currentWidth, currentHeight);
      thisCanvas.beginPath();
      if (storedLayers[i].lines.length === 1) {
        thisCanvas.moveTo(storedLayers[i].lines[0].lineX, storedLayers[i].lines[0].lineY);
      } else {
        for (let j = 0; j < storedLayers[i].lines.length; j++) {
          thisCanvas.lineTo(storedLayers[i].lines[j].lineX, storedLayers[i].lines[j].lineY);
          thisCanvas.strokeStyle = storedLayers[i].lines[j].color; 
        };
        if (infill === true) {
          thisCanvas.fillStyle = currenInfillColor;
          storedLayers[i].infill = infill;
          storedLayers[i].infillColor = currenInfillColor;
          thisCanvas.fill();
        };
      };
      thisCanvas.stroke();
      break;
    };
  };
};

function renderAllLayers() {
  let thisCanvas = document.getElementById(storedLayers[storedLayers.length - 1].name).getContext('2d');
  thisCanvas.clearRect(0, 0, currentWidth, currentHeight);
  for (let i = 0; i < storedLayers.length; i++) {
    thisCanvas.beginPath();
    if (storedLayers[i].lines.length === 1) {
      thisCanvas.moveTo(storedLayers[i].lines[0].lineX, storedLayers[i].lines[0].lineY);
    } else {
      for (let j = 0; j < storedLayers[i].lines.length; j++) {
        thisCanvas.lineTo(storedLayers[i].lines[j].lineX, storedLayers[i].lines[j].lineY);
        thisCanvas.strokeStyle = storedLayers[i].lines[j].color; 
      };
      if (infill === true) {
        thisCanvas.fillStyle = storedLayers[i].infillColor;
        thisCanvas.fill();
      };
    };
    thisCanvas.stroke();
  };
};

function addNewDrawpoint(x, y) {
  let line = {
    lineX: x,
    lineY: y,
    color: currentLineColor
  };
  for (let i = 0; i < storedLayers.length; i++) {
    if (storedLayers[i].name === activeLayer) {
      storedLayers[i].lines.push(line);
      break;
    };
  };
  renderActiveLayer();
};

function undoDrawpoint() {
  for (let i = 0; i < storedLayers.length; i++) {
    if (storedLayers[i].name === activeLayer) {
      storedLayers[i].lines.pop();
      break;
    };
  };
  renderActiveLayer();
};

document.onmousedown = function (e) {
  if (e.which === 1) {// Left Mouse button
    mousePosition(event);
  };
  if (e.which === 2) {// Middle Mouse button
    console.log('Middle Mouse button')
  };
  if (e.which === 3) {// Right Mouse button
    console.log('Right mouse button')
  };
  if (e.which === 4) {// Mouse button 4
    console.log('Mouse button 4')
  };
  if (e.which === 5) {// Mouse button 5
    console.log('Mouse button 5')
  };
};

function mousePosition(event) {
  var rect = workArea.getBoundingClientRect();
  let x = Math.round(event.clientX - rect.left);
  let y = Math.round(event.clientY - rect.top);
  // console.log(rect.top, rect.right, rect.bottom, rect.left);
  console.log('X:', x, 'Y:', y);
  if (x > 0 && y > 0 && x < currentWidth && y < currentHeight) {
    addNewDrawpoint(x, y);
  };
};

window.onload = function () {
  console.log('page loaded');
  const setTitle = document.getElementById('title');
  setTitle.innerHTML = 'Crappy Graphics Designer ' + version;
  new CreateCanvas('can-1', 400, 400);
};

//  On Screen Controlls.
// let saveAsImage = document.getElementById(storedLayers[storedLayers.length - 1].name);
let saveAsImage = document.getElementById('save-image');
saveAsImage.addEventListener('click', function (e) {
  console.log('save button clicked')
    let canvas = document.getElementById(storedLayers[storedLayers.length - 1].name);
    let dataURL = canvas.toDataURL('image/png');
    let tmpLink = document.createElement( 'a' );      
    tmpLink.download = 'image.png'; // set the name of the download file     
    tmpLink.href = dataURL;        // temporarily add link to body and initiate the download      
    document.body.appendChild( tmpLink );      
    tmpLink.click();      
    document.body.removeChild( tmpLink ); 
});

let infillUse = document.getElementById('infill');
infillUse.onclick = function () {
  if (infill === false) {
    infill = true;
    infillUse.innerHTML = 'No fill';
  } else {
    infill = false;
    infillUse.innerHTML = 'In fill';
  };
  renderActiveLayer();
};

let newLayer = document.getElementById('new-layer');
newLayer.onclick = function () {
  new CreateCanvas(`can-${storedLayers.length + 1}`, 400, 400);
  console.log('New Layer Created.');
};

let combineLayers = document.getElementById('combine-layers');
combineLayers.onclick = function () {
  new CreateCanvas(`can-${storedLayers.length + 1}`, 400, 400);
  renderAllLayers();
  console.log('all layers combined');
};

let removeLine = document.getElementById('undo');
removeLine.onclick = function () {
  undoDrawpoint();
  console.log('Line Removed.');
};

let colorSelector = document.getElementById('color-select');
colorSelector.onclick = function () {
  renderActiveLayer();
};
