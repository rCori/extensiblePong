//timeModel.js
/*
 * This is where I want to put all the code that
 * records steps of time and can reload it back.
 */

var timeSnaps=[];

//get snapped
//This pushes a current time step ont he end of the array
function snapTime(saveData){
	//Get some object that at least contains all the positional data
	var data = saveData();
	timeSnaps.push(data);

}

//This loads a time step
function loadTime(index, loadData, forward){
	if(timeSnaps[index] !== undefined){
		var data = timeSnaps[index];
		loadData(data,forward);
	}
}