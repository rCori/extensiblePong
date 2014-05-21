//pacGhost.js
/* Time to make some spooky ghosts
 * 2SPOOKY
 * This will look a lot like the human player exept controls
 * ghosts have no input
 * or bones, those would be skelingtons. Also very scary
 */

//load the spritesheet for the scared sprites

var CLYDECIRCLE = 8;


function ghost(x,y,ghostSprite,lookahead,target){
	var I = {};
	//Eventually "color" will be "sprite" and hopefully then "animation"
	I.x = x;
	I.y = y;

	var scared = spritesheet("scatter.png",canvas,16,16,32,16);

	//Height and width of the character
	I.height = 16;
	I.width =16;

	var startTiles = myTileset.findTile(I.x,I.y);
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

	//They might need to flip out
	I.flip = false;

	lookahead = lookahead || false;

	I.target = target || {x:0,y:0};

	I.eaten = false;

	//PacMan has to move
	I.update = function(){
		//Update what tile the ghost is on
		var newTile = myTileset.findTile(I.x,I.y);

		//Check if this tile is actually new
		if (I.xTile !=newTile.xTile || I.yTile != newTile.yTile){
			I.xTile = newTile.xTile;
			I.yTile = newTile.yTile;
			//This is really hacky and needs changing
			//This is the screen wrap routine, may need changing.
			if(I.xTile < 2 && I.yTile == 17){
				I.xTile = 25;
			}
			if(I.xTile > 25 && I.yTile == 17){
				I.xTile = 2;
			}
			if(lookahead){
				I.singleLookaheadSearch(I.target);
				if(I.ai === undefined){
					I.findTarget();
				}
				else if(I.ai==="blinky"){
					I.blinkyFindTarget();
				}
				else if(I.ai==="inky"){
					I.inkyFindTarget();
				}
				else if(I.ai==="pinky"){
					I.pinkyFindTarget();
				}
				else if(I.ai==="clyde"){
					I.clydeFindTarget();
				}
			}
			else{
				I.decide();
			}
		};

		//Need to check the status of tiles above or below the current
		//LEFT
		if(I.movement == 1 && myTileset.checkLeft(I.xTile,I.yTile)){
			//if(myTileset.checkLeft(I.xTile,I.yTile)){
				I.x -= I.velocity;
				if(I.x < 0){
					I.x = myTileset.width;
				}
				I.y = I.yTile * myTileset.tileHeight+(myTileset.tileHeight/2);
			//}
		}
		else if(I.movement == 2 && myTileset.checkRight(I.xTile,I.yTile)){
			//RIGHT
			//if(myTileset.checkRight(I.xTile,I.yTile)){
				I.x += I.velocity;
				if(I.x >myTileset.width){
					I.x = 0;
				}
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

		if(I.xTile == 14 && I.yTile == 14){
			I.eaten = false;
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
	 	if(pacman.energizer == 0){
	 		I.sprite.draw(I.x - (I.width/2), I.y - (I.height/2));
	 	}
	 	else if(I.eaten){
			scared[1].draw(I.x - (I.width/2), I.y - (I.height/2));
	 	}
	 	else if(pacman.energizer > 0){	
	 		scared[0].draw(I.x - (I.width/2), I.y - (I.height/2));
	 	}
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

	//Blinky literally just follows pacman directly
	//His target tile is always just the target tile of pacman
	I.blinkyFindTarget = function(){
		I.target = {x:pacman.xTile,y:pacman.yTile};
		if(I.flip == true){
			if(I.movement === 1){I.nextDirection = 2;}
			if(I.movement === 2){I.nextDirection = 1;}
			if(I.movement === 3){I.nextDirection = 4;}
			if(I.movement === 4){I.nextDirection = 3;}
			I.flip = false
		}
		if(pacman.energizer>0){
			I.target = {x:0,y:2};
		}
		if(I.eaten){
			I.target = {x:14, y:15};
		}
	}

	//Pinky chases 4 ahead of PacMan
	//There is a noted bug which I am including here
	I.pinkyFindTarget = function(){
		if(pacman.movement == 1){
			I.target = {x:pacman.xTile-4,y:pacman.yTile};
		}
		else if(pacman.movement == 2){
			I.target = {x:pacman.xTile+4,y:pacman.yTile};
		}
		//Here I am implementing the bug
		else if(pacman.movement == 3){
			I.target = {x:pacman.xTile-4, y:pacman.yTile-4};
		}
		else if(pacman.movement == 4){
			I.target = {x:pacman.xTile, y:pacman.yTile + 4};
		}
		if(I.flip == true){
			if(I.movement === 1){I.nextDirection = 2;}
			if(I.movement === 2){I.nextDirection = 1;}
			if(I.movement === 3){I.nextDirection = 4;}
			if(I.movement === 4){I.nextDirection = 3;}
			I.flip = false;
		}
		if(pacman.energizer>0){
			I.target={x:33,y:2};
		}
		if(I.eaten){
			I.target = {x:14, y:15};
		}
	}
	/* Inky needs blinky's target tile and current location to find his
 	* own. Inky takes blinky's target, which is pacman, and adds 2 tiles
 	* in the direction pacman is facing. Then he takes that tile and gets
 	* difference between it and blinky's current location call it x. That difference
 	* is doubled to 2x. Inky's target tile is at the end of a line segment 2x
 	* long with one end at blinky's current location and midpoint being that
 	* 2 offset tile. The offset tile location has a bug much like pinky where
 	* When pacman is pointing up, the offset is 2 up AND 2 LEFT of blinky's
 	* target(pacman's location).
 	* 
 	*/
	I.inkyFindTarget = function(){
		var offset = {};
		if(pacman.movement == 1){
			offset.x = blinky.target.x - 2;
			offset.y = blinky.target.y;
		}
		else if(pacman.movement == 2){
			offset.x = blinky.target.x + 2;
			offset.y = blinky.target.y;
		}
		else if(pacman.movement == 3){
			offset.x = blinky.target.x - 2;
			offset.y = blinky.target.y - 2;
		}
		else if(pacman.movement == 4){
			offset.x = blinky.target.x;
			offset.y = blinky.target.y + 2;
		}
		//If pacman isn't moving make it chase
		else{
			inky.target = {x:28, y:34};
			return;
		}
		//make offset in terms of pixel not tile
		//get the pixel in the center of the offset tile
		offset.x = (offset.x*16)+8;
		offset.y = (offset.y*16)+8;

		//Find distance between offset tile and blinky's location
		//Not absolute because we are going to double this and
		//find it i relation to blinky IE this might be below and
		//to the left, so we retain the sign
		var dist = {};
		dist.x = 2*(offset.x-blinky.x);
		dist.y = 2*(offset.y-blinky.y);
		var targetTile = myTileset.findTile(blinky.x+dist.x,blinky.y+dist.y);
		I.target = {x:targetTile.xTile,y:targetTile.yTile};
		//switch directions once pacman gets the energizer
		if(I.flip == true){
			if(I.movement === 1){I.nextDirection = 2;}
			if(I.movement === 2){I.nextDirection = 1;}
			if(I.movement === 3){I.nextDirection = 4;}
			if(I.movement === 4){I.nextDirection = 3;}
			I.flip = false;
		}
		if(pacman.energizer>0){
			I.target = {x:28, y:34};
		}
		if(I.eaten){
			I.target = {x:14, y:15};
		}

	}

	I.clydeFindTarget = function(){
		//find the euclidian distance between clyde's tile
		//and pacman's tile
		//Get the pixel locations of these tiles
		var clydeTile = myTileset.findLoc(I.xTile,I.yTile);
		var pacTile = myTileset.findLoc(pacman.xTile,pacman.yTile);
		var distance = Math.sqrt(((clydeTile.xLoc-pacTile.xLoc)*(clydeTile.xLoc-pacTile.xLoc))+((clydeTile.yLoc-pacTile.yLoc)*(clydeTile.yLoc-pacTile.yLoc)));
		if(distance > CLYDECIRCLE*myTileset.tileWidth){
			I.target = {x:pacman.xTile,y:pacman.yTile};
		}
		else{
			I.target = {x:0,y:34};
		}
		if(I.flip == true){
			if(I.movement === 1){I.nextDirection = 2;}
			if(I.movement === 2){I.nextDirection = 1;}
			if(I.movement === 3){I.nextDirection = 4;}
			if(I.movement === 4){I.nextDirection = 3;}
			I.flip = false;
		}
		if(pacman.energizer>0){
			I.target = {x:0,y:34};
		}
		if(I.eaten){
			I.target = {x:14, y:15};
		}
	}

	I.setAI = function(aiName){
		if(aiName === "blinky"){
			I.ai = "blinky";
		}
		if(aiName === "pinky"){
			I.ai = "pinky";
		}
		if(aiName === "inky"){
			I.ai = "inky";
		}
		if(aiName === "clyde"){
			I.ai = "clyde";
		}
	}

	return I;
}
