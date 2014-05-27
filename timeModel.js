//timeModel.js
/*
 * This is where I want to put all the code that
 * records steps of time and can reload it back.
 */

var timeSnaps=[];

//get snapped
function snapTime(saveData){
	//Get some object that at least contains all the positional data
	var data = saveData();
	timeSnaps.push(data);

}

function loadTime(index, loadData, forward){
	if(timeSnaps[index] !== undefined){
		var data = timeSnaps[index];
		loadData(data,forward);
	}
}