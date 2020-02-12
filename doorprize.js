URL: http://taz.harding.edu/~ggilbert1/doorp/


var DRIVER_SIZE = 40;
var CANVAS_OFFSET = 20;
var CANVAS_SIZE = 640;
var FINAL_STRETCH = 19;
var REG_SPEED = 3;
var RIGHT = 0, LEFT = 1;
var turns = [RIGHT, RIGHT, LEFT, LEFT, RIGHT, RIGHT, RIGHT, RIGHT];

var t;
var turnCounter;
var count;
var turnPoints;
var intervalID;
var raceOver;
var boostedDrivers;
var updateCount;
var gopherLoc;
var gopherHeight;
var deltaGopher;
var holeSize;
var rank;
var bananaImg;
var curVid;
var killing;
var doneKilling;
var progressPath
var scoreBoard;
var icons;
var nameDisplays;
var started;
var ctx;
var contestants;
var shouldWave;
var waveTimer;
var upWave;
var waveImages = [];
waveImages[0] = new Image();
waveImages[1] = new Image();
waveImages[0].src = "Resources/Sprites/flag0.png";
waveImages[1].src = "Resources/Sprites/flag1.png";
var waveImg = new Image();

var participantScreen;
var contestantScreen;
var raceScreen;
var canvas;
var goButton;
var cancelButton;

window.addEventListener("load", loadAndInitialize, false);

function loadAndInitialize()
{
	var progressString = document.getElementById("progress").innerHTML;
	progressPath = progressString.split("#");
	participantScreen = document.getElementById("participants");
	scoreboard = document.getElementById("scoreboard");
	contestantScreen = document.getElementById("contestants");
	raceScreen = document.getElementById("race");
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	participantScreen.style.visibility = "hidden";
	contestantScreen.style.visibility = "hidden";
	raceScreen.style.visiblility = "hidden";
	canvas.style.visiblility = "hidden";
	goButton = document.getElementById("gobutton");
	cancelButton = document.getElementById("cancelbutton");
	goButton.removeEventListener("click", go, false);

	boostedDrivers = [0,1];
	updateCount = 0;
	gopherLoc = -1;
	gopherHeight = 0;
	deltaGopher = 3;
	holeSize = 5;
	rank = [0, 1, 2, 3, 4];
	raceOver = false;
	shellIntervalID = -1;
	turnPoints = [3, 5, 7, 9, 11, 13, 19, 22];
	killing = false;
	doneKilling = false;
	icons = [];
	nameDisplays = [];
	contestants = [];
	started = false;
	waveTimer = -1;
	t = 3*Math.PI/2;
	turnCounter = 0;
	count = 0;
	upWave = false;
	waveImages = [];
	waveImages[0] = new Image();
	waveImages[1] = new Image();
	waveImages[0].src = "Resources/Sprites/flag0.png";
	waveImages[1].src = "Resources/Sprites/flag1.png";
	waveImg = new Image();
		
	start();
}

function start()
{
	
	participantScreen.style.visibility = "visible";
	participantScreen.style.display = "inline-block";
	
	var submitButton = document.getElementById("submitbutton");
					
	submitButton.addEventListener("click", function() {
		var namefield = document.getElementById("namefield");
		var names = namefield.value.split("\n");
		for(var i = 0; i < names.length; i++)
		{
			console.log(names);
			if(names[i].trim().length == 0)
			{
				names.splice(i,1);
				i--;
			}
		}
		if(names.length < 5)
		{
			window.alert("Please enter at least 5 names");
			return;
		}
		participantScreen.style.visibility = "hidden";
		
		startContestantScreen(names);
	}, false);
}

