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
   // this.hardDrive = new hardDrive;
    
    //sizes for t,s,b
	this.numtracks = 4;
	this.numsectors = 8;
	this.numblocks = 8;
	this.blocksize = 64;
    
    //FS methods
    this.format = krnFSFormat;
    this.create = krnFSCreate;
    this.read = krnFSRead;
    this.write = krnFSWrite;
    this.del = krnFSDelete; //javascript doesn't like me using reserved words :c
    this.ls = krnFSLS;
    this.createDisplay = krnFSCreateDisplay;
    this.updateDisplay = krnFSUpdateDisplay;
    this.getBlock = krnFSGetNextEmptyBlock;
    	
}


//init
function krnFSDriverEntry()
{
	this.status = "loaded";
	
	//you said you're going to format at the start anyway, but to ensure nothing
	//breaks if/when testing is turned off...
	
	var initstatus = krnFSFormat('inital');
	
	if (initstatus == false)
		{
		_StdIn.putText("Error in initial format.");
		_StdIn.advanceLine();
		}else{
    		krnTrace("File System loaded successfully!")
		}
	
	
	//not really sure what else to add here...
}

function krnFSFormat(args)
{
	try
	{
		
		localStorage.clear();
		
		var key;
		var value;
		var t = 0;
		var s = 0;
		var b = 0;
		//init tracks
		for(t=0;t<4;t++)
		{
			//krnTrace("TRACK");
			//init sectors in each track
			for(s=0;s<8;s++)
			{
				//krnTrace("SECTOR");
				//init blocks in each sector
				for(b=0;b<8;b++)
				{
					//krnTrace("BLOCK");
					//make the tsb values into strings
					t2 = t.toString();
					s2 = s.toString();
					b2 = b.toString();
					
					key = [t2, s2, b2];
					
					//create the data for values
					var exists = 0;
					var track = -1;
					var sector = -1;
					var block = -1;
					//60 ` for now? might need to change this.
					var data = "````````````````````````````````````````````````````````````";
					
					//turn the values into strings
					var e = exists.toString();
					var track2 = track.toString();
					var sector2 = sector.toString();
					var block2 = block.toString();
					
					value = [e, track2, sector2, block2, data];
				
					localStorage[key] = value;
					//krnTrace("LOOK: " + localStorage[key]);
					
				}
			
				
			}
			
		}
		//create the data for mbr values
		var mbr1 = 0;
		var mbr2 = 0;
		var mbr3 = 0;
		
		mbrt = t.toString();
		mbrs = s.toString();
		mbrb = b.toString();
		
		var mbr = [mbrt, mbrs, mbrb];
		
		var mbrexists = 1;
		var mbrtrack = -1;
		var mbrsector = -1;
		var mbrblock = -1;
		var data = "mbr";

		//turn the values into strings
		var mbre = mbrexists.toString();
		var mbrtrack2 = mbrtrack.toString();
		var mbrsector2 = mbrsector.toString();
		var mbrblock2 = mbrblock.toString();

		localStorage[mbr] = [mbre, mbrtrack2, mbrsector2, mbrblock2, data];

		if (args.length > 0)
			{
			//krnTrace("GOING");
			//this.createDisplay;
			krnFSCreateDisplay();
			}else{
				//leaving this as create for now, may not need update.
				krnFSCreateDisplay();
			}
		
		return true;
	}
	catch(e)
	{
		return false;
	}
}

function krnFSCreate(file)
{
	var nextblock = krnFSGetNextEmptyBlock();
	var data;
	var decodedkey;
	
	//decode the key so we can use it
	decodedkey = nextblock.replace(/\]|\[|,/g, "");
	decodedkey = parseInt(decodedkey);
	
	var currentt = decodedkey[0];
	var currents = decodedkey[1];
	var currentb = decodedkey[2];

	
	if (nextblock != null && file.length < 60)
		{
			//data = localStorage[nextblock];
			//krnTrace("DATA1: " + data);
			//data[0] = "1";
			//krnTrace("DATA2: " + data);
			//localStorage[nextblock] = data;
			var exists = 1;
			var track = currentt;
			var sector = currents;
			var block = currentb;
			//60 ` for now? might need to change this.
			var data = "````````````````````````````````````````````````````````````";
			
			//turn the values into strings
			var e = exists.toString();
			var track2 = track.toString();
			var sector2 = sector.toString();
			var block2 = block.toString();
			
			value = [e, track2, sector2, block2, data];
		
			localStorage[key] = value;
			
			
		}
	
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

function krnFSGetNextEmptyBlock()
{
	var helddata;
	var exists;
	
	for(key in localStorage)
		{			
			helddata = localStorage[key];
			exists = helddata[0];
			
			if (exists == 0)
				{
					return(key);
				}
			
		}
	//didnt find an empty block so....return nothing
	return null;
}

function krnFSCreateDisplay()
{
	
	var fsDisplay = document.getElementById("fileSystemDisplay");
	fsDisplay.innerHTML = "<b> FILE SYSTEM </b>"; //clear it out
	var rows = [];
	var columns = [];
	var i = 0;

	var trackcount = 0;
	var sectorcount = 0;
	var blockcount = 0;
	var line;

	//krnTrace("LEN: " + localStorage.length);
	
	var trackcount2 = trackcount.toString();
	var sectorcount2 = sectorcount.toString();
	var blockcount2 = blockcount.toString();
	

	
	while (i <= localStorage.length)
		{
			keycount = [trackcount2, sectorcount2, blockcount2];
			
			var datdata = localStorage[keycount];
			//datdata = datdata.replace(/(\r\n|\n|\r)/gm,"");
			//console.log(datdata);
			
			line = "[" + trackcount + ",     " + sectorcount + ",     " + blockcount + "]  :  " + datdata;
			//console.log("LINE: " + line);
			fsDisplay.innerHTML = fsDisplay.innerHTML + "<div>" + line + "</div>";
			//fsDisplay.innerHTML = fsDisplay.innerHTML + "<div>" + "-"+ "</div>";
			blockcount++;
			if (blockcount > 7)
				{
					blockcount = 0;
					sectorcount++;
					if (sectorcount > 7)
						{
							sectorcount = 0;
							trackcount++;
						}
				}
			i++;
		}

	
	
}

function krnFSUpdateDisplay()
{

	
}


