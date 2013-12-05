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
	this.swap = memManagementSwap;

}

function memManagementGetAddress(args) {

	var addressindex;

			addressindex = args;
		//	krnTrace("HOOOOA " + addressindex);
			return (_mainMem.Memory[addressindex]);


}

function memManagementGetAddress2(args) {

	var addressindex;
	
	if (_current_pcb.base == 0)
		{
			addressindex = args;
	//		krnTrace("HOOOO " + addressindex);
			return (_mainMem.Memory[addressindex]);
		}else if (_current_pcb.base == 256)
		{
			addressindex = args + 256;
	//		krnTrace("HOOOO1 " + addressindex);
			return (_mainMem.Memory[addressindex]);
		}else if (_current_pcb.base == 512)
		{
			addressindex = args + 512;
	//		krnTrace("HOOOO2 " + addressindex);
			return (_mainMem.Memory[addressindex]);
		}

}

function memManagementStoreProgram(input, pid) {
	
	
	if (_current_pcb.base == 0)
	{
		_mainMem.set(input, "0000");

	}else if (_current_pcb.base == 256){

		_mainMem.set(input, "0256");
	}else if (_current_pcb.base == 512){
		_mainMem.set(input, "0512");
	}

}

function memManagementGetPC() {
	var output = parseInt(_current_pcb.base) + parseInt(_current_pcb.pc);
	//krnTrace("THIS THIS THIS THIS " + _current_pcb.pc);
//	krnTrace("BASE: " + _current_pcb.base + "PC: " + _current_pcb.pc);
	return (output);

}


function memManagementSwap(p1,p2,r1,r2)
{
	//p1 is on disk, p2 is going onto the disk
	if (_readyqueue[r2].base == 0)
		{
			var program = "";
			var tomem;
			var name = "process" + p1;
			//var tempbase;
			//var templimit;
			
			for (var i=0;i<255;i++)
				{
					program = program + memManagementGetAddress(i) + " ";
				}
			krnTrace("LOOOOOK " + name);
			krnFileSystemDriver.storeProgram(program, p2);
			tomem = krnFileSystemDriver.read(name);
			
			_readyqueue[r1].base = _readyqueue[r2].base;
			_readyqueue[r1].limit = _readyqueue[r2].limit;
			
			memManagementStoreProgram(tomem, p1);
			
			
		}else if (_readyqueue[r2].base == 256)
		{
			var program = "";
			var tomem;
			var name = "process" + p1;
			//var tempbase;
			//var templimit;
			
			for (var i=256;i<511;i++)
				{
					program = program + memManagementGetAddress(i) + " ";
				}
			krnTrace("LOOOOOK " + name);
			krnFileSystemDriver.storeProgram(program, p2);
			tomem = krnFileSystemDriver.read(name);
			
			_readyqueue[r1].base = _readyqueue[r2].base;
			_readyqueue[r1].limit = _readyqueue[r2].limit;
			
			memManagementStoreProgram(tomem, p1);
			
		}else if (_readyqueue[r2].base == 512)
		{
			var program = "";
			var tomem;
			var name = "process" + p1;
			//var tempbase;
			//var templimit;
			
			for (var i=512;i<767;i++)
				{
					program = program + memManagementGetAddress(i) + " ";
				}
			krnTrace("LOOOOOK " + name);
			krnFileSystemDriver.storeProgram(program, p2);
			tomem = krnFileSystemDriver.read(name);
			
			_readyqueue[r1].base = _readyqueue[r2].base;
			_readyqueue[r1].limit = _readyqueue[r2].limit;
			
			memManagementStoreProgram(tomem, p1);
			
		}
	
}