function startContestantScreen(names)
{
	contestantScreen.style.visibility = "visible";
	contestantScreen.style.display = "inline-block";
	
	names = shuffle(names);
	for(i = 0; i < 5; i++)
		contestants[i] = names[i];
	
	driverNames = ["Mario", "Peach", "Bowser", "Toad", "Yoshi"];
	driverNames = shuffle(driverNames);
	for(var i = 0; i < driverNames.length; i++)
	{
		var image;
		image = new Image();
		image.src = "Resources/Icons/" + driverNames[i] + ".png";
		icons[i] = document.getElementById("icon" + i);
		nameDisplays[i] = document.getElementById("name" + i);
		icons[i].src = image.src;
		nameDisplays[i].innerHTML = contestants[i];
	}	
	
	goButton.addEventListener("click", go, false);
	
	cancelButton.addEventListener("click", function(){
		loadAndInitialize();
	}, false);
}

function go() 
{
	if(started)
		return; //because the button is not immediately hidden
	prepareScreen(contestantScreen, driverNames, contestants);
}

function prepareScreen(contestantScreen, driverNames, contestants)
{
	var body = document.getElementById("entire");
	var map = document.getElementById("map");
	var opacity = 0;
	var rgb = 255;
	var tid = setInterval(function() {
		if(rgb-- <= 1)
		{
			contestantScreen.style.visibility = "hidden";
			prepareMap(driverNames, contestants);
			clearInterval(tid);
		}
		opacity = (rgb / 255);
		var color = "rgb(" + rgb + "," + rgb + "," + rgb + ")";
		contestantScreen.style.opacity = opacity;
		body.style["background-color"] = color;
	},5);
}

function prepareMap(driverNames, contestants)
{
	raceScreen.style.visibility = "visible";
	canvas.style.visibility = "visible";
	var map = document.getElementById("map");
	var opacity = 0;
	var rgb = 255;
	var drivers = [];
	for(var j = 0; j < 5; j++)
	{
		drivers[j] = new Driver(driverNames[j], j, contestants[j]);
	}
	
	setTimeout(function() {update(drivers)}, 200);

	var tID = setInterval(function() {
		opacity += 1/255;
		if(opacity >= 1)
		{
			clearInterval(tID);
			readySetGo(drivers);
		}
		var color = "rgb(" + rgb + "," + rgb + "," + rgb + ")";
		map.style.opacity = opacity;
	},5);
}

function readySetGo(drivers)
{
	var countdown = 1;	
	var goImages = [];
	for(var i = 0; i < 4; i++)
		goImages[i] = new Image();
	goImages[0].src = "Resources/Sprites/golight.png";
	goImages[1].src = "Resources/Sprites/golight0.png";
	goImages[2].src = "Resources/Sprites/golight1.png";
	goImages[3].src = "Resources/Sprites/golight2.png";
	var goLight = new Image();
	goLight.src = goImages[0].src;
	var tID = setInterval(function(){
		if(countdown == 1)
		{
			var soundbyte = document.getElementById("countsound");
			soundbyte.play();
		}
		ctx.clearRect(200,0, 40, 40);
		ctx.drawImage(goLight, 200, 0, 40, 40);
		if(countdown <= 3)
			goLight.src = goImages[countdown].src;
		countdown++;
		if(countdown == 5)
		{
			clearInterval(tID);
			setTimeout(function(){
				ctx.clearRect(200,0, 40, 40);
				startRace(drivers);
			}, 1000);
			return;
		}
	}, 1000);
}

function startRace(drivers)
{				
	bananaImg = new Image();
	bananaImg.src = "Resources/Sprites/gopher.png";
	intervalID = setInterval(function() {update(drivers)}, 25);
}
					
function update(drivers)
{
	ctx.clearRect(0,0, CANVAS_SIZE, CANVAS_SIZE);
	updateCount++;
	if(updateCount % 5 == 0)
		determinePlace(drivers);
	if(updateCount % 10 ==0)
		upWave = !upWave;
	if(gopherLoc != -1 && holeSize > 0)
	{
		paintGopher();
	}
	if(shouldWave)
		paintWaver();
	for(i = 0; i < drivers.length; i++)
	{
		var driver = drivers[i];
		updateCoords(driver);
		paintDriver(driver);
	}
}

