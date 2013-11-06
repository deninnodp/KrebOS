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
	this.getAddress2 = memManagementGetAddress2;

}

function memManagementGetAddress(args) {

	var addressindex;
	
	if (_current_pcb.pid == 0)
		{
			addressindex = args;
		//	krnTrace("HOOOOA " + addressindex);
			return (_mainMem.Memory[addressindex]);
		}else if (_current_pcb.pid == 1)
		{
			addressindex = args;
	//		krnTrace("HOOOOA1 " + addressindex);
			return (_mainMem.Memory[addressindex]);
		}else if (_current_pcb.pid == 2)
		{
			addressindex = args;
//		krnTrace("HOOOOA2 " + addressindex);
			return (_mainMem.Memory[addressindex]);
		}

}

function memManagementGetAddress2(args) {

	var addressindex;
	
	if (_current_pcb.pid == 0)
		{
			addressindex = args;
	//		krnTrace("HOOOO " + addressindex);
			return (_mainMem.Memory[addressindex]);
		}else if (_current_pcb.pid == 1)
		{
			addressindex = args + 256;
	//		krnTrace("HOOOO1 " + addressindex);
			return (_mainMem.Memory[addressindex]);
		}else if (_current_pcb.pid == 2)
		{
			addressindex = args + 512;
	//		krnTrace("HOOOO2 " + addressindex);
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
	var output = parseInt(_current_pcb.base) + parseInt(_current_pcb.pc);
	//krnTrace("THIS THIS THIS THIS " + _current_pcb.pc);
//	krnTrace("BASE: " + _current_pcb.base + "PC: " + _current_pcb.pc);
	return (output);

}