//tiles.js
/* Pacman needs a tiling system so I am making one
 * Here goes nothing.
 */


//Tileset constructor
function tileset(tileData){
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

	I.renderMap = function(canvas){
	 	for(var j = 0; j<I.map.length; j++){
	 		for(var k = 0; k<I.map[j].length; k++){
	 			//Now draw the right piece for I.map[j][k]
	 			switch(I.map[j][k]){
	 			case 'o':
	 				canvas.fillStyle = "#FFFF00";
	 				canvas.fillRect((400/I.map.length) * j, (600/I.map[j].length) * k, 10, 10);
	 				console.log('Dot tile at ' + j + ', ' + k);
	 				break;
	 			case 'O':
	 				//draw energizer tile
	 				console.log('Energizer tile at ' + j + ', ' + k);
	 				break;
	 			case '=':
	 				//draw straight horizontal piece tile tile
	 				console.log('straight horiz piece tile at ' + j + ', ' + k);
	 				break;
	 			case 'I':
	 				//draw straight vertical piece tile
	 				console.log('straight vert piece tile at ' + j + ', ' + k);
	 				break;
	 			case '6':
	 				//draw right end piece tile
	 				console.log('Right end piece tile at' + j + ', ' + k);
	 				break;
	 			case '4':
	 				//draw left end piece  tile
	 				console.log('Left end piece tile at ' + j + ', ' + k);
	 				break;
	 			case '8':
	 				//draw downward end piece tile
	 				console.log('Downward end piece tile at ' + j + ', ' + k);
	 				break;
				case '2':
	 				//draw upward end piece tile
	 				console.log('Upward end piece tile at ' + j + ', ' + k);
	 				break;
	 			case '3':
	 				//draw downright corner piece tile
	 				console.log('Downright corner piece tile at ' + j + ', ' + k);
	 				break;
	 			case '1':
	 				//draw downleft corner piece tile
	 				console.log('Downleft corner piece tile at ' + j + ', ' + k);
	 				break;
	 			case '7':
	 				//draw upleft corner piece tile
	 				console.log('upleft corner piece tile at ' + j + ', ' + k);
	 				break;
	 			case '9':
	 				//draw upright corener piece tile
	 				console.log('upright corner piece tile at ' + j + ', ' + k);
	 				break;
	 			case 'M':
	 				//draw a piece inside the barrier(probably a solid color)
	 				console.log('Inner barrier tile at ' + j + ', ' + k);
	 				break;
	 			case 'e':
	 				//draw a blank movable space
	 				console.log('Blank movable space tile at ' + j + ', ' + k);
	 				break;
	 			}

	 		}
	 	}
	}

	return I;

}