function updateCoords(driver)
{
	if(driver.dying || raceOver)
		return;
	driver.curLoc.x += driver.delta[0];
	driver.curLoc.y += driver.delta[1];
	/*
	Will usually not land exactly on the destination point, so we just
	snap to the destination when it nears it.
	*/
	if(Math.abs(driver.curLoc.x - driver.destLoc.x) < 6 && Math.abs(driver.curLoc.y - driver.destLoc.y) < 6)
		driver.snapToPoint();
}

function paintDriver(driver)
{
	if(driver.dying)
	{		
		if(updateCount % 3 == 0)
			driver.spinRight();
		if(driver.shrink >= DRIVER_SIZE)
			return;
		ctx.save();			
		ctx.translate(driver.curLoc.x - DRIVER_SIZE/2 + CANVAS_OFFSET, driver.curLoc.y - DRIVER_SIZE/2 + CANVAS_OFFSET);
		ctx.drawImage(driver.sprites[driver.spriteIndex], 10, 10, DRIVER_SIZE - driver.shrink, DRIVER_SIZE - driver.shrink);
		ctx.restore();
	}
	else
	{
		
		ctx.drawImage(driver.sprites[driver.spriteIndex], driver.curLoc.x - DRIVER_SIZE/2 + CANVAS_OFFSET, driver.curLoc.y - DRIVER_SIZE/2 + CANVAS_OFFSET, DRIVER_SIZE, DRIVER_SIZE);
	}
}

function paintWaver()
{
	console.log(Number(upWave));
	waveImg.src = waveImages[Number(upWave)].src;
	ctx.clearRect(200,0, 40, 40);
	ctx.drawImage(waveImg, 200, 0, 40, 40);
}

function updateScoreboard(drivers)
{
	while(scoreboard.childNodes.length > 0)
	{
		scoreboard.removeChild(scoreboard.childNodes[0]);
	}
	if(drivers == 0)
		return;
	for(var i = 0; i < rank.length; i++)
	{
		driverIndex = rank[i];
		var icon = icons[driverIndex];
		var nameDisplay = nameDisplays[driverIndex];
		icon.style.width = "20px";
		nameDisplay.style["font-size"] = "2em";
		var ordinal;
		if(i == 0)
			ordinal = "st";
		else if(i == 1)
			ordinal = "nd";
		else if(i == 2 || i == 3)
			ordinal = "rd";
		else
			ordinal = "th";
		nameDisplay.innerHTML = (i + 1) + ordinal + " " + drivers[driverIndex].realName;
		scoreboard.appendChild(icon);
		scoreboard.appendChild(nameDisplay);
		scoreboard.appendChild(document.createElement('br'));
	}
}

function determinePlace(drivers)
{
	for(var i = 0; i < drivers.length; i++)
	{
		var driver = drivers[i];
		if(drivers[i].dying || typeof(progressPath[driver.progress]) == "undefined")
			continue;
		var progressData = progressPath[driver.progress].trim().split(/\s/);
		
		if(progressData[0] == "xlessthan")
		{
			if(driver.curLoc.x < progressData[1])
				driver.progress++;
		}
		else if(progressData[0] == "ylessthan")
		{
			if(driver.curLoc.y < progressData[1])
				driver.progress++;
		}
		else if(progressData[0] == "xgreaterthan")
		{
			if(driver.curLoc.x > progressData[1])
				driver.progress++;
		}
		else
		{
			if(driver.curLoc.y > progressData[1])
				driver.progress++;
		}
	}
	var checked = [];
	for(var i = 0; i < rank.length; i++)
	{
		var maxProgress = -1;
		var maxIndex = -1;
		for(var j = 0; j < 5; j++)
		{
			var driver = drivers[j];
			if(!checked[j] && driver.progress > maxProgress)
			{
				maxProgress = driver.progress;
				maxIndex = j;
			}
		}
		rank[i] = maxIndex;
		checked[maxIndex] = true;
	}
	updateScoreboard(drivers);
}
		
