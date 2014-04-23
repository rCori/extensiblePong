/* An adaptation of the extensible pong mechanics idea but with
 * Pac-Man. The idea heere is to be able to manipulate and
 * visualize ideas the behavior of the ghost's AI.
 */


//Much of the code here inspirded from a tutorial by Daniel X. Moore
//http://www.html5rocks.com/en/tutorials/canvas/notearsgame/
var CANVAS_WIDTH = 448;
var CANVAS_HEIGHT = 576;

//This code puts the canvas we want in the browser

var canvasElement = jQuery("<canvas width='" + CANVAS_WIDTH +
                      "'height='" + CANVAS_HEIGHT + "'style='border:1px solid #000000'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");
var myCanv = canvasElement.get(0);
canvasElement.appendTo('body');

var FPS = 30;


var DEBUG = false;
//Lets call this a debug map
/*Original pacman has a tileset of 28x36 so thats what we
 *will be going for here. Of course we will need to draw over
 *some of this as well.
 *If the game is 448x576 each tile is (448/28)x(576x36) or 16x16.
 * Eventually each tile will be a 16x16 pixel image
 */
//myMapData = [['=','I','I'],['=','o','='],['o','O','o'],['I','6','I']];
/* Now we are going to try a real Pacman map tile set
 * minus icons and ghost pen door
 * this is according to the pacman dossier
 */
var myMapData = /* 1 */[['M','M','M','7','4','4','4','4','4','4','4','4','1','M','M','M','8','e','2','M','M','M','7','4','4','4','4','1','7','4','4','4','4','1','M','M'],
				/* 2 */ ['M','M','M','8','o','o','O','o','o','o','o','o','2','M','M','M','8','e','2','M','M','M','8','o','o','o','O','=','=','o','o','o','o','2','M','M'],
				/* 3 */ ['M','M','M','8','o','7','I','1','o','7','1','o','2','M','M','M','8','e','2','M','M','M','8','o','7','1','o','9','3','o','7','1','o','2','M','M'],
				/* 4 */ ['M','M','M','8','o','=','M','=','o','=','=','o','2','M','M','M','8','e','2','M','M','M','8','o','=','=','o','o','o','o','=','=','o','2','M','M'],
				/* 5 */ ['M','M','M','8','o','=','M','=','o','=','=','o','2','M','M','M','8','e','2','M','M','M','8','o','=','9','I','I','1','o','=','=','o','2','M','M'],
				/* 6 */ ['M','M','M','8','o','9','6','3','o','9','3','o','9','6','6','6','3','e','9','6','6','6','3','o','9','I','I','I','3','o','=','=','o','2','M','M'],
				/* 7 */ ['M','M','M','8','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','=','=','o','2','M','M'],
				/* 8 */ ['M','M','M','8','o','7','I','1','o','7','I','I','I','I','I','I','1','e','7','I','I','I','1','o','7','1','o','7','I','I','3','=','o','2','M','M'],
				/* 9 */ ['M','M','M','8','o','=','M','=','o','9','I','I','1','7','I','I','3','e','9','I','I','I','3','o','=','=','o','9','I','I','1','=','o','2','M','M'],
				/*10 */ ['M','M','M','8','o','=','M','=','o','o','o','o','=','=','e','e','e','e','e','e','e','e','e','o','=','=','o','o','o','o','=','=','o','2','M','M'],
				/*11 */ ['M','M','M','8','o','=','M','=','o','7','1','o','=','=','e','7','6','6','6','1','e','7','1','o','=','=','o','7','1','o','=','=','o','2','M','M'],
				/*12 */ ['M','M','M','8','o','9','I','3','o','=','=','o','9','3','e','2','M','M','M','8','e','=','=','o','9','3','o','=','=','o','9','3','o','2','M','M'],
				/*13 */ ['M','M','M','8','o','o','o','o','o','=','=','o','e','e','e','2','M','M','M','8','e','=','=','o','o','o','o','=','=','o','o','o','o','2','M','M'],
				/*14 */ ['M','M','M','9','I','I','I','1','o','=','9','I','I','1','e','=','M','M','M','8','e','=','9','I','I','1','e','=','9','I','I','1','o','2','M','M'],
				/*15 */ ['M','M','M','7','I','I','I','3','o','=','7','I','I','3','e','=','M','M','M','8','e','=','7','I','I','3','e','=','7','I','I','3','o','2','M','M'],
				/*16 */ ['M','M','M','8','o','o','o','o','o','=','=','o','e','e','e','2','M','M','M','8','e','=','=','o','o','o','o','=','=','o','o','o','o','2','M','M'],
				/*17 */ ['M','M','M','8','o','7','I','1','o','=','=','o','7','1','e','2','M','M','M','8','e','=','=','o','7','1','o','=','=','o','7','1','o','2','M','M'],
				/*18 */ ['M','M','M','8','o','=','M','=','o','9','3','o','=','=','e','9','4','4','4','3','e','9','3','o','=','=','o','9','3','o','=','=','o','2','M','M'],
				/*19 */ ['M','M','M','8','o','=','M','=','o','o','o','o','=','=','e','e','e','e','e','e','e','e','e','o','=','=','o','o','o','o','=','=','o','2','M','M'],
				/*20 */ ['M','M','M','8','o','=','M','=','o','7','I','I','3','9','I','I','1','e','7','I','I','I','1','o','=','=','o','7','I','I','3','=','o','2','M','M'],
				/*21 */ ['M','M','M','8','o','9','I','3','o','9','I','I','I','I','I','I','3','e','9','I','I','I','3','o','9','3','o','9','I','I','1','=','o','2','M','M'],
				/*22 */ ['M','M','M','8','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','=','=','o','2','M','M'],
				/*23 */ ['M','M','M','8','o','7','4','1','o','7','1','o','7','4','4','4','1','e','7','4','4','4','1','o','7','I','I','I','1','o','=','=','o','2','M','M'],
				/*24 */ ['M','M','M','8','o','=','M','=','o','=','=','o','2','M','M','M','8','e','2','M','M','M','8','o','=','7','I','I','3','o','=','=','o','2','M','M'],
				/*25 */ ['M','M','M','8','o','=','M','=','o','=','=','o','2','M','M','M','8','e','2','M','M','M','8','o','=','=','o','o','o','o','=','=','o','2','M','M'],
				/*26 */ ['M','M','M','8','o','9','I','3','o','9','3','o','2','M','M','M','8','e','2','M','M','M','8','o','9','3','o','7','1','o','9','3','o','2','M','M'],
				/*27 */ ['M','M','M','8','o','o','O','o','o','o','o','o','2','M','M','M','8','e','2','M','M','M','8','o','o','o','O','=','=','o','o','o','o','2','M','M'],
				/*28 */ ['M','M','M','9','6','6','6','6','6','6','6','6','3','M','M','M','8','e','2','M','M','M','9','6','6','6','6','3','9','6','6','6','6','3','M','M']]
