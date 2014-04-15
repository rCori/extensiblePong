//sprite.js
//Need something to deal with sprites

var pathname = /* "the/path/to/the/sprites" */ "";

function sprite(image, canvas,width,height){
	/* The building block basic one frame single image
	 * sprite
	 */
	 var I = {};

	 //Need to specify a new Image object and it's source
	 I.imageObj = new Image();
	 I.imageObj.src = pathname + image;
	 console.log("got here");
	 I.loaded = false;
	 I.width = width;
	 I.height = height;

	 I.imageObj.onload = function(){
	 	I.loaded = true;
	 };

	 I.draw = function(x, y){
	 	//uhhh I guess
	 	if(I.loaded){
	 		canvas.drawImage(I.imageObj,x,y,I.width,I.height);
	 	}
	 };

	 return I;
}

function spritesheet(image, tileWidth, tileheight, sheetWidth, sheetHeight){
	/* User must specify height and width of each sprite
	 * This will divide up the spritesheet into an array of
	 * sprites
	 * getting help from:
	 * http://stackoverflow.com/questions/11533606/javascript-splitting-a-tileset-image-to-be-stored-in-2d-image-array
	 * "help"
	 */

	 //First make a fake canvas for you to draw the entire sheet onto
	 var fakeCanvasElement = jQuery("<canvas id='fake' ></canvas>");
	 var fakeCanvas = fakeCanvasElement.get(0).getContext("2d");
	 var myFakeCanv = fakeCanvasElement.get(0);
	 fakeCanvasElement.appendTo('body');
}

function animation(sprites){
	/*This will take an array of sprites anf give
	 *back some sort of animation.
	 */
}