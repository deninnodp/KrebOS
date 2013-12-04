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
    this.getBlock = krnFSGetNextEmptyBlock;
    this.getDirectoryBlock = krnFSGetNextEmptyDirectoryBlock;
    	
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
					
					//krnTrace("LOOK: " + key);
					
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
	var nextblock = null;
	var dir = null;
	nextblock = krnFSGetNextEmptyBlock();
	dir = krnFSGetNextEmptyDirectoryBlock();
	var data;
	var decodedkey;
	var decodedkey2;
	//decode the key so we can use it
	decodedkey2 = nextblock.replace(/\]|\[|,/g, "");
	decodedkey = parseInt(decodedkey2);
	
	var currentt = decodedkey2[0];
	var currents = decodedkey2[1];
	var currentb = decodedkey2[2];

	
	if (nextblock != null && dir != null && file.length <= 60)
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

			var data = "------------------------------------------------------------";
			var data2 = file;
			//turn the values into strings
			var e = exists.toString();
			var track2 = track.toString();
			var sector2 = sector.toString();
			var block2 = block.toString();
			
			krnTrace("DIR: " + dir + " FILE: " + nextblock);
			value = [e, track2, sector2, block2, data];
			dirvalue = [e, track2, sector2, block2, data2];
		
			localStorage[nextblock] = value;
			localStorage[dir] = dirvalue;
			
			krnFSCreateDisplay();
			return true;
		}else{
			_StdIn.putText("Error while creating file.");
			_StdIn.advanceLine();
			
			if (nextblock == null)
				{
				_StdIn.putText("No file blocks available.");
				_StdIn.advanceLine();
				}
			
			if (dir == null)
				{
				_StdIn.putText("No directory blocks available.");
				_StdIn.advanceLine();
				}
			if (file.length > 60)
				{
				_StdIn.putText("Filename is too long. Max 60 characters.");
				_StdIn.advanceLine();
				}
			return false;
		}
	
}

function krnFSRead(args)
{
	try
	{
		var decodedkey;
		var data;
		var data2;
		var filekey;
		var finaldata;
		
		for (key in localStorage)
			{
				//krnTrace("KETETE: " + key);
				//decode key so we can use it
				decodedkey = key.replace(/\]|\[|,/g, "");
				decodedkey = parseInt(decodedkey);
				
				//only care about directory data
				if (decodedkey <= 77 && decodedkey >= 0)
				{
					data = localStorage[key];
					var datasize = data.length;
					data2 = data.substring(8,datasize);
					
					//krnTrace("DATA2: " + data2);
					//krnTrace("ARGS: " + args);
					if (data2 == args)
						{
						filekey = data.substring(2,7);
						//filekey = "[" + filekey;
						//filekey = filekey + "]";
						//krnTrace("FILEKEY: " + filekey);
						
						finaldata = localStorage[filekey];
						datasize = finaldata.length;
						finaldata = finaldata.substring(8,datasize);
						
						return finaldata;
						}
				
					
				}
			}
	}
	catch(e)
	{
		return null;
	}

}

function krnFSWrite(filearg,dataarg)
{
	//reusing code from read for this
	try
	{
		var decodedkey;
		var decodedkey2;
		var data;
		var data2;
		var filekey;
		var finaldata;
		var keyz;
		
		for (key in localStorage)
			{
				//krnTrace("KETETE: " + key);
				//decode key so we can use it
				decodedkey2 = key.replace(/\]|\[|,/g, "");
				decodedkey = parseInt(decodedkey2);
			//	krnTrace("KETETE: " + decodedkey2);
				//only care about directory data
				if (decodedkey <= 77 && decodedkey >= 0)
				{
					data = localStorage[key];
					var datasize = data.length;
					data2 = data.substring(8,datasize);
					
				//	krnTrace("DATA2: " + data2);
				//	krnTrace("ARGS: " + filearg);
					if (data2 == filearg)
						{
						filekey = data.substring(2,7);
						//krnTrace("FILEKEY: " + filekey);
						decodedkey2 = filekey.replace(/\]|\[|,/g, "");
						decodedkey = parseInt(decodedkey2);
						//filekey = "[" + filekey;
						//filekey = filekey + "]";
						//krnTrace("FILEKEY: " + filekey);
						//krnTrace("FILEKEYsd: " + decodedkey2);
						//finaldata = localStorage[filekey];
						//datasize = finaldata.length;
						//finaldata = finaldata.substring(8,datasize);
						
						//prepare the new value to be written

						//decodedkey2 = nextblock.replace(/\]|\[|,/g, "");
						//decodedkey = parseInt(decodedkey2);
						//decodedkey2 = decodedkey.toString();
						var t = decodedkey2[0];
						var s = decodedkey2[1];
						var b = decodedkey2[2];
						
						krnTrace("T: " + t);
						krnTrace("S: " + s);
						krnTrace("B: " + b);
						
						var t2 = t.toString();
						var s2 = s.toString();
						var b2 = b.toString();
						
						//key = [t2, s2, b2];
					//	krnTrace("HELLO");
						//create the data for values
						var exists = 1;
						var track2 = t2;
						var sector2 = s2;
						var block2 = b2;
						//60 ` for now? might need to change this.
						var data = dataarg;
						
						keyz = [t2, s2, b2];
						
						//turn the values into strings
						var e = exists.toString();
						
						value = [e, track2, sector2, block2, data];
					
					//	krnTrace("VALU: " + value);
						
						localStorage[keyz] = value;
						
						krnFSCreateDisplay();
						
						return true;
						}
										
				}
			}
		
		_StdIn.putText("Could not find file with specified name.");
		_StdIn.advanceLine();
	}
	
	
	catch(e)
	{
		return false;
	}
	
}

function krnFSDelete(args)
{
	//borrow the code from read again
	try
	{
		var decodedkey;
		var data;
		var data2;
		var filekey;
		var finaldata;
		
		for (key in localStorage)
			{
				//krnTrace("KETETE: " + key);
				//decode key so we can use it
				decodedkey = key.replace(/\]|\[|,/g, "");
				decodedkey = parseInt(decodedkey);
				
				//only care about directory data
				if (decodedkey <= 77 && decodedkey >= 0)
				{
					data = localStorage[key];
					var datasize = data.length;
					data2 = data.substring(8,datasize);
					
					krnTrace("DATA2: " + data2);
					krnTrace("ARGS: " + args);
					if (data2 == args)
						{
						
						filekey = data.substring(2,7);

						decodedkey2 = filekey.replace(/\]|\[|,/g, "");
						decodedkey = parseInt(decodedkey2);
						
						var t = decodedkey2[0];
						var s = decodedkey2[1];
						var b = decodedkey2[2];
						
						//krnTrace("T: " + t);
						//krnTrace("S: " + s);
						//krnTrace("B: " + b);
						
						var t2 = t.toString();
						var s2 = s.toString();
						var b2 = b.toString();
						
						//key = [t2, s2, b2];
						//krnTrace("HELLO");
						//create the data for values
						var exists = 0;
						var track2 = -1;
						var sector2 = -1;
						var block2 = -1;
						//60 ` for now? might need to change this.
						var data = "````````````````````````````````````````````````````````````";
						
						keyz = [t2, s2, b2];
						
						//turn the values into strings
						var e = exists.toString();
						
						value = [e, track2, sector2, block2, data];
					
						krnTrace("VALU: " + value);
						
						localStorage[keyz] = value;
						localStorage[key] = value;
						
						krnFSCreateDisplay();
						
						return true;
						}
				
					
				}
			}
		
		_StdIn.putText("Could not find file with specified name.");
		_StdIn.advanceLine();
	}
	catch(e)
	{
		return false;
	}
	
}

function krnFSLS()
{
	try
	{
		var decodedkey;
		var data;
		var data2;
		var filekey;
		var finaldata;
		var exists;
		var list = new Array();
		
		for (key in localStorage)
			{
				//krnTrace("KETETE: " + key);
				//decode key so we can use it
				decodedkey = key.replace(/\]|\[|,/g, "");
				decodedkey = parseInt(decodedkey);
				
				//only care about directory data
				if (decodedkey <= 77 && decodedkey >= 0)
				{
					data = localStorage[key];
					var datasize = data.length;
					data2 = data.substring(8,datasize);
					exists = data[0];
					//krnTrace("DATA2: " + data2);
					//krnTrace("ARGS: " + args);
					if (exists == 1)
						{
						filekey = data.substring(2,7);
						//filekey = "[" + filekey;
						//filekey = filekey + "]";
						//krnTrace("FILEKEY: " + filekey);
						krnTrace("HELLO");
						list.push(data2);
						
						//finaldata = localStorage[filekey];
						//datasize = finaldata.length;
						//finaldata = finaldata.substring(8,datasize);
						
						}
				
					
				}
			}
		return list;
	}
	catch(e)
	{
		return null;
	}
}

function krnFSGetNextEmptyBlock()
{
	var helddata;
	var exists;
	
	for(key in localStorage)
		{			
		
			//decode the key so we can use it
			decodedkey = key.replace(/\]|\[|,/g, "");
			decodedkey = parseInt(decodedkey);
			//make sure this is a file
			//krnTrace("KEY: " + key);
			if (decodedkey <= 400 && decodedkey >= 100)
			{
				//krnTrace("IM INNNNNNNNNNNNN");
				helddata = localStorage[key];
				exists = helddata[0];
				
				if (exists == 0)
					{
						return(key);
					}
			}
			
		}
	//didnt find an empty block so....return nothing
	return null;
}

function krnFSGetNextEmptyDirectoryBlock()
{
	var helddata;
	var exists;
	
	for(key in localStorage)
		{	
			//decode the key so we can use it
			decodedkey = key.replace(/\]|\[|,/g, "");
			decodedkey = parseInt(decodedkey);
			//make sure this is a directory
			if (decodedkey <= 77 && decodedkey >= 0)
			{
				helddata = localStorage[key];
				exists = helddata[0];
				
				if (exists == 0)
					{
						return(key);
					}
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
	

	while (i <= localStorage.length-2)
		{
			var trackcount2 = trackcount.toString();
			var sectorcount2 = sectorcount.toString();
			var blockcount2 = blockcount.toString();
		
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