var myTileset = tileset(myMapData,CANVAS_WIDTH, CANVAS_HEIGHT,'spritesheet.png',canvas);
setInterval(function(){
	draw();
	update();
}, 1000/FPS);

//Function for update game logic and drawing
function update(){
	//update here
	pacman.update();
	blinky.update();
	blinky.decide();
	debug(DEBUG);
};

function draw(){
	myTileset.renderMap(canvas);
	pacman.draw();
	blinky.draw();
}

function player(){
	var I = {};
	//All the starting info
	I.xLoc = 224;
	I.yLoc = 420;
	I.width = 16;
	I.height = 16;
	var startTiles = myTileset.findTile(I.xLoc,I.yLoc);
	I.xTile = startTiles.xTile;
	I.yTile = startTiles.yTile;
	/* Movement gets 5 different values
	 * 0 means it is still
	 * 1 means go left
	 * 2 means go right
	 * 3 means go up
	 * 4 means go down
	 */
	I.movement = 0;

	I.velocity = 3;
	
	//We want an image for pacman
	I.sprite = sprite("pacman.png",canvas,16,16);

	//How much to rotate
	I.rotate = 0;

	//PacMan has to move
	I.update = function(){
		//Update what tile pacman is on
		var newTile = myTileset.findTile(I.xLoc,I.yLoc);
		I.xTile = newTile.xTile;
		I.yTile = newTile.yTile;
		//Check if we are eating a dot
		if(myTileset.map[I.xTile][I.yTile] === 'o'){
			myTileset.map[I.xTile][I.yTile] = 'e';
		}
		//Check if we are getting an energizer pellet
		if(myTileset.map[I.xTile][I.yTile] === 'O'){
			myTileset.map[I.xTile][I.yTile] = 'e';
		}
		//Need to check the status of tiles above or below the current
		//LEFT
		if(I.movement == 1){
			if(myTileset.checkLeft(I.xTile,I.yTile)){
				I.xLoc -= I.velocity;
				I.yLoc = I.yTile * myTileset.tileHeight+(myTileset.tileHeight/2);
				I.rotate = 180;
			}
		}
		else if(I.movement == 2){
			//RIGHT
			if(myTileset.checkRight(I.xTile,I.yTile)){
				I.xLoc += I.velocity;
				I.yLoc = I.yTile * myTileset.tileHeight+(myTileset.tileHeight/2);
				I.rotate = 0;
			}
		}
		else if(I.movement == 3){
			//UP
			if(myTileset.checkUp(I.xTile,I.yTile)){
				I.yLoc -= I.velocity;
				I.xLoc = I.xTile * myTileset.tileWidth+(myTileset.tileWidth/2);
				I.rotate = 270;
			}
		}
		else if(I.movement == 4){
			//DOWN
			if(myTileset.checkDown(I.xTile,I.yTile)){
				I.yLoc += I.velocity;
				I.xLoc = (I.xTile * myTileset.tileWidth)+(myTileset.tileWidth/2);
				I.rotate = 90;
			}
		}
	};

	I.draw = function(){
		//canvas.fillStyle = "#FFFF00";
	 	//canvas.fillRect(I.xLoc - (I.width/2), I.yLoc - (I.height/2), I.width, I.height);
	 	I.sprite.draw(I.xLoc - (I.width/2), I.yLoc - (I.height/2),I.rotate);
	};
	
	
	return I;
}

var pacman = player();

/* Time to make some spooky ghosts
 * 2SPOOKY
 * This will look a lot like the human player exept controls
 * ghosts have no input
 * or bones, those would be skelingtons. Also very scary
 */

function ghost(x,y,color){
	var I = {};
	//Eventually "color" will be "sprite" and hopefully then "animation"
	I.x = x;
	I.y = y;

	//Height and width of the character
	I.height = 16;
	I.width =16;

	var startTiles = myTileset.findTile(I.x,I.y);
	I.xTile = startTiles.xTile;
	I.yTile = startTiles.yTile;

	//Similar to pacman's direction, but not player controlled
	I.movement = 0;

	//The speed the ghosts move
	I.velocity = 2;

	//PacMan has to move
	I.update = function(){
		//Update what tile the ghost is on
		var newTile = myTileset.findTile(I.x,I.y);
		I.xTile = newTile.xTile;
		I.yTile = newTile.yTile;

		//Need to check the status of tiles above or below the current
		//LEFT
		if(I.movement == 1){
			if(myTileset.checkLeft(I.xTile,I.yTile)){
				I.x -= I.velocity;
				I.y = I.yTile * myTileset.tileHeight+(myTileset.tileHeight/2);
			}
		}
		else if(I.movement == 2){
			//RIGHT
			if(myTileset.checkRight(I.xTile,I.yTile)){
				I.x += I.velocity;
				I.y = I.yTile * myTileset.tileHeight+(myTileset.tileHeight/2);
			}
		}
		else if(I.movement == 3){
			//UP
			if(myTileset.checkUp(I.xTile,I.yTile)){
				I.y -= I.velocity;
				I.x = I.xTile * myTileset.tileWidth+(myTileset.tileWidth/2);
			}
		}
		else if(I.movement == 4){
			//DOWN
			if(myTileset.checkDown(I.xTile,I.yTile)){
				I.y += I.velocity;
				I.x = (I.xTile * myTileset.tileWidth)+(myTileset.tileWidth/2);
			}
		}
	};

	//This controls the movement of the ghost's AI, very simple right now
	I.decide = function(){
		//potentially new movement vector
		var move = Math.floor((Math.random()*4)+1);

		//If you got Left and you aren't alreay going right
		if((move == 1) && (I.movement != 2)){
			if(myTileset.checkRight(I.xTile,I.yTile)){
				I.movement = 2;
			}
		}
		//If you got right and aren't already going left
		else if((move == 2) && (I.movement != 1)){
			if(myTileset.checkLeft(I.xTile,I.yTile)){
				I.movement = 2;
			}
		}
		//If you got up and arent aready going down
		else if((move == 3) && (I.movement != 4)){
			if(myTileset.checkUp(I.xTile,I.yTile)){
				I.movement = 3;
			}
		}
		//If you got down and aren't already going up
		else if((move == 4) && (I.movement != 3)){
			if(myTileset.checkUp(I.xTile,I.yTile)){
				I.movement = 4;
			}
		}

	};

	I.draw = function(){
		canvas.fillStyle = color;
	 	canvas.fillRect(I.x - (I.width/2), I.y - (I.height/2), I.width, I.height);
	};

	return I;
}

var blinky = ghost(4*16,5*16,"#FF0000");

function debug(ISDEBUG){
	if(ISDEBUG){
		canvas.fillStyle = "#FFF";
		canvas.fillText("pacman movement = "+pacman.movement,0,10);
		canvas.fillText("pacman pos: x = "+ pacman.xLoc + " y = " + pacman.yLoc,0,20);
		canvas.fillText("blinky movement = "+blinky.movement,0,30);
		canvas.fillText("blinky pos: x = "+ blinky.x + " y = " + blinky.y,0,40);

	}
}

//I need this to handle input
window.addEventListener('keydown', function (e) {
	switch(e.keyCode){
		//If left is pressed
		case 37:
			if(myTileset.checkLeft(pacman.xTile,pacman.yTile)){
				pacman.movement = 1;
			}
		break;
		//If right is pressed
		case 39:
			if(myTileset.checkRight(pacman.xTile,pacman.yTile)){
				pacman.movement = 2;
			}
		break;
		//If up is pressed
		case 38:
			if(myTileset.checkUp(pacman.xTile,pacman.yTile)){
				pacman.movement = 3;	
			}
		break;
		//If down is pressed
		case 40:
			if(myTileset.checkDown(pacman.xTile,pacman.yTile)){
				pacman.movement = 4;
			}
		break;
	}
}, false);