//tiles.js
/* Pacman needs a tiling system so I am making one
 * Here goes nothing.
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
function tileset(tileData, width, height){
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

	if(checkMatrix(tileData) != 0){
		I.valid = false;
		return I;
	}
	else{
		I.valid = true;
	}

	I.tileWidth = width/I.map.length;
	I.tileHeight = height/I.map[0].length;

	I.renderMap = function(canvas){
	 	for(var j = 0; j<I.map.length; j++){
	 		for(var k = 0; k<I.map[j].length; k++){
	 			//Now draw the right piece for I.map[j][k]
	 			switch(I.map[j][k]){
	 			case 'o':
	 				//draw pellet tile
	 				canvas.fillStyle = "#000000";
	 				canvas.fillRect(I.tileWidth * j, I.tileHeight * k, I.tileWidth, I.tileHeight);
	 				canvas.fillStyle = "#FFFF00";
	 				canvas.fillRect((I.tileWidth * j)+(I.tileWidth/3), (I.tileHeight * k)+(I.tileHeight/3), I.tileWidth/3, I.tileHeight/3);
	 				console.log('Dot tile at ' + j + ', ' + k);
	 				break;
	 			case 'O':
	 				//draw energizer tile
	 				canvas.fillStyle = "#000000";
	 				canvas.fillRect(I.tileWidth * j, I.tileHeight * k, I.tileWidth, I.tileHeight);
	 				canvas.fillStyle = "#FFFFFF";
	 				canvas.fillRect((I.tileWidth * j)+(I.tileWidth/4), (I.tileHeight * k)+(I.tileHeight/4), I.tileWidth/2, I.tileHeight/2);
	 				console.log('Energizer tile at ' + j + ', ' + k);
	 				break;
	 			case '=':
	 				//draw straight horizontal piece tile tile
	 				canvas.fillStyle = "#000000";
	 				canvas.fillRect(I.tileWidth * j, I.tileHeight * k, I.tileWidth, I.tileHeight);
	 				canvas.fillStyle = "#0000FF";
	 				canvas.fillRect(I.tileWidth * j, (I.tileHeight * k)+(I.tileHeight/3), I.tileWidth, I.tileHeight/3);
	 				console.log('straight horiz piece tile at ' + j + ', ' + k);
	 				break;
	 			case 'I':
	 				//draw straight vertical piece tile
	 				canvas.fillStyle = "#000000";
	 				canvas.fillRect(I.tileWidth * j, I.tileHeight * k, I.tileWidth, I.tileHeight);
	 				canvas.fillStyle = "#0000FF";
	 				canvas.fillRect((I.tileWidth * j)+(I.tileWidth/3), I.tileHeight * k, I.tileWidth/3, I.tileHeight);
	 				console.log('straight vert piece tile at ' + j + ', ' + k);
	 				break;
	 			case '6':
	 				//draw right end piece tile
	 				canvas.fillStyle = "#000000";
	 				canvas.fillRect(I.tileWidth * j, I.tileHeight * k, I.tileWidth, I.tileHeight);
	 				canvas.fillStyle = "#0000FF";
	 				canvas.fillRect(I.tileWidth * j, I.tileHeight * k, 2*(I.tileWidth/3), I.tileHeight);
	 				console.log('Right end piece tile at' + j + ', ' + k);
	 				break;
	 			case '4':
	 				//draw left end piece  tile
	 				canvas.fillStyle = "#000000";
	 				canvas.fillRect(I.tileWidth * j, I.tileHeight * k, I.tileWidth, I.tileHeight);
	 				canvas.fillStyle = "#0000FF";
	 				canvas.fillRect((I.tileWidth * j) + (I.tileWdith/3), I.tileHeight * k, 2*(I.tileWidth/3), I.tileHeight);
	 				console.log('Left end piece tile at ' + j + ', ' + k);
	 				break;
	 			case '8':
	 				//draw downward end piece tile
	 				canvas.fillStyle = "#000000";
	 				canvas.fillRect(I.tileWidth * j, I.tileHeight * k, I.tileWidth, I.tileHeight);
	 				canvas.fillStyle = "#0000FF";
	 				canvas.fillRect((I.tileWidth * j)+(I.tileWidth/3), I.tileHeight * k, I.tileWidth/3, I.tileHeight-(I.tileHeight/3));
	 				console.log('Downward end piece tile at ' + j + ', ' + k);
	 				break;
				case '2':
	 				//draw upward end piece tile
	 				canvas.fillStyle = "#000000";
	 				canvas.fillRect(I.tileWidth * j, I.tileHeight * k, I.tileWidth, I.tileHeight);
	 				canvas.fillStyle = "#0000FF";
	 				canvas.fillRect((I.tileWidth * j)+(I.tileWidth/3), (I.tileHeight * k)+(I.tileHeght/3), I.tileWidth/3, 2*(I.tileHeight/3));
	 				console.log('Upward end piece tile at ' + j + ', ' + k);
	 				break;
	 			case '3':
	 				//draw downright corner piece tile
	 				canvas.fillStyle = "#000000";
	 				canvas.fillRect(I.tileWidth * j, I.tileHeight * k, I.tileWidth, I.tileHeight);
	 				canvas.fillStyle = "#0000FF";
	 				canvas.fillRect((I.tileWidth * j)+(2*(I.tileWidth/3)), (I.tileHeight * k)+(2*(I.tileHeight/3)), I.tileWidth/3, I.tileHeight/3);
	 				console.log('Downright corner piece tile at ' + j + ', ' + k);
	 				break;
	 			case '1':
	 				//draw downleft corner piece tile
	 				canvas.fillStyle = "#000000";
	 				canvas.fillRect(I.tileWidth * j, I.tileHeight * k, I.tileWidth, I.tileHeight);
	 				canvas.fillStyle = "#0000FF";
	 				canvas.fillRect(I.tileWidth * j, (I.tileHeight * k)+(2*(I.tileHeight/3)), I.tileWidth/3, I.tileHeight/3);
	 				console.log('Downleft corner piece tile at ' + j + ', ' + k);
	 				break;
	 			case '7':
	 				//draw upleft corner piece tile
	 				canvas.fillStyle = "#000000";
	 				canvas.fillRect(I.tileWidth * j, I.tileHeight * k, I.tileWidth, I.tileHeight);
	 				canvas.fillStyle = "#0000FF";
	 				canvas.fillRect(I.tileWidth * j, I.tileHeight * k, I.tileWidth/3, I.tileHeight/3);
	 				console.log('upleft corner piece tile at ' + j + ', ' + k);
	 				break;
	 			case '9':
	 				//draw upright corner piece tile
	 				canvas.fillStyle = "#000000";
	 				canvas.fillRect(I.tileWidth * j, I.tileHeight * k, I.tileWidth, I.tileHeight);
	 				canvas.fillStyle = "#0000FF";
	 				canvas.fillRect((I.tileWidth * j)+(2*(I.tileWidth/3)), I.tileHeight * k, I.tileWidth/3, I.tileHeight/3);
	 				console.log('upright corner piece tile at ' + j + ', ' + k);
	 				break;
	 			case 'M':
	 				//draw a piece inside the barrier(probably a solid color)
	 				canvas.fillStyle = "#000000";
	 				canvas.fillRect(I.tileWidth * j, I.tileHeight * k, I.tileWidth, I.tileHeight);
	 				console.log('Inner barrier tile at ' + j + ', ' + k);
	 				break;
	 			case 'e':
	 				//draw a blank movable space
	 				canvas.fillStyle = "#000000";
	 				canvas.fillRect(I.tileWidth * j, I.tileHeight * k, I.tileWidth, I.tileHeight);
	 				console.log('Blank movable space tile at ' + j + ', ' + k);
	 				break;
	 			}

	 		}
	 	}
	}

	return I;

}