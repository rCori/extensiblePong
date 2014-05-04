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


var DEBUG = true;
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
	blinky.findTarget();
	pinky.update();
	pinky.findTarget();
	inky.update();
	clyde.update();
	debug(DEBUG);
};

function draw(){
	myTileset.renderMap(canvas);
	pacman.draw();
	blinky.draw();
	pinky.draw();
	inky.draw();
	clyde.draw();
	blinky.visualize("#FF0000");
	pinky.visualize("#FF66CC")
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

	//What options are available
	I.left = false;
	I.right = false;
	I.up = false;
	I.down = false;

	//Get the desired next direction
	I.nextDirection = 0;

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

		//update the movement options
		I.left = myTileset.checkLeft(I.xTile,I.yTile);
		I.right = myTileset.checkRight(I.xTile,I.yTile);
		I.up = myTileset.checkUp(I.xTile,I.yTile);
		I.down = myTileset.checkDown(I.xTile,I.yTile);


		if(I.nextDirection != I.movement){
			if(I.nextDirection == 1 && I.left){
				I.movement = I.nextDirection;
			}
			else if(I.nextDirection == 2 && I.right){
				I.movement = I.nextDirection;
			}
			else if(I.nextDirection == 3 && I.up){
				I.movement = I.nextDirection;
			}
			else if(I.nextDirection == 4 && I.down){
				I.movement = I.nextDirection;
			}
		}
		//Need to check the status of tiles above or below the current
		//LEFT
		if(I.movement == 1){
			if(I.left){
				I.xLoc -= I.velocity;
				I.yLoc = I.yTile * myTileset.tileHeight+(myTileset.tileHeight/2);
				I.rotate = 180;
			}
		}
		else if(I.movement == 2){
			//RIGHT
			if(I.right){
				I.xLoc += I.velocity;
				I.yLoc = I.yTile * myTileset.tileHeight+(myTileset.tileHeight/2);
				I.rotate = 0;
			}
		}
		else if(I.movement == 3){
			//UP
			if(I.up){
				I.yLoc -= I.velocity;
				I.xLoc = I.xTile * myTileset.tileWidth+(myTileset.tileWidth/2);
				I.rotate = 270;
			}
		}
		else if(I.movement == 4){
			//DOWN
			if(I.down){
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

function ghost(x,y,ghostSprite,lookahead,target){
	var I = {};
	//Eventually "color" will be "sprite" and hopefully then "animation"
	I.x = x;
	I.y = y;

	//Height and width of the character
	I.height = 16;
	I.width =16;

	var startTiles = myTileset.findTile();
	I.xTile = startTiles.xTile;
	I.yTile = startTiles.yTile;

	//Similar to pacman's direction, but not player controlled
	I.movement = 0;

	//Wiith the lookahead implementation it's useful to save a "next" direction
	I.nextDirection = 0;

	//The speed the ghosts move
	I.velocity = 2;

	//Assign a sprite
	I.sprite = sprite(ghostSprite,canvas,16,16);

	I.up = 9999;
	I.down = 9999;
	I.left = 9999;
	I.right = 9999;

	lookahead = lookahead || false;

	I.target = target || {x:0,y:0};
	//PacMan has to move
	I.update = function(){
		//Update what tile the ghost is on
		var newTile = myTileset.findTile(I.x,I.y);

		//Check if this tile is actually new
		if (I.xTile !=newTile.xTile || I.yTile != newTile.yTile){
			I.xTile = newTile.xTile;
			I.yTile = newTile.yTile;
			if(lookahead){
				I.singleLookaheadSearch(I.target);
			}
			else{
				I.decide();
			}
		}
		else{
			I.xTile = newTile.xTile;
			I.yTile = newTile.yTile;
		}

		//Need to check the status of tiles above or below the current
		//LEFT
		if(I.movement == 1 && myTileset.checkLeft(I.xTile,I.yTile)){
			//if(myTileset.checkLeft(I.xTile,I.yTile)){
				I.x -= I.velocity;
				I.y = I.yTile * myTileset.tileHeight+(myTileset.tileHeight/2);
			//}
		}
		else if(I.movement == 2 && myTileset.checkRight(I.xTile,I.yTile)){
			//RIGHT
			//if(myTileset.checkRight(I.xTile,I.yTile)){
				I.x += I.velocity;
				I.y = I.yTile * myTileset.tileHeight+(myTileset.tileHeight/2);
			//}
		}
		else if(I.movement == 3 && myTileset.checkUp(I.xTile,I.yTile)){
			//UP
			//if(myTileset.checkUp(I.xTile,I.yTile)){
				I.y -= I.velocity;
				I.x = I.xTile * myTileset.tileWidth+(myTileset.tileWidth/2);
			//}
		}
		else if(I.movement == 4 && myTileset.checkDown(I.xTile,I.yTile)){
			//DOWN
			//if(myTileset.checkDown(I.xTile,I.yTile)){
				I.y += I.velocity;
				I.x = (I.xTile * myTileset.tileWidth)+(myTileset.tileWidth/2);
			//}
		}
		//You are stuck and need to make a new decision
		else{
			if(lookahead){
				I.singleLookaheadSearch({x:pacman.xTile,y:pacman.yTile});
			}
			else{
				I.decide();
			}
		}
	};

	//This controls the movement of the ghost's AI, very simple right now
	I.decide = function(){
		//potentially new movement vector
		if(I.movement === 0){
			I.movement = Math.floor((Math.random()*4)+1);
		}
		if(!myTileset.checkRight(I.xTile,I.yTile) && I.movement == 2){
			I.movement = Math.floor((Math.random()*2)+3); 
		}
		if(!myTileset.checkLeft(I.xTile,I.yTile) && I.movement == 1){
			I.movement = Math.floor((Math.random()*2)+3); 
		}
		if(!myTileset.checkUp(I.xTile,I.yTile) && I.movement == 3){
			I.movement = Math.floor((Math.random()*2)+1); 
		}
		if(!myTileset.checkDown(I.xTile,I.yTile) && I.movement == 4){
			I.movement = Math.floor((Math.random()*2)+1); 
		}

	};


	//Allows the ghost to look ahead one tile to see where it should go next
	//This is how pathfinding worked in old PacMan, not A* or Dijkstra
	I.singleLookaheadSearch = function(target){
		//assign these huge distances
		I.up = 9999;
		I.down = 9999;
		I.left = 9999;
		I.right = 9999;

		if(I.movement == I.nextDirection){
			//If you are going left and you can continue going left
			if((I.movement == 1) && (myTileset.checkLeft(I.xTile,I.yTile))){
				if(myTileset.checkLeft(I.xTile-1,I.yTile)){
					I.left = Math.sqrt(((I.xTile-2-target.x)*(I.xTile-2-target.x))+((I.yTile-target.y)*(I.yTile-target.y)));
				}
				if(myTileset.checkUp(I.xTile-1,I.yTile)){
					I.up = Math.sqrt(((I.xTile-1-target.x)*(I.xTile-1-target.x))+((I.yTile-1-target.y)*(I.yTile-1-target.y)));
				}
				if(myTileset.checkDown(I.xTile-1,I.yTile)){
					I.down = Math.sqrt(((I.xTile-1-target.x)*(I.xTile-1-target.x))+((I.yTile+1-target.y)*(I.yTile+1-target.y)));
				}
			}
			//You are going right and you can continue going right
			else if((I.movement == 2) && (myTileset.checkRight(I.xTile,I.yTile))){
				if(myTileset.checkRight(I.xTile+1,I.yTile)){
					I.right = Math.sqrt(((I.xTile+2-target.x)*(I.xTile+2-target.x))+((I.yTile-target.y)*(I.yTile-target.y)));
				}
				if(myTileset.checkUp(I.xTile+1,I.yTile)){
					I.up = Math.sqrt(((I.xTile+1-target.x)*(I.xTile+1-target.x))+((I.yTile-1-target.y)*(I.yTile-1-target.y)));
				}
				if(myTileset.checkDown(I.xTile+1,I.yTile)){
					I.down = Math.sqrt(((I.xTile+1-target.x)*(I.xTile+1-target.x))+((I.yTile+1-target.y)*(I.yTile+1-target.y)));
				}
			}
			//You are going up and you can continue going up
			else if((I.movement == 3) && (myTileset.checkUp(I.xTile,I.yTile))){
				if(myTileset.checkUp(I.xTile,I.yTile-1)){
					I.up = Math.sqrt(((I.xTile-target.x)*(I.xTile-target.x))+((I.yTile-2-target.y)*(I.yTile-2-target.y)));
				}
				if(myTileset.checkRight(I.xTile,I.yTile-1)){
					I.right = Math.sqrt(((I.xTile+1-target.x)*(I.xTile+1-target.x))+((I.yTile-1-target.y)*(I.yTile-1-target.y)));
				}
				if(myTileset.checkLeft(I.xTile,I.yTile-1)){
					I.left = Math.sqrt(((I.xTile-1-target.x)*(I.xTile-1-target.x))+((I.yTile-1-target.y)*(I.yTile-1-target.y)));
				}
			}
			//You are going down and you can continue to go down
			else if((I.movement == 4) && (myTileset.checkDown(I.xTile,I.yTile))){
				if(myTileset.checkDown(I.xTile,I.yTile+1)){
					I.down = Math.sqrt(((I.xTile-target.x)*(I.xTile-target.x))+((I.yTile+2-target.y)*(I.yTile+2-target.y)));
				}
				if(myTileset.checkRight(I.xTile,I.yTile+1)){
					I.right = Math.sqrt(((I.xTile+1-target.x)*(I.xTile+1-target.x))+((I.yTile+1-target.y)*(I.yTile+1-target.y)));
				}
				if(myTileset.checkLeft(I.xTile,I.yTile+1)){
					I.left = Math.sqrt(((I.xTile-1-target.x)*(I.xTile-1-target.x))+((I.yTile+1-target.y)*(I.yTile+1-target.y)));
				}
			}
			//You are going nowhere or have hit a dead end.
			else{
				if(myTileset.checkDown(I.xTile,I.yTile) && I.movement != 3){
					I.down = Math.sqrt(((I.xTile-target.x)*(I.xTile-target.x))+((I.yTile+1-target.y)*(I.yTile+1-target.y)));
				}
				if(myTileset.checkRight(I.xTile,I.yTile) && I.movement !=1){
					I.right = Math.sqrt(((I.xTile+1-target.x)*(I.xTile+1-target.x))+((I.yTile-target.y)*(I.yTile-target.y)));
				}
				if(myTileset.checkLeft(I.xTile,I.yTile) && I.movement != 2){
					I.left = Math.sqrt(((I.xTile-1-target.x)*(I.xTile-1-target.x))+((I.yTile-target.y)*(I.yTile-target.y)));
				}
				if(myTileset.checkUp(I.xTile,I.yTile) && I.movement != 4){
					I.up = Math.sqrt(((I.xTile-target.x)*(I.xTile-target.x))+((I.yTile-1-target.y)*(I.yTile-1-target.y)));
				}
			}
			//So now we have all the distances, find the shortest one
			var tempDist = Math.min(I.up,I.down,I.left,I.right);
			//Make sure we actually found a smallest distance
			if(tempDist != 9999){
				//Now assign the shortest direction to the next direction
				//Next time pacman changes diretion it will be to nextDirection
				switch(tempDist){
					case I.up:
						I.nextDirection = 3;
						break;
					case I.down:
						I.nextDirection = 4;
						break;
					case I.left:
						I.nextDirection = 1;
						break;
					case I.right:
						I.nextDirection = 2;
						break;
				}
			}
			/*Switch to nextDirection at the right time
			 *If the direction we are going in is not nextDirection
			 *We want to go in nextDirection as soon as possible
			 */
		}
		else{
			//If your next direction is up and you have the chance to switch do so
			if(myTileset.checkUp(I.xTile,I.yTile) && I.nextDirection != 3){
				I.movement = I.nextDirection;
			}
			//If your next direction is down and you have the chance to switch do so
			if(myTileset.checkDown(I.xTile,I.yTile) && I.nextDirection != 4){
				I.movement = I.nextDirection;
			}
			//If your next direction is right and you have the chance to switch do so
			if(myTileset.checkRight(I.xTile,I.yTile) && I.nextDirection != 2){
				I.movement = I.nextDirection;
			}
			//If your next direction is left and you have the chance to switch do so
			if(myTileset.checkLeft(I.xTile,I.yTile) && I.nextDirection != 1){
				I.movement = I.nextDirection;
			}

		}


	}


	I.draw = function(){
		/*
		canvas.fillStyle = color;
	 	canvas.fillRect(I.x - (I.width/2), I.y - (I.height/2), I.width, I.height);
	 	*/
	 	I.sprite.draw(I.x - (I.width/2), I.y - (I.height/2));
	};

	/* Drawing lines to get a visual representaion of
	 * the distance computation done by the AI
	*/
	I.visualize = function(color){

		canvas.strokeStyle = color;
		canvas.fillStyle = color;
		var extraRightCost = 0;
		var extraDownCost = 0;

		if(I.movement == 1) {extraRightCost = -1;}
		if(I.movement == 2) {extraRightCost = 1;}
		if(I.movement == 3) {extraDownCost = -1;}
		if(I.movement == 4) {extraDownCost = 1;}

		//If we calculated a right path
		if(I.right != 9999){
			canvas.beginPath();
			canvas.moveTo((I.xTile+extraRightCost+1)*16+8,(I.yTile+extraDownCost)*16+8);
			canvas.lineTo(I.target.x*16+8, I.target.y*16+8);
			canvas.stroke();
			canvas.fillRect((I.xTile+extraRightCost+1)*16,(I.yTile+extraDownCost)*16,16,16);

		}
		//If we calculated a left path
		if(I.left != 9999){
			canvas.beginPath();
			canvas.moveTo((I.xTile+extraRightCost-1)*16+8,(I.yTile+extraDownCost)*16+8);
			canvas.lineTo(I.target.x*16+8, I.target.y*16+8);
			canvas.stroke();
			canvas.fillRect((I.xTile+extraRightCost-1)*16,(I.yTile+extraDownCost)*16,16,16);

		}
		//If we calculated an up path
		if(I.up != 9999){
			canvas.beginPath();
			canvas.moveTo((I.xTile+extraRightCost)*16+8,(I.yTile+extraDownCost-1)*16+8);
			canvas.lineTo(I.target.x*16+8, I.target.y*16+8);
			canvas.stroke();
			canvas.fillRect((I.xTile+extraRightCost)*16,(I.yTile+extraDownCost-1)*16,16,16);

		}
		//If we calculated a down path
		if(I.down != 9999){
			canvas.beginPath();
			canvas.moveTo((I.xTile+extraRightCost)*16+8,(I.yTile+extraDownCost+1)*16+8);
			canvas.lineTo(I.target.x*16+8, I.target.y*16+8);
			canvas.stroke();
			canvas.fillRect((I.xTile+extraRightCost)*16,(I.yTile+extraDownCost+1)*16,16,16);

		}

	}

	return I;
}

var blinky = ghost(7*16,5*16,"blinky.png", true);
var pinky = ghost(20*16,5*16,"pinky.png", true);
var inky = ghost(7*16,32*16,"inky.png");
var clyde = ghost(20*16,32*16,"clyde.png");

blinky.findTarget = function(){
	blinky.target = {x:pacman.xTile,y:pacman.yTile};
}

//Pinky chases 4 ahead of PacMan
//There is a noted bug which I am including here
pinky.findTarget = function(){

	if(pacman.movement == 1){
		pinky.target = {x:pacman.xTile-4,y:pacman.yTile};
	}
	else if(pacman.movement == 2){
		pinky.target = {x:pacman.xTile+4,y:pacman.yTile};
	}
	//Here I am implementing the bug
	else if(pacman.movement == 3){
		pinky.target = {x:pacman.xTile-4, y:pacman.yTile-4};
	}
	else if(pacman.movement == 4){
		pinky.target = {x:pacman.xTile, y:pacman.yTile + 4};
	}
}

function debug(ISDEBUG){
	if(ISDEBUG){
		canvas.fillStyle = "#FFF";
		canvas.fillText("pacman movement = "+pacman.movement,0,10);
		canvas.fillText("pacman nextDirection = "+pacman.nextDirection,0,20);
		canvas.fillText("pacman pos: x = "+ pacman.xLoc + " y = " + pacman.yLoc,0,30);
		canvas.fillText("pacman left = "+pacman.left,0,40);
		canvas.fillText("pacman right = "+pacman.right,0,50);
		canvas.fillText("pacman up = "+pacman.up,0,60);
		canvas.fillText("pacman down = "+pacman.down,0,70);
		canvas.fillText("blinky movement = "+blinky.movement,200,10);
		canvas.fillText("blinky nextDirection = "+blinky.nextDirection,200,20);
		canvas.fillText("blinky pos: x = "+ blinky.x + " y = " + blinky.y,200,30);
		canvas.fillText("blinky up = "+blinky.up,200,40);
		canvas.fillText("blinky down = "+blinky.down,200,50);
		canvas.fillText("blinky left = "+blinky.left,200,60);
		canvas.fillText("blinky right = "+blinky.right,200,70);
	}
}


//I need this to handle input
window.addEventListener('keydown', function (e) {
	switch(e.keyCode){
		//If left is pressed
		case 37:
			pacman.nextDirection = 1;

		break;
		//If right is pressed
		case 39:
			pacman.nextDirection = 2;
		break;
		//If up is pressed
		case 38:
			pacman.nextDirection = 3;
		break;
		//If down is pressed
		case 40:
			pacman.nextDirection = 4;
		break;
	}
}, false);
