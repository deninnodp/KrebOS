/* ------------
   memManagement.js

   Requires globals.js
   
   Anything going to main memory passes through here
   Later will handle where it goes, either 0000, or 1000 in order to have multiple programs in mem at once


   ------------ */

function memManagement() {

	this.storeProgram = memManagementStoreProgram;
	this.getAddress = memManagementGetAddress;
	this.getPC = memManagementGetPC;

}

function memManagementGetAddress(args) {

	var addressindex;
	
	if (_current_pcb.pid == 0)
		{
			addressindex = args;
	//		krnTrace("HOOOO " + addressindex);
			return (_mainMem.Memory[addressindex]);
		}else if (_current_pcb.pid == 1)
		{
			addressindex = args;
//			krnTrace("HOOOO1 " + addressindex);
			return (_mainMem.Memory[addressindex]);
		}else if (_current_pcb.pid == 2)
		{
			addressindex = args;
//			krnTrace("HOOOO2 " + addressindex);
			return (_mainMem.Memory[addressindex]);
		}

}

function memManagementStoreProgram(input, pid) {
	
	
	if (pid == 0)
	{
		_mainMem.set(input, "0000");

	}else if (pid == 1){

		_mainMem.set(input, "0256");
	}else if (pid == 2){
		_mainMem.set(input, "0512");
	}

}

function memManagementGetPC() {
	var output = _current_pcb.base_location + _current_pcb.pc;
	//krnTrace("THIS THIS THIS THIS " + _current_pcb.pc);
	return (output);

}