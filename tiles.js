//tiles.js
/* Pacman needs a tiling system so this is the one I made
 * It works for what it is used for but might not be
 * wonderful for a more general use-case
 */

//Make sure your data is a uniform matrix
function checkMatrix(matrixHopeful){
	//A return value of 0 means your matrix has uniform lengths
	//A return value of 1 means it is not a matrix, not uniform row lengths
	//A return value of 2 means this isn't even a 2D array we could process
	var returnCode = 0;
	try{
		var size = matrixHopeful[0].length;
		for(var k = 0; k<matrixHopeful.length; k++){
			if(matrixHopeful[k].length != size){
				returnCode = 1;
				break;
			}
		}
		return returnCode;
	}
	catch(err){
		returnCode = 2;
		return returnCode;
	}
}

//Tileset constructor
function tileset(tileData, width, height, spriteMap, canvas){
	var I = {};

	//Map needs to be a 2D array of data
	I.map = tileData;
	//Lets define a grammer for parsing the tileset
	//I need 29 different values
	/* 'o' is a dot
	 * 'O' is an energizer pelet
	 * '=' is a straight horizontal piece
	 * 'I' is a straight vertical piece
	 * '6' is a right end piece
	 * '4' is a left end piece
	 * '8' is downward end piece
	 * '2' is an upward end piece
	 * '3' is a lower right corner piece
	 * '1' is a lower left corner piece
	 * '7' is an upper left corner piece
	 * '9' is an upper right corner piece
	 * 'M' is inside a barrier (blank space pacman cannot move)
	 * 'e' is a space that pacman can move but has no dot
	 */
	 I.spriteMap = spritesheet(spriteMap,canvas,16,16,112,32);

	if(checkMatrix(tileData) != 0){
		I.valid = false;
		return I;
	}
	else{
		I.valid = true;
	}

	I.tileWidth = width/I.map.length;
	I.tileHeight = height/I.map[0].length;

	I.width = width;
	I.height = height;

	I.renderMap = function(canvas){

	 	for(var j = 0; j<I.map.length; j++){
	 		for(var k = 0; k<I.map[j].length; k++){
	 			//Now draw the right piece for I.map[j][k]
	 			switch(I.map[j][k]){
	 			case 'o':
	 				//draw pellet tile
	 				I.spriteMap[0].draw(I.tileWidth * j, I.tileHeight * k);
	 				break;
	 			case 'O':
	 				//draw energizer tile
	 				I.spriteMap[1].draw(I.tileWidth * j, I.tileHeight * k);
	 				break;
	 			case '=':
	 				//draw straight horizontal piece tile tile
	 				I.spriteMap[2].draw(I.tileWidth * j, I.tileHeight * k);
	 				break;
	 			case 'I':
	 				//draw straight vertical piece tile
	 				I.spriteMap[3].draw(I.tileWidth * j, I.tileHeight * k);
	 				break;
	 			case '6':
	 				//draw right end piece tile
	 				I.spriteMap[4].draw(I.tileWidth * j, I.tileHeight * k);
	 				break;
	 			case '4':
	 				//draw left end piece  tile
	 				I.spriteMap[5].draw(I.tileWidth * j, I.tileHeight * k);
	 				break;
	 			case '8':
	 				//draw downward end piece tile
	 				I.spriteMap[6].draw(I.tileWidth * j, I.tileHeight * k);
	 				break;
				case '2':
	 				//draw upward end piece tile
	 				I.spriteMap[7].draw(I.tileWidth * j, I.tileHeight * k);
	 				break;
	 			case '3':
	 				//draw downright corner piece tile
	 				I.spriteMap[8].draw(I.tileWidth * j, I.tileHeight * k);
	 				break;
	 			case '1':
	 				//draw downleft corner piece tile
	 				I.spriteMap[9].draw(I.tileWidth * j, I.tileHeight * k);
	 				break;
	 			case '7':
	 				//draw upleft corner piece tile
	 				I.spriteMap[10].draw(I.tileWidth * j, I.tileHeight * k);
	 				break;
	 			case '9':
	 				//draw upright corner piece tile
	 				I.spriteMap[11].draw(I.tileWidth * j, I.tileHeight * k);
	 				break;
	 			case 'M':
	 				//draw a piece inside the barrier(probably a solid color)
	 				canvas.fillStyle = "#000000";
	 				canvas.fillRect(I.tileWidth * j, I.tileHeight * k, I.tileWidth, I.tileHeight);
	 				break;
	 			case 'e':
	 				//draw a blank movable space
	 				canvas.fillStyle = "#000000";
	 				canvas.fillRect(I.tileWidth * j, I.tileHeight * k, I.tileWidth, I.tileHeight);
	 				break;
	 			}

	 		}

	 	}

	}

	//Return the current tile based on the current absoulte map position
	I.findTile = function(xLoc,yLoc){
		//Construct the object to be returned
	 	var J = {}
	 	//Give it values xTile and yTile that we want
	 	J.xTile = Math.floor(xLoc/I.tileWidth);
	 	J.yTile = Math.floor(yLoc/I.tileHeight);
	 	//Return our object
	 	return J;

	}
	//Returns location assuming pac man is in the middle of a tile
	//This function is essentially the inverse function of findTile
	I.findLoc = function(xTile,yTile){
		//Construct the object to be returned
		var J = {};
		//Give it values xLoc and yLoc
		J.xLoc = xTile*I.tileWidth + (I.tileWidth/2);
	 	J.yLoc = yTile*I.tileHeight + (I.tileHeight/2);
	 	//Return our object
	 	return J;
	}

	/* Now we need a series of functions to check if we are encountering walls
	 * Return true if this is a place that can be moved to
	 * False if pacman can't go here.
	 * I should never have to check array bounds
	 * PacMan can't get to the edge of the screen
	 */
	//RIGHT
	I.checkRight = function(xTile,yTile){
		//Get the tile to the right
		var temp = I.map[xTile+1][yTile];
		//Check if it's a tile you can move to
		if((temp === 'o')||(temp === 'O')||(temp ==='M')||(temp === 'e')){
			return true;
		}
		else{
			return false;
		}
	}
	//LEFT
	I.checkLeft = function(xTile,yTile){
		//Get the tile to the left
		var temp = I.map[xTile-1][yTile];
		//Check if it's a tile you can move to
		if((temp === 'o')||(temp === 'O')||(temp ==='M')||(temp === 'e')){
			return true;
		}
		else{
			return false;
		}
	}
	//UP
	I.checkUp = function(xTile,yTile){
		//Get the tile above
		var temp = I.map[xTile][yTile-1];
		//Check if it's a tile you can move to
		if((temp === 'o')||(temp === 'O')||(temp ==='M')||(temp === 'e')){
			return true;
		}
		else{
			return false;
		}
	}
	//DOWN
	I.checkDown = function(xTile,yTile){
		//get the tile below
		var temp = I.map[xTile][yTile+1];
		//Check if it's a tile you can move to
		if((temp === 'o')||(temp === 'O')||(temp ==='M')||(temp === 'e')){
			return true;
		}
		else{
			return false;
		}
	}

	return I;

}