function paintGopher()
{
	deltaGopher -= 0.07;
	if(gopherHeight >= 0)
		gopherHeight += deltaGopher;
	var x = 40;
	var y = gopherLoc.y;
	var startAngle = 0;
	var endAngle = toRadians(180);
	antiClockwise = true;
	
	ctx.fillStyle = "black";
	
	ctx.beginPath();
	ctx.arc(x, y, holeSize, startAngle, endAngle, antiClockwise);
	ctx.fill();
	
	if(holeSize >= 22 && gopherHeight > 0)
		ctx.drawImage(bananaImg, x - 15, y  - gopherHeight, 30, 30);
	
	ctx.beginPath();
	ctx.arc(x, y, holeSize, startAngle, endAngle, !antiClockwise);
	ctx.fill();
	
	if(gopherHeight >= 0 && holeSize < 22)
		holeSize+=3;
	else if(gopherHeight < 0)
		holeSize-=3;	
}

function finishRace(driver)
{
	clearInterval(intervalID);
	scoreboard.style.visibility = "hidden";
	updateScoreboard(0);
	var body = document.getElementById("entire");
	var raceScreen = document.getElementById("map");
	raceScreen.style.visibility = "hidden";
	raceOver = true;
	var winDisplay = document.getElementById("winstuff");
	var newButton = document.getElementById("newbutton");
	newButton.addEventListener("click", function(){location.reload()}, false);
	document.getElementById("winner").innerHTML = driver.realName + " wins!!!";
	winDisplay.style.visibility = "visible";

	var winIcon = new Image();
	winIcon.src = "Resources/Icons/" + driver.name + ".png";

	driver.spriteIndex = 7;
	driver.curLoc.x = 0;
	driver.curLoc.y = 300;
	tID = setInterval(function(){driveInOrOut(driver, tID, 1);}, 5);
}

function driveInOrOut(driver, tID, direction)
{
	driver.curLoc.x += direction;
	ctx.clearRect(0,0, CANVAS_SIZE, CANVAS_SIZE);
	ctx.drawImage(driver.sprites[driver.spriteIndex], driver.curLoc.x, driver.curLoc.y, DRIVER_SIZE, DRIVER_SIZE);
	if(driver.curLoc.x >= 300)
	{
		clearInterval(tID);
		tID2 = setInterval(function(){
			circle(driver, tID2);
		}, 5);
	}
	else if(driver.curLoc.x < -DRIVER_SIZE)
		clearInterval(tID);
}
	
function circle(driver, tID)
{
	var radius = 50;
	t += .02;
	turnCounter += .02;
	var x = radius * Math.cos(t);
	var y = radius * Math.sin(t);
	if(t >= 9*Math.PI/2) //circle and a half from 3pi/2
	{
		clearInterval(tID);
		driver.spriteIndex = 16;
		driver.curLoc.y += 2 * radius;
		tID2 = setInterval(function(){driveInOrOut(driver, tID2, -1);}, 5);
		return;
	}
	ctx.clearRect(0,0, CANVAS_SIZE, CANVAS_SIZE);
	ctx.drawImage(driver.sprites[driver.spriteIndex], driver.curLoc.x + x,  driver.curLoc.y + y + radius, DRIVER_SIZE, DRIVER_SIZE);
	if(turnCounter > toRadians(360 / 24))
	{
		turnCounter = 0;
		driver.turnRight();
	}
}

/*
	Input: the coordinates of the destination and the desired displacement per frame
	Output: the delta-x and delta-y needed to get the driver to the destination
*/
function partition(x1, y1, x2, y2, displace)
{
	var vDist = (y2 - y1);
	var hDist = (x2 - x1);
	var xSign = (hDist > 0) ? 1 : -1;
	var ySign = (vDist > 0) ? 1 : -1;
	var dist = Math.sqrt((vDist * vDist) + (hDist * hDist));
	var theta = Math.acos(hDist/dist);
	var dx = Math.abs(Math.cos(theta) * displace) * xSign;
	var dy = Math.abs(Math.sin(theta) * displace) * ySign;
	return [dx, dy];
}

function readAndParsePath(pathID)
{
	/*
	I wanted to store a large number of coordinate points representing the paths the
	drivers take without hard coding all that data into the JavaScript. My initial
	idea was to store them in a text document, but support 
	for the FileReader JavaScript API is almost non-existent (w3schools
	doesn't even list it). So I decided that it would be best to simply paste the 
	points into invisible paragraphs in the html and read them from there.
	*/
	var path_x = [];
	var path_y = [];
	coords = document.getElementById(pathID).innerHTML;
	var re = /[\s]+/;
	var path_xy = coords.split(re);
	var j = 0;
	for(i = 0; i < path_xy.length; i++)
	{
		if(path_xy[i] == "")
			continue;
		var xyCoord = path_xy[i].split(",");
		path_x[j] = Number(xyCoord[0]);
		path_y[j++] = Number(xyCoord[1]);
	}
	return [path_x, path_y];
}

function shuffle(array) //Courtesy stackoverflow user CoolAJ86
{
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

	// Pick a remaining element...
	randomIndex = Math.floor(Math.random() * currentIndex);
	currentIndex -= 1;

	// And swap it with the current element.
	temporaryValue = array[currentIndex];
	array[currentIndex] = array[randomIndex];
	array[randomIndex] = temporaryValue;
  }

  return array;
}

function toRadians(n)
{
	n *= (Math.PI / 180)
	return n;
}

/*
If I had known from the beginning how many times I would have to reference 'this',
I might not have chosen an OOP paradigm...
*/	
function Driver(name, id, realName)
{
	var path = [];
	for(var i = 0; i < readAndParsePath("path1")[0].length + 1; i++)
	{
		var random = Math.floor(Math.random() * 3) + 1;
		var pathArray = readAndParsePath("path" + random);
		if(i >= pathArray[0].length)
		{
			break;
		}
		x = pathArray[0][i];
		y = pathArray[1][i];
		path[i] = new Point(x, y);
	}
	var pathArray = readAndParsePath("path" + random);
	for(var i = 14; i < 19; i++)
	{
		x = pathArray[0][i];
		y = pathArray[1][i];
		path[i] = new Point(x, y);
	}
	this.name = name;
	this.realName = realName;
	this.path = path;
	var x;
	var y;
	if(id == 0 || id == 1)
		x = 100;
	else if(id == 2 || id == 3)
		x = 140;
	else
		x = 120;
	if(id == 0 || id == 2)
		y = 0;
	else if(id == 1 || id == 3)
		y = 40;
	else 
		y = 20;
	this.curLoc = new Point(x, y);
	this.destLoc = path[1];
	this.destinationIndex = 1;
	this.sprites = this.getSprites();
	this.spriteIndex = 7;
	this.sprite = this.sprites[this.spriteIndex];
	this.curTurn = -1;
	this.turnTimer = -1;
	this.isTurning = false;
	this.regSpeed = 3;
	this.speed = this.regSpeed;
	this.speedBoost = false;
	this.delta = this.calculateDelta();
	this.dying = false;
	this.deathSentence = false;
	this.spiralAngle = 0;
	this.shrink = 0;
	this.progress = 0;
}
		
Driver.prototype.calculateDelta = function()
{
	if(this.speedBoost)
	{
		this.speed = this.regSpeed;
		this.speedBoost = false;
	}

	if(!this.speedBoost && Math.random() < .5) //25% chance
	{
		this.speedBoost = true;
		
		this.speed *= 1 + (Math.random() * .35 + .1);
	}
	return partition(this.curLoc.x, this.curLoc.y, this.destLoc.x, this.destLoc.y, this.speed);
}

Driver.prototype.snapToPoint = function()
{
	if(this.dying)
		return;
	this.curLoc = this.destLoc;
	if(this.destinationIndex + 1 >= this.path.length)
	{
		thisDriver = this;
		setTimeout(function(){finishRace(thisDriver)}, 500);
		clearInterval(intervalID);
		return;
	}
	this.destLoc = this.path[++this.destinationIndex];
	var turnPointIndex = turnPoints.indexOf(this.destinationIndex + 1);
	if(turnPointIndex >= 0 && !this.isTurning)
	{
		this.curTurn = turns[turnPointIndex];
		this.turn();
	}
	
	if(!killing && this.destinationIndex == FINAL_STRETCH)
	{
		killing = true;
		this.deathSentence = true;
		this.speed = 4.5;
		this.regSpeed = 4.5;
		gopherLoc = new Point(this.destLoc.x, this.destLoc.y);
		shouldWave = true;
	}
	else if(this.deathSentence && killing && !doneKilling && this.destinationIndex == FINAL_STRETCH + 1)
	{
		doneKilling = true;
		this.dying = true;
		for(i = this.id; i < rank.length - 1; i++)
		{
			var temp = rank[i];
			rank[i+1] = rank[i];
			rank[i] = temp;
		}
	}
	
	this.delta = this.calculateDelta();
}

Driver.prototype.turn = function()
{
	if(this.dying || raceOver)
		return;
	this.isTurning = true;
	//The anonymous function thinks 'this' is a reference to 'window' so...
	var thisDriver = this;
	var turnSpeed = 80;
	if(this.curTurn == LEFT)
	{
		this.turnTimer = window.setInterval(function() {thisDriver.turnLeft()}, turnSpeed);
	}
	else if (this.curTurn == RIGHT) 
	{
		this.turnTimer = window.setInterval(function() {thisDriver.turnRight()}, turnSpeed); 
	}
}

Driver.prototype.turnRight = function()
{
	this.spriteIndex = (this.spriteIndex + 1);
	if(this.spriteIndex > 23)
		this.spriteIndex = 0;
	if(this.spriteIndex == 11 || this.spriteIndex == 6 || this.spriteIndex == 17 || this.spriteIndex == 23)
	{
		this.curTurn = -1;
		this.isTurning = false;
		clearInterval(this.turnTimer);
	}
}

Driver.prototype.spinRight = function()
{
	this.curLoc.x += 3;
	this.curLoc.y -= 3;
	this.shrink++;
	this.spriteIndex = (this.spriteIndex + 1);
	if(this.spriteIndex > 23)
		this.spriteIndex = 0;
}

Driver.prototype.turnLeft = function()
{
	this.spriteIndex = (this.spriteIndex - 1);
	if(this.spriteIndex < 0)
		this.spriteIndex = 23;
	if(this.spriteIndex == 11 || this.spriteIndex == 6 || this.spriteIndex == 17 || this.spriteIndex == 23)
	{
		this.curTurn = -1;
		this.isTurning = false;
		clearInterval(this.turnTimer);
	}
}


Driver.prototype.getSprites = function()
{
	var sprites = [];
	for(var i = 0; i < 24; i++)
	{
		var filepath = "Resources/Sprites/" + this.name + "/" + i + ".png";
		sprites[i] = new Image();
		sprites[i].src = filepath;
	}
	return sprites;
}

function Point(x, y)
{
	this.x = x;
	this.y = y;
}

function distance(a, b)
{
	var xDist = a.x - b.x;
	var yDist = a.y - b.y;
	return Math.sqrt((xDist * xDist) + (yDist * yDist));
}

Point.prototype.toString = function()
{
	return "(" + this.x + "," + this.y + ")";
}	