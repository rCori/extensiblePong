//sprite.js
//Need something to deal with sprites

//I got pathname from previously imported .js
//var pathname = /* "the/path/to/the/sprites" */ {{=URL('static','images')}};
pathname= pathname + '/';
console.log(pathname);
function sprite(image,canvas,width,height){
	/* The building block basic one frame single image
	 * sprite
	 */
	 var I = {};

	 console.log(typeof image);

	 //If you are getting an image filename
	 if(typeof image === "string"){
	 	//Need to specify a new Image object and it's source
	 	I.imageObj = new Image();
	 	I.imageObj.src = pathname + image;
	 }
	 //If you are getting image data from a
	 else{
	 	I.imageObj = image;
	 }
	 I.loaded = false;
	 I.width = width;
	 I.height = height;

	 if(typeof image === "string"){
	 	I.imageObj.onload = function(){
	 		I.loaded = true;
	 	};
	 }

	 I.draw = function(x, y, degree){
	 	//optional argument
	 	degree = degree || 0;
	 	//If you are getting an image filename
	 	if(typeof image === "string"){
	 		////uhhh I guess
	 		if(I.loaded){
	 			if(degree != 0){
	 				//Save the context
	 				canvas.save();
	 				//translate the canvas to center of where we are drawing the the thing
	 				canvas.translate(x+(I.width/2),y+(I.height/2));

	 				//rotate the canvas
	 				canvas.rotate(degree*(Math.PI/180));

	 				//draw the thing
	 				canvas.drawImage(I.imageObj,I.width/2*(-1),I.height/2*(-1),I.width,I.height);

	 				//Now fix everything
	 				canvas.rotate(degree *(Math.PI/180)*(-1));
	 				canvas.translate((x+(I.width/2))*(-1),(y+(I.height/2))*(-1));
	 			}
	 			
	 			else{
	 				canvas.drawImage(I.imageObj,x,y,I.width,I.height);
	 			}
	 		}
	 	}
	 	else{
	 		canvas.putImageData(I.imageObj,x,y);
	 	}
	 };



	 return I;
}

function spritesheet(image, canvas,tileWidth, tileHeight, sheetWidth, sheetHeight){
	/* User must specify height and width of each sprite
	 * This will divide up the spritesheet into an array of
	 * sprites
	 * getting help from:
	 * http://stackoverflow.com/questions/11533606/javascript-splitting-a-tileset-image-to-be-stored-in-2d-image-array
	 * "help"
	 */


	 //The total object to be returned
	 var I = {};

	 //First make a fake canvas for you to draw the entire sheet onto
	 var fakeCanvasElement = jQuery("<canvas id='fake' ></canvas>");
	 var fakeCanvas = fakeCanvasElement.get(0).getContext("2d");
	 fakeCanvasElement.appendTo('body');

	 //Where we store the tile data
	 //We will return this
	 var tiles = [];

	 //How many tiles across
	 var tilesX = sheetWidth/tileWidth;
	 //How many tiles high
	 var tilesY = sheetHeight/tileHeight;



	 var sheetObj = new Image();

	 var sprites = new Array();

	 //LoaderProxy
	 //Every member of sprite must be declared a noop or null here
	 for(var i = 0; i<tilesX*tilesY; i++){
	 	sprites.push({});
	 	sprites[i].draw = jQuery.noop;
	 }

	 sheetObj.onload = function(){
	 	//Draw the tilesheet to the fake ass canvas
	 	fakeCanvas.drawImage(sheetObj,0,0);
	 	for (var i = 0; i<tilesY; i++){
	 		for (var j = 0; j<tilesX; j++){
	 			tiles.push(fakeCanvas.getImageData(j*tileWidth, i*tileHeight, tileWidth, tileHeight));
	 		}
	 	}
	 	//remove the canvas
	 	fakeCanvas = null;
	 	jQuery('#fake').remove();


	 	for(var i = 0; i<tiles.length; i++){
	 		sprites[i] = (sprite(tiles[i],canvas,tileWidth,tileHeight));
	 	}

	 }
	 //Get the source of the tile sheet
	 sheetObj.src = pathname + image;

	 //return the tiles
	 return sprites;
}

function animation(sprites){
	/*This will take an array of sprites and give
	 *back some sort of animation.
	 */
}