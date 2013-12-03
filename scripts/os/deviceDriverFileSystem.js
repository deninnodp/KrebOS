/* ----------------------------------
   DeviceDriverFileSystem.js
   
   Requires deviceDriver.js
   
   The Kernel File System Device Driver.
   ---------------------------------- */

DeviceDriverFileSystem.prototype = new DeviceDriver;

function DeviceDriverFileSystem()
{
    // Override the base method pointers.
    this.driverEntry = krnFSDriverEntry;
    this.isr = null;
    
    //create a hard drive to be accessed
    this.hardDrive = new hardDrive;
    
    //FS methods
    this.format = krnFSFormat;
    this.create = krnFSCreate;
    this.read = krnFSRead;
    this.write = krnFSWrite;
    this.del = krnFSDelete; //javascript doesn't like me using reserved words :c
    this.ls = krnFSLS;
    
    	
}


//init
function krnFSDriverEntry()
{
	this.status = "loaded";
	
	//you said you're going to format at the start anyway, but to ensure nothing
	//breaks if/when testing is turned off...
	
	var initstatus = krnFSFormat();
	
	if (initstatus == false)
		{
		_StdIn.putText("Error in initial format.");
		_StdIn.advanceLine();
		}else{
    		krnTrace("File System loaded successfully!")
		}
	
	//not really sure what else to add here...
}

function krnFSFormat()
{
	try
	{
		localStorage.clear();
		return true;
	}
	catch(e)
	{
		return false;
	}
}

function krnFSCreate()
{
	
}

function krnFSRead()
{
	
}

function krnFSWrite()
{
	
}

function krnFSDelete()
{
	
}

function krnFSLS()
{
	
}

