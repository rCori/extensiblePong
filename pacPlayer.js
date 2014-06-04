//pacPlayer.js

//The speed of pacman and ghosts are relative to one constant.
var SPEEDCONSTANT = 3;


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
	I.lives = 3;
	I.score = 0;
	/* Movement gets 5 different values
	 * 0 means it is still
	 * 1 means go left
	 * 2 means go right
	 * 3 means go up
	 * 4 means go down
	 */
	I.movement = 0;

	//A timer for the energizer
	I.energizer = 0;

	I.velocity = 3;
	
	//We want an image for pacman
	I.sprite = sprite("pacman.png",canvas,16,16);

	//How much to rotate
	I.rotate = 0;

	//What options are available initially
	I.left = true;
	I.right = true;
	I.up = false;
	I.down = false;

	//Get the desired next direction
	I.nextDirection = 0;

	//We need to know if we are eating a dot
	I.dotEat = false;

	//Need to know how many total dots have been eaten
	I.totalDots = 0;

	//PacMan has to move
	I.update = function(){
		I.dotEat = false;
		//Update what tile pacman is on
		var newTile = myTileset.findTile(I.xLoc,I.yLoc);
		if(newTile.xTile != I.xTile || newTile.yTile != I.yTile){
			I.xTile = newTile.xTile;
			I.yTile = newTile.yTile;
			//Check if we are eating a dot
			if(myTileset.map[I.xTile][I.yTile] === 'o'){
				myTileset.map[I.xTile][I.yTile] = 'e';
				I.dotEat = true;
				I.totalDots += 1;
				I.score += 10;
			}
			//Check if we are getting an energizer pellet
			if(myTileset.map[I.xTile][I.yTile] === 'O'){
				myTileset.map[I.xTile][I.yTile] = 'e';
				I.energizer = 250;
				blinky.scared = 1;
				inky.scared = 1;
				clyde.scared = 1;
				pinky.scared = 1;
				blinky.flip = true;
				inky.flip = true;
				clyde.flip = true;
				pinky.flip = true;
				I.totalDots += 1;
				I.score += 50;
				//We will check for this being an energizer later
				I.dotEat = true;

			}
			//I.speedWagon(I.dotEat);
			//update the movement options
			//wrap around
			if(((newTile.xTile < 1) || (newTile.xTile>26)) && (I.yTile == 17)){
				I.left = true;
				I.right = true;
				I.up = false;
				I.down = false;
			}
			else{
				I.left = myTileset.checkLeft(I.xTile,I.yTile);
				I.right = myTileset.checkRight(I.xTile,I.yTile);
				I.up = myTileset.checkUp(I.xTile,I.yTile);
				I.down = myTileset.checkDown(I.xTile,I.yTile);
			}
			if(newTile.xTile < 1){
				I.xTile = 26;
			}
			if(newTile.xTile>26){
				I.xTile = 1;
			}
			//Get a time snapshot
			snapTime(saveData);

		}

		if(I.nextDirection != I.movement){
			if(I.nextDirection == 1 && I.left){
				if(myTileset.checkLeft(I.xTile,I.yTile)){
					I.movement = I.nextDirection;
				}
			}
			else if(I.nextDirection == 2 && I.right){
				if(myTileset.checkRight(I.xTile,I.yTile)){
					I.movement = I.nextDirection;
				}
			}
			else if(I.nextDirection == 3 && I.up){
				if(myTileset.checkUp(I.xTile,I.yTile)){
					I.movement = I.nextDirection;
				}
			}
			else if(I.nextDirection == 4 && I.down){
				if(myTileset.checkDown(I.xTile,I.yTile)){
					I.movement = I.nextDirection;
				}
			}
		}
		//Need to check the status of tiles above or below the current
		//LEFT
		if(I.movement == 1){
			if(I.left){
				I.xLoc -= I.velocity;
				I.yLoc = I.yTile * myTileset.tileHeight+(myTileset.tileHeight/2);
				//wrap around
				if(I.xLoc < 0){
					I.xLoc = myTileset.width;
				}
				I.rotate = 180;
			}
		}
		else if(I.movement == 2){
			//RIGHT
			if(I.right){
				I.xLoc += I.velocity;
				I.yLoc = I.yTile * myTileset.tileHeight+(myTileset.tileHeight/2);
				//Wrap around
				if(I.xLoc > myTileset.width){
					I.xLoc = 0;
				}
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
		//Tick down energy time
		if(I.energizer>0) I.energizer--;
	};

	I.draw = function(){
		
	 	I.sprite.draw(I.xLoc - (I.width/2), I.yLoc - (I.height/2),I.rotate);
	};


	I.showScore = function(x,y){
		canvas.fillStyle = "#FFF";
		canvas.textAlign = 'left'
		canvas.font="14px Calibri";
		canvas.fillText("Score : "+I.score,x,y);
	}

	I.showLives = function(x,y){
		for(var i = 1; i<I.lives; i++){
			I.sprite.draw(x+(i*I.width),y);
		}
	}

	//Set the speeds fo different situations
	//There are four different situations to account for
	//All four combinations of when pacman is or is not eating a dot(dotEat)
	//and if an energizer is active. Also if a ghost is eaten

	//THIS NEEDS FIXING
	I.speedWagon = function(){
		if(I.dotEat){
			if(pacman.energizer == 0){
				pacman.velocity = 0.8 * 3 /*SPEEDCONSTANT*/;
			}
			else
			{
				pacman.velocity = 0.9 * 3 /*SPEEDCONSTANT*/;
			}

			if(blinky.scared == 0){
				blinky.velocity = 0.75*SPEEDCONSTANT
			}
			else if(blinky.scared == 1){
				blinky.velocity = 0.5*SPEEDCONSTANT;
			}

			if(inky.scared == 0){
				inky.velocity = 0.75*SPEEDCONSTANT
			}
			else if(inky.scared == 1){
				inky.velocity = 0.5*SPEEDCONSTANT;
			}

			if(pinky.scared == 0){
				pinky.velocity = 0.75*SPEEDCONSTANT
			}
			else if(pinky.scared == 1){
				pinky.velocity = 0.5*SPEEDCONSTANT;
			}

			if(clyde.scared == 0){
				clyde.velocity = 0.75*SPEEDCONSTANT
			}
			else if(clyde.scared == 1){
				clyde.velocity = 0.5*SPEEDCONSTANT;
			}
		}
		else{
			if(pacman.energizer == 0){
				pacman.velcoty = 0.71 * 3 /*SPEEDCONSTANT*/;
			}
			else{
				pacman.velocity = 0.79 * 3/*SPEEDCONSTANT*/;
			}

			if(blinky.scared == 0){
				blinky.velocity = 0.75*SPEEDCONSTANT;
			}
			else if(blinky.scared == 1){
				blinky.velocity = 0.5*SPEEDCONSTANT;
			}

			if(inky.scared == 0){
				inky.velocity = 0.75*SPEEDCONSTANT;
			}
			else if(inky.scared == 1){
				inky.velocity = 0.5*SPEEDCONSTANT;
			}

			if(pinky.scared == 0){
				pinky.velocity = 0.75*SPEEDCONSTANT;
			}
			else if(pinky.scared == 1){
				pinky.velocity = 0.5*SPEEDCONSTANT;
			}

			if(clyde.scared == 0){
				clyde.velocity = 0.75*SPEEDCONSTANT;
			}
			else if(clyde.scared == 1){
				clyde.velocity = 0.5*SPEEDCONSTANT;
			}
		}
		//If any of the ghosts are floating eyeballs, this needs to be overridden
		if(blinky.scared == 2) blinky.velocity = 3 * SPEEDCONSTANT;
		if(inky.scared == 2) inky.velocity = 3 * SPEEDCONSTANT;
		if(pinky.scared == 2) pinky.velocity = 3 * SPEEDCONSTANT;
		if(clyde.scared == 2) clyde.velocity = 3 * SPEEDCONSTANT;

	}


	return I;
}