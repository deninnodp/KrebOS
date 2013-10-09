/* ------------
   mainMem.js

   Requires globals.js

   ------------ */

function mainMem() {
	//create the memory
	this.Memory = new Array();

	this.init = mainMemInit;
	this.display = mainMemDisplay;
	this.set = mainSetMem;
}

function mainMemInit() {
	//init the main memory area
	var i = 0;
	while (i <= 256) {
		this.Memory[i] = "00";
		i++;
	}

	i = 0;
	while (i <= 128) {
		i++;
	}

}
//changes a location in memory
function mainSetMem(args, base) {

	base = parseInt(base, 16)

	var argsArray = args.split(' ');

	for (x in argsArray) {
		var offset = parseInt(x) + base; //add the base to current location
		this.Memory[offset] = argsArray[x];
	}

	_current_pcb.base_location = base;

	this.display();

}

function mainMemDisplay() {
	//alert("inside display");

	var mainMemDisplay = document.getElementById("mainMemDisplay");
	mainMemDisplay.innerHTML = ""; //clear it out

	var i = 0;
	var line = "0000: ";
	var endofline = 0;
	while (i <= 256) {
		//checks if at end of line
		if (endofline == 8) {
			//	krnTrace("in end of line");
			//krnTrace(line);

			mainMemDisplay.innerHTML = mainMemDisplay.innerHTML + "<div>" + line + "</div>";
			var getrow = i;
			line = stringFiller(getrow.toString(), "0000") + ": ";
			endofline = 0;
		}

		line = line + stringFiller(this.Memory[i].toString(), "00") + " ";

		//line = line + stringFiller(this.Memory[i], "00") + " ";

		endofline++;
		i++;
	}

}