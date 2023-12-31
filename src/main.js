// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
const { invoke } = window.__TAURI__.tauri;

const Log = console.log;

function TypeOf(Type, Value)
{
	if(typeof Type === "string")
	{
		if (Type.toLowerCase() === "array")
		{
			return Value.constructor.name === Type;
		}
		return typeof Value === Type.toLowerCase();
	}
	throw Error("The Type must be in a string format (use InstanceOf for everything else)");
}

function TypeOfInit(Type, Value)
{
  if(Value === undefined)
	{
		throw Error("[InstanceOfInit] The value is not defined!");
	}
  if(typeof Value === Type.toLowerCase())
  {
    return Value;
  } 

  throw Error("Its not the Type wanted!");
}

function InstanceOf(Instance, Value)
{
	try
	{
		switch(Instance)
		{
			case Object:
			{
				if(!TypeOf("Function", Value) && !TypeOf("Array", Value))
				{
					return Value instanceof Object;
				}
				return false;
			} break;
			case Function:
			{
				return Value instanceof Function;
			} break;
			case String:
			{
				return TypeOf("String", Value);
			} break;
			case Number:
			{
				return TypeOf("Number", Value);				
			} break;
			case Array:
			{
				return TypeOf("Array", Value);
			} break;
		}
		return Value instanceof Instance;
	}
	catch(e)
	{
		throw Error(e.message);
	}
}

// Useful to check if its the good Type/Instance and init the variable
function InstanceOfInit(Instance, Value)
{
	if(Value === undefined)
	{
		Debug.Error(InstanceOfInit, "The value is not defined!");
		return;
	}
	if(InstanceOf(Instance, Value) || Value === null)
	{
		return Value;
	}
	throw Error("Its not the Type/Instance wanted!");
}

function InstancesOfInit(Instances, Data)
{
	if(Data === undefined)
	{
		throw Error(`Data is not set! [Data:${Data}]`);
	}
	if(InstancesOf(Instances, Data) || Data === null)
	{
		return Data;
	}
	throw Error("No instance matched!");
}

function InstancesOf(Instances, Value)
{
	if(TypeOf("Array", Instances))
	{
		return For(0, Instances.length, 1, (It, Return) =>
		{
			const Instance = Instances[It];
			if (InstanceOf(Instance, Value))
			{
				Return.Now(true);
			}
		});
	}
	return false;
}

const COLORS = {
  Red: "#FF6347",
  Blue: "#4169E1",
  Purple: "#9370DB",
  Green: "#3CB371",
  DarkGreen: "#268971",
  Orange: "#FFA500",
  Lavender: "#E6E6FA",
  White: "#F8F8FF",
  Black: "#212121",
}

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
const ctx = canvas.getContext('2d');

const HDResolution = 1080/1920;
ctx.canvas.width = document.body.clientWidth;
ctx.canvas.height = document.body.clientWidth * HDResolution;
const imageObj = new Image();

document.body.onresize = () => {
  ctx.canvas.width = document.body.clientWidth;
  ctx.canvas.height = document.body.clientWidth * HDResolution;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  MapCellWidthRatio = parseInt(ctx.canvas.width / 32);
  MapCellHeightRatio = parseInt(ctx.canvas.height / (32 * HDResolution));
}

// imageObj.onload = function() {
//   ctx.drawImage(imageObj, 0, 0, 256, 256);
// };
// imageObj.src = './assets/tauri.svg';

const _Map = [];
let XCellsAmount = 32;
let YCellsAmount = parseInt(32 * HDResolution);
let MapCellWidthRatio = parseInt(ctx.canvas.width / 32);
let MapCellHeightRatio = parseInt(ctx.canvas.height / (32 * HDResolution));

for (let y = 0; y < YCellsAmount; y++) {
  for (let x = 0; x < XCellsAmount; x++) {
    _Map.push("Random");
  }
}

function StrokeRect(x, y, Width, Height, Color)
{
  ctx.strokeStyle = Color;
  ctx.strokeRect(x, y, Width, Height);
  ctx.stroke();
}
function FilledRect(x, y, Width, Height, Color)
{
  ctx.fillStyle = Color;
  ctx.rect(x, y, Width, Height);
  ctx.fill();
}

// To count FPS
let Time = new Date().getSeconds();
let LastTime = Time;
let Timer = 0;
let FPS = 0;

let XY = { X:ctx.canvas.width / 2-7, Y:ctx.canvas.height/2-7};
let YPulse = 5;

class Rectangle
{
  constructor(Filled=false, X=0, Y=0, Width=0, Height=0, Color=COLORS.Black)
  {
    this.Filled = Filled;
    this.X = TypeOfInit("Number", X); 
    this.Y = TypeOfInit("Number", Y);
    this.Width = TypeOfInit("Number", Width);
    this.Height = TypeOfInit("Number", Height);
    this.Color = TypeOfInit("String", Color);
  }

  Show()
  {
    if(this.Filled)
    {
      ctx.fillStyle = this.Color;
      ctx.fillRect(this.X, this.Y, this.Width, this.Height);
      ctx.fill();
      return;
    }
    ctx.strokeStyle = this.Color;
    ctx.strokeRect(this.X, this.Y, this.Width, this.Height);
    ctx.stroke();
  }
}

class Tank
{
  #Rotation = 0;
  constructor(_Image)
  {
    this.Coords = {X:0, Y:0};
    this._Image = _Image;
  }

  Update()
  {
    if(this._Image)
    {
      if(InstanceOf(Image, this._Image))
      {
        ctx.drawImage(this._Image);
        return;
      }
    }
  }

  get Rotation() { return this.#Rotation; }
  set Rotation(Deg)
  {
    this.#Rotation = Deg;
  }
}

function DegToRad(Degrees)
{
  return Degrees * Math.PI/180;
}

const Rect = new Rectangle(true, 50, 50, 50, 50);


function draw()
{
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	Time = new Date().getSeconds();
	
	if(LastTime - Time)
	{
		FPS = Timer+1;
		Log("FPS :", FPS);
		Timer = 0;
	}
	else
	{
		++Timer;
	}
	
	ctx.smoothFont = true;
	ctx.font = "48px consolas"
	ctx.fillText(FPS + " fps", 0, 48);
	
  for (let i = 0; i < _Map.length; i++) {
		// ctx.lineWidth = 5;
    // StrokeRect(
			//   (i%32)*MapCellWidthRatio, 
			//   parseInt(i/32)*MapCellHeightRatio, 
			//   MapCellWidthRatio, 
			//   MapCellHeightRatio,
			//   COLORS.Green
			// );
			//const SP = new Sprite("./assets/alexandre.png");
		}
		
		
		//ctx.clearRect();
		
		//FilledRect(10, 10, 150, 100, COLORS.Blue);
		ctx.beginPath();
		ctx.ellipse(XY.X, XY.Y, 15, 15, Math.PI / 180, 0, 2 * Math.PI, false);
		ctx.strokeStyle = "blue";
		ctx.strokeWeight = "5px";
		ctx.fill();
		ctx.closePath();

		XY.Y += YPulse;
		if (XY.Y > ctx.canvas.height - 15 || XY.Y < 15)
		{
			YPulse = -YPulse;
		}

		Rect.Show();
		
		LastTime = Time;
		requestAnimationFrame(draw);
	}
	


draw();
