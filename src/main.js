// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
const { invoke } = window.__TAURI__.tauri;

// Pour invoquer une fonction du back-end
// Exemple : const value = await invoke("greet", { name: greetInputEl.value });

window.addEventListener("DOMContentLoaded", () => {
  // When everything in the DOM is fine we execute this!

});

function GetElementByID(ID)
{
  return document.getElementById(ID);
}

function GetElementsByClass(C)
{
  return document.getElementsByClassName(C);
}

const canvas = GetElementByID("game");
const context = canvas.getContext('2d');
context.canvas.width = document.body.clientWidth;
context.canvas.height = window.innerHeight;
const imageObj = new Image();

document.body.onresize = () => {
  context.canvas.width = document.body.clientWidth;
  context.canvas.height = window.innerHeight;
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  draw();
}

// imageObj.onload = function() {
//   context.drawImage(imageObj, 0, 0, 256, 256);
// };
// imageObj.src = './assets/tauri.svg';

function draw()
{
  context.beginPath();
      context.moveTo(100, 20);

      // line 1
      context.lineTo(200, 160);

      // quadratic curve
      context.quadraticCurveTo(230, 200, 250, 120);

      // bezier curve
      context.bezierCurveTo(290, -40, 300, 200, 400, 150);

      // line 2
      context.lineTo(500, 90);

      context.lineWidth = 5;
      context.strokeStyle = 'blue';
      context.stroke();
}

draw();