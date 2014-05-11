//pacGhost.js
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
				I.findTarget();
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
	 	else{
	 		canvas.fillStyle = "#0000FF";
	 		canvas.fillRect(I.x - (I.width/2), I.y - (I.height/2), I.width, I.height);	
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

	return I;
}