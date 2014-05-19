//sprite.js
//Need something to deal with sprites

//I got pathname from previously imported .js
//var pathname = /* "the/path/to/the/sprites" */ {{=URL('static','images')}};
pathname= pathname + '/';
console.log(pathname);
function sprite(image,canvas,width,height,srcX,srcY){
	/* The building block basic one frame single image
	 * sprite
	 */
	 var I = {};



	 //If you are getting an image filename
	 if(typeof image === "string"){
	 	//Need to specify a new Image object and it's source
	 	I.imageObj = new Image();
	 	I.imageObj.src = pathname + image;
	 	I.draw = jQuery.noop;

	 	I.imageObj.onload = function(){
	 		I.draw = function(x, y, degree){
	 			//optional argument
	 			degree = degree || 0;
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
	 			//There is no degree to rotate for.
	 			else{
	 				canvas.drawImage(I.imageObj,x,y,I.width,I.height);
	 			}
	 		};
	 	}

	 }
	 //If you are getting image data from a spritesheet
	 //Image is alreasy loaded
	 else{
	 	I.imageObj = image;
	 	I.draw = function(x,y, degree){
				//optional argument
	 			degree = degree || 0;
	 			if(degree != 0){
	 				//Save the context
	 				canvas.save();
	 				//translate the canvas to center of where we are drawing the the thing
	 				canvas.translate(x+(I.width/2),y+(I.height/2));

	 				//rotate the canvas
	 				canvas.rotate(degree*(Math.PI/180));

	 				//draw the thing
	 				canvas.drawImage(image,srcX,srcY,width,height,width/2*(-1),height/2*(-1),width,height);

	 				//Now fix everything
	 				canvas.rotate(degree *(Math.PI/180)*(-1));
	 				canvas.translate((x+(I.width/2))*(-1),(y+(I.height/2))*(-1));
	 			}
	 			//There is no degree to rotate for.
	 			else{
	 				canvas.drawImage(image,srcX,srcY,width,height,x,y,width,height);
	 			}
	 	}
	 }
	 I.width = width;
	 I.height = height;

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


	 //We need to know how many tiles across and high
	 var tilesX = sheetWidth/tileWidth;
	 var tilesY = sheetHeight/tileHeight;

	 var imageObj = new Image();

	 imageObj.src = pathname + image;

	 var sprites = new Array(); 

	 //LoaderProxy
	 //Every member of sprite must be declared a noop or null here
	 for(var i = 0; i<tilesX*tilesY; i++){
	 	sprites.push({});
	 	sprites[i].draw = jQuery.noop;
	 }

	 imageObj.onload = function(){
	 	for (var i = 0; i<tilesY; i++){
	 		for (var j = 0; j<tilesX; j++){
	 			sprites[(i*tilesX) + j] = sprite(imageObj,canvas,tileWidth, tileHeight, j*tileWidth, i*tileHeight);
	 		}
	 	}
	 }

	 return sprites;

}


function animation(sprites){
	/*This will take an array of sprites and give
	 *back some sort of animation.
	 */
}