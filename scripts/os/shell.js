/* ------------
   Shell.js
   
   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

function Shell() {
    // Properties
    this.promptStr   = ">";
    this.commandList = [];
    this.curses      = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
    this.apologies   = "[sorry]";
    // Methods
    this.init        = shellInit;
    this.putPrompt   = shellPutPrompt;
    this.handleInput = shellHandleInput;
    this.execute     = shellExecute;
}

function shellInit() {
    var sc = null;
    //
    // Load the command list.

    // ver
    sc = new ShellCommand();
    sc.command = "ver";
    sc.description = "- Displays the current version data.";
    sc.function = shellVer;
    this.commandList[this.commandList.length] = sc;
    
    // help
    sc = new ShellCommand();
    sc.command = "help";
    sc.description = "- This is the help command. Seek help.";
    sc.function = shellHelp;
    this.commandList[this.commandList.length] = sc;
    
    // shutdown
    sc = new ShellCommand();
    sc.command = "shutdown";
    sc.description = "- Shuts down the virtual OS but leaves the underlying hardware simulation running.";
    sc.function = shellShutdown;
    this.commandList[this.commandList.length] = sc;

    // cls
    sc = new ShellCommand();
    sc.command = "cls";
    sc.description = "- Clears the screen and resets the cursor position.";
    sc.function = shellCls;
    this.commandList[this.commandList.length] = sc;

    // man <topic>
    sc = new ShellCommand();
    sc.command = "man";
    sc.description = "<topic> - Displays the MANual page for <topic>.";
    sc.function = shellMan;
    this.commandList[this.commandList.length] = sc;
    
    // trace <on | off>
    sc = new ShellCommand();
    sc.command = "trace";
    sc.description = "<on | off> - Turns the OS trace on or off.";
    sc.function = shellTrace;
    this.commandList[this.commandList.length] = sc;

    // rot13 <string>
    sc = new ShellCommand();
    sc.command = "rot13";
    sc.description = "<string> - Does rot13 obfuscation on <string>.";
    sc.function = shellRot13;
    this.commandList[this.commandList.length] = sc;

    // prompt <string>
    sc = new ShellCommand();
    sc.command = "prompt";
    sc.description = "<string> - Sets the prompt.";
    sc.function = shellPrompt;
    this.commandList[this.commandList.length] = sc;
    
    // date
    sc = new ShellCommand();
    sc.command = "date";
    sc.description = "- Displays the current date and time";
    sc.function = shellDate;
    this.commandList[this.commandList.length] = sc;
    
    // whereami
    sc = new ShellCommand();
    sc.command = "whereami";
    sc.description = " - Displays the current user's location";
    sc.function = shellWhere;
    this.commandList[this.commandList.length] = sc;
    
    // flip <string>
    sc = new ShellCommand();
    sc.command = "flip";
    sc.description = "<string> - Flips any string";
    sc.function = shellFlip;
    this.commandList[this.commandList.length] = sc;
    
    // BSOD
    sc = new ShellCommand();
    sc.command = "bluescreen";
    sc.description = "Causes the OS to bluescreen";
    sc.function = shellBSOD;
    this.commandList[this.commandList.length] = sc;
    
    // load <pid>
    sc = new ShellCommand();
    sc.command = "load";
    sc.description = "<priority(default 2)> - Loads a user program from the program input textarea into memory.";
    sc.function = shellLoad;
    this.commandList[this.commandList.length] = sc;
    
    // run <pid>
	sc = new ShellCommand();
    sc.command = "run";
    sc.description = "<pid> - run a program already in memory.";
    sc.function = shellRun;
    this.commandList[this.commandList.length] = sc;
    
    // runall <pid>
	sc = new ShellCommand();
    sc.command = "runall";
    sc.description = "- run all programs already in memory.";
    sc.function = shellRunAll;
    this.commandList[this.commandList.length] = sc;

    // status
    sc = new ShellCommand();
    sc.command = "status";
    sc.description = "- sets the status message on the taskbar.";
    sc.function = shellSetStatus;
    this.commandList[this.commandList.length] = sc;
    
    // set quantum
    sc = new ShellCommand();
    sc.command = "quantum";
    sc.description = "<int> - sets the round robin quantum (default 6)";
    sc.function = shellSetQuantum;
    this.commandList[this.commandList.length] = sc;
    
    // ps
    sc = new ShellCommand();
    sc.command = "ps";
    sc.description = "lists running processes.";
    sc.function = shellps;
    this.commandList[this.commandList.length] = sc;
    
    // kill
    sc = new ShellCommand();
    sc.command = "kill";
    sc.description = "<pid> - kills a process with the given pid.";
    sc.function = shellKill;
    this.commandList[this.commandList.length] = sc;
    
    // swapmode
    sc = new ShellCommand();
    sc.command = "swapmode";
    sc.description = "Swaps the execution mode between FCFS and RR - deprecated.";
    sc.function = shellSwapMode;
    this.commandList[this.commandList.length] = sc;
    
    // setschedule
    sc = new ShellCommand();
    sc.command = "setschedule";
    sc.description = "<rr, fcfs, priority> - changes the current scheduling algorithm.";
    sc.function = shellSetSchedule;
    this.commandList[this.commandList.length] = sc;
    
    // create
    sc = new ShellCommand();
    sc.command = "create";
    sc.description = "<filename> - creates a file with the given name.";
    sc.function = shellCreate;
    this.commandList[this.commandList.length] = sc;
    
    // read
    sc = new ShellCommand();
    sc.command = "read";
    sc.description = "<filename> - Displays the content of the given file.";
    sc.function = shellRead;
    this.commandList[this.commandList.length] = sc;
    
    // write
    sc = new ShellCommand();
    sc.command = "write";
    sc.description = "<filename> \"data\" - write the data inside the quotes to the given file.";
    sc.function = shellWrite;
    this.commandList[this.commandList.length] = sc;
    
    // delete
    sc = new ShellCommand();
    sc.command = "delete";
    sc.description = "<filename> - removes the given file from storage.";
    sc.function = shellDelete;
    this.commandList[this.commandList.length] = sc;

    // format
    sc = new ShellCommand();
    sc.command = "format";
    sc.description = "Swaps the execution mode between FCFS and RR";
    sc.function = shellFormat;
    this.commandList[this.commandList.length] = sc;
    
    //ls
    sc = new ShellCommand();
    sc.command = "ls";
    sc.description = "list files currently on the disk.";
    sc.function = shellLS;
    this.commandList[this.commandList.length] = sc;
    
    // getschedule
    sc = new ShellCommand();
    sc.command = "getschedule";
    sc.description = "Returns the scheduling algorithm currently in use.";
    sc.function = shellGetSchedule;
    this.commandList[this.commandList.length] = sc;
    
    // Display the initial prompt.
    this.putPrompt();
}

function shellPutPrompt()
{
    _StdIn.putText(this.promptStr);
}

function shellHandleInput(buffer)
{
    krnTrace("Shell Command~" + buffer);
    // 
    // Parse the input...
    //
    historyarray[historyindex] = buffer;
    historyindex++;
    
    var userCommand = new UserCommand();
    userCommand = shellParseInput(buffer);
    // ... and assign the command and args to local variables.
    var cmd = userCommand.command;
    var args = userCommand.args;
    //
    // Determine the command and execute it.
    //
    // JavaScript may not support associative arrays in all browsers so we have
	// to
    // iterate over the command list in attempt to find a match. TODO: Is there
	// a better way? Probably.
    var index = 0;
    var found = false;
    while (!found && index < this.commandList.length)
    {
        if (this.commandList[index].command === cmd)
        {
            found = true;
            var fn = this.commandList[index].function;
        }
        else
        {
            ++index;
        }
    }
    if (found)
    {
        this.execute(fn, args);
    }
    else
    {
        // It's not found, so check for curses and apologies before declaring
		// the command invalid.
        if (this.curses.indexOf("[" + rot13(cmd) + "]") >= 0)      // Check for
																	// curses.
        {
            this.execute(shellCurse);
        }
        else if (this.apologies.indexOf("[" + cmd + "]") >= 0)      // Check for
																	// apologies.
        {
            this.execute(shellApology);
        }
        else    // It's just a bad command.
        {
            this.execute(shellInvalidCommand);
        }
    }
}

function shellParseInput(buffer)
{
    var retVal = new UserCommand();

    // 1. Remove leading and trailing spaces.
    buffer = trim(buffer);

    // 2. Lower-case it.
    buffer = buffer.toLowerCase();

    // 3. Separate on spaces so we can determine the command and command-line
	// args, if any.
    var tempList = buffer.split(" ");

    // 4. Take the first (zeroth) element and use that as the command.
    var cmd = tempList.shift();  // Yes, you can do that to an array in
									// JavaScript. See the Queue class.
    // 4.1 Remove any left-over spaces.
    cmd = trim(cmd);
    // 4.2 Record it in the return value.
    retVal.command = cmd;

    // 5. Now create the args array from what's left.
    for (var i in tempList)
    {
        var arg = trim(tempList[i]);
        if (arg != "")
        {
            retVal.args[retVal.args.length] = tempList[i];
        }
    }
    return retVal;
}

function shellExecute(fn, args)
{
    // We just got a command, so advance the line...
    _StdIn.advanceLine();
    // ... call the command function passing in the args...
    fn(args);
    // Check to see if we need to advance the line again
    if (_StdIn.CurrentXPosition > 0)
    {
        _StdIn.advanceLine();
    }
    // ... and finally write the prompt again.
    this.putPrompt();
}


//
// The rest of these functions ARE NOT part of the Shell "class" (prototype,
// more accurately),
// as they are not denoted in the constructor. The idea is that you cannot
// execute them from
// elsewhere as shell.xxx . In a better world, and a more perfect JavaScript,
// we'd be
// able to make then private. (Actually, we can. have a look at Crockford's
// stuff and Resig's JavaScript Ninja cook.)
//

//
// An "interior" or "private" class (prototype) used only inside Shell() (we
// hope).
//
function ShellCommand()     
{
    // Properties
    this.command = "";
    this.description = "";
    this.function = "";
}

//
// Another "interior" or "private" class (prototype) used only inside Shell()
// (we hope).
//
function UserCommand()
{
    // Properties
    this.command = "";
    this.args = [];
}


//
// Shell Command Functions. Again, not part of Shell() class per se', just
// called from there.
//
function shellInvalidCommand()
{
    _StdIn.putText("Invalid Command. ");
    if (_SarcasticMode)
    {
        _StdIn.putText("Duh. Go back to your Speak & Spell.");
    }
    else
    {
        _StdIn.putText("Type 'help' for, well... help.");
    }
}

function shellCurse()
{
    _StdIn.putText("Oh, so that's how it's going to be, eh? Fine.");
    _StdIn.advanceLine();
    _StdIn.putText("Bitch.");
    _SarcasticMode = true;
}

function shellApology()
{
   if (_SarcasticMode) {
      _StdIn.putText("Okay. I forgive you. This time.");
      _SarcasticMode = false;
   } else {
      _StdIn.putText("For what?");
   }
}

function shellVer(args)
{
    _StdIn.putText(APP_NAME + " version " + APP_VERSION);    
}

function shellHelp(args)
{
    _StdIn.putText("Commands:");
    for (var i in _OsShell.commandList)
    {
        _StdIn.advanceLine();
        _StdIn.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
    }    
}

function shellShutdown(args)
{
     _StdIn.putText("Shutting down...");
     // Call Kernel shutdown routine.
    krnShutdown();   
    // TODO: Stop the final prompt from being displayed. If possible. Not a high
	// priority. (Damn OCD!)
}

function shellCls(args)
{
    _StdIn.clearScreen();
    _StdIn.resetXY();
}

function shellMan(args)
{
    if (args.length > 0)
    {
        var topic = args[0];
        switch (topic)
        {
            case "help": 
                _StdIn.putText("Help displays a list of (hopefully) valid commands.");
                break;
            default:
                _StdIn.putText("No manual entry for " + args[0] + ".");
        }        
    }
    else
    {
        _StdIn.putText("Usage: man <topic>  Please supply a topic.");
    }
}

function shellTrace(args)
{
    if (args.length > 0)
    {
        var setting = args[0];
        switch (setting)
        {
            case "on": 
                if (_Trace && _SarcasticMode)
                {
                    _StdIn.putText("Trace is already on, dumbass.");
                }
                else
                {
                    _Trace = true;
                    _StdIn.putText("Trace ON");
                }
                
                break;
            case "off": 
                _Trace = false;
                _StdIn.putText("Trace OFF");                
                break;                
            default:
                _StdIn.putText("Invalid arguement.  Usage: trace <on | off>.");
        }        
    }
    else
    {
        _StdIn.putText("Usage: trace <on | off>");
    }
}

function shellRot13(args)
{
    if (args.length > 0)
    {
        _StdIn.putText(args[0] + " = '" + rot13(args[0]) +"'");     // Requires
																	// Utils.js
																	// for
																	// rot13()
																	// function.
    }
    else
    {
        _StdIn.putText("Usage: rot13 <string>  Please supply a string.");
    }
}

function shellPrompt(args)
{
    if (args.length > 0)
    {
        _OsShell.promptStr = args[0];
    }
    else
    {
        _StdIn.putText("Usage: prompt <string>  Please supply a string.");
    }
}

function shellDate()
{
	var currentTime = new Date();
	_StdIn.putText("Current date and time: " + currentTime + "");
	
}

function shellWhere()
{
	_StdIn.putText("You're traveling through another dimension.");
	_StdIn.advanceLine();
	_StdIn.putText("A dimension not only of sight and sound but of mind.");
}

function shellFlip(args)
{
	if (args.length > 0)
		{
		  var  stri = "";
		  var  alen = args[0].length;
		  for (var i = alen ; i > 0 ; i--){
		        stri += args[0].charAt(i-1);
		   }
		  _StdIn.putText("" + stri + "");
		}else
			{
				_StdIn.putText("Please choose a valid string");
			}
}

function shellBSOD(args)
{
	krnTrapError("User evoked bluescreen command!");
}

function shellLoad(args)
{

	if (args.length > 0)
		{
		
		if (isNumber(args) == true)
			{
			// This time around I wrote a much more robust checking program.
			var input = document.getElementById("taProgramInput").value; // grab
																			// input
			krnTrace(input);
			input2 = input.replace(/\s/g,''); // remove spaces to make the regex
												// cleaner/simpler
			krnTrace(input2);
			// this pattern will verify not only that the values are hex, but that they
			// are
			// in the right format: Opcode must be first, and will verify that the
			// correct
			// argument size is used after as well.
		
			//var patt =/(?:A9..|AD....|8D....|6D....|A2..|AE....|A0..|AC....|EA|00|EC....|D0..|EE....|FF)+/;
		    
			//looks like my previous regex was too robust, I forgot that 
			//you can have data already loaded into a program beforehand.
			//So, I'll just use a generic Hex-only regex string.
			
			var patt =/\b[0-9A-F]+\b/gi;
		    var result = patt.exec(input2);
		    krnTrace(result);
		    
		    // if a valid program cannot be matched, ignore it.
		    if (result != input2)
		    	{
		    		_StdIn.putText("Invalid Program. Please try again.");
		    	//	krnTrace("User entered invalid program, disregarding.");
		    	}else if (result == input2)
		    		{
			    		_StdIn.putText("Program Valid. Loading...");
			    		_StdIn.advanceLine();
			    		//set PID
		
			    		if (pid_next == 3)
			    			{
			    				pid_next = 0;
			    			}
			    		
			    		current_pid = pid_next;
			    		krnTrace("PID" + current_pid);
			    		//current_pid = args;
		
			    		_program_queue[current_pid] = new pcb(0,current_pid,0,0,255,0);
			    		_current_pcb = _program_queue[current_pid];
		
			    		//store that bad boy in memory!
			    		_memManagement.storeProgram(input, current_pid);
			    		//update registers on load (basically all 0)
			    		_current_pcb.priority = args;
			    		_pcDisplay.innerHTML=_current_pcb.pc;
			    		_accDisplay.innerHTML=_current_pcb.acc;
			    		_xDisplay.innerHTML=_current_pcb.x;
			    		_yDisplay.innerHTML=_current_pcb.y;
			    		_zDisplay.innerHTML=_current_pcb.z;
			    		rdytorun = true;
			    		_StdOut.putText("Program loaded. Type 'run " + current_pid + "' to execute");
		
			    		//advance next PID
			    		pid_next = current_pid+1;
		    		}
			}else{
	    		_StdIn.putText("Please enter a number for the priority.");
	    		_StdIn.advanceLine();
			}
		}else{
			
				var input = document.getElementById("taProgramInput").value; // grab
				// input
				krnTrace(input);
				input2 = input.replace(/\s/g,''); // remove spaces to make the regex
				// cleaner/simpler
				krnTrace(input2);
				// this pattern will verify not only that the values are hex, but that they
				// are
				// in the right format: Opcode must be first, and will verify that the
				// correct
				// argument size is used after as well.
				
				//var patt =/(?:A9..|AD....|8D....|6D....|A2..|AE....|A0..|AC....|EA|00|EC....|D0..|EE....|FF)+/;
				
				//looks like my previous regex was too robust, I forgot that 
				//you can have data already loaded into a program beforehand.
				//So, I'll just use a generic Hex-only regex string.
				
				var patt =/\b[0-9A-F]+\b/gi;
				var result = patt.exec(input2);
				krnTrace(result);
				
				// if a valid program cannot be matched, ignore it.
				if (result != input2)
				{
				_StdIn.putText("Invalid Program. Please try again.");
				//	krnTrace("User entered invalid program, disregarding.");
				}else if (result == input2)
				{
				_StdIn.putText("Program Valid. Loading...");
				_StdIn.advanceLine();
				//set PID
				
				if (pid_next == 3)
				{
				pid_next = 0;
				}
				
				current_pid = pid_next;
				krnTrace("PID" + current_pid);
				//current_pid = args;
				
				_program_queue[current_pid] = new pcb(0,current_pid,0,0,255,0);
				_current_pcb = _program_queue[current_pid];
				
				//store that bad boy in memory!
				_memManagement.storeProgram(input, current_pid);
				//update registers on load (basically all 0)
				_current_pcb.priority = 2;
				_pcDisplay.innerHTML=_current_pcb.pc;
				_accDisplay.innerHTML=_current_pcb.acc;
				_xDisplay.innerHTML=_current_pcb.x;
				_yDisplay.innerHTML=_current_pcb.y;
				_zDisplay.innerHTML=_current_pcb.z;
				rdytorun = true;
				_StdOut.putText("Program loaded. Type 'run " + current_pid + "' to execute");
				
				//advance next PID
				pid_next = current_pid+1;
				}
	}
}

function shellRun(args)
{
	//make sure there is an ID
	if((args[0] == null) || (args[0] > pid_next))
	{
		_StdOut.putText("Please enter a proper proccess ID");
	} else 
	{
		if (rdytorun == true)
			{
				_current_pcb = _program_queue[args[0]];
				//_current_pcb.state = "RUNNING";
				_readyqueue.push(_current_pcb);
				//krnTrace(_readyqueue[0].state);
				_cpu.exec(); // LETS DO THIS LEEEEROOOOOYYYY JENKINSSSSSSS (run)
				_program_queue[current_pid] = _current_pcb;
			}else{
				_StdIn.advanceLine();
				_StdIn.putText("Load a program first!");
			}
	}
}

//everyone runs, its like a race
function shellRunAll()
{
	if (rdytorun == true)
	{
		//for (var ij=0;ij<_program_queue.length;ij++)
		//	{
		//	krnTrace("HOLA");
			if (_program_queue[0] != null)
				{
				_current_pcb = _program_queue[0];
				_current_pcb.state = "READY";
				_current_pcb.pid = 0;
				_current_pcb.display();
				_readyqueue.push(_current_pcb);
				}
			if (_program_queue[1] != null)
			{
				_current_pcb = _program_queue[1];
				_current_pcb.state = "READY";
				_current_pcb.base = "256";
				_current_pcb.limit = "511";
				_current_pcb.pid = 1;
				_current_pcb.display();
				_readyqueue.push(_current_pcb);
			}
			if (_program_queue[2] != null)
			{
				_current_pcb = _program_queue[2];
				_current_pcb.state = "READY";
				_current_pcb.base = "512";
				_current_pcb.limit = "767";
				_current_pcb.pid = 2;
				_current_pcb.display();
				_readyqueue.push(_current_pcb);
			}
			
			_cpu.exec();
			//_program_queue[current_pid] = _current_pcb;
			//}
	}else{
		_StdIn.advanceLine();
		_StdIn.putText("Load a program first!");
	}
	
}


function shellSetStatus(args)
{
	taskBarClearScreen();
  var statusMessage = "";

  // Concatenate all the arguments together
  for (x in args) 
  {
      // statusMessage += ' ';

    statusMessage += args[x] + " ";
  }
  this.statusMessage = statusMessage;

  var currentTime = new Date();
  var month = currentTime.getMonth() + 1;
  var day = currentTime.getDate();
  var year = currentTime.getFullYear();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();
  if (minutes < 10)
  {
	  minutes = "0" + minutes;
  }
  
  
  // Write the status
  _TaskBar.putText("Status: " + month + "/" + day + "/" + year + " " + hours + ":" + minutes + " " + statusMessage);
 
}

function shellSetQuantum(args)
{
	if (isNumber(args) == true)
		{
			rrquantum = args;
			_scheduler.quantum = args;
			_StdIn.putText("Set quantum to " + args + ".");
		
		}else{
			_StdIn.putText("Please enter a number.");
			}

}

function shellps()
{

	if (_readyqueue.length != 0)
		{
			for(var cf=0;cf<_readyqueue.length;cf++)
				{
				
					if (_readyqueue[cf].state == "RUNNING")
						{
							_StdIn.putText("Running: " + _readyqueue[cf].pid);
							_StdIn.advanceLine();
						}else{
							_StdIn.putText("Running: None");
							_StdIn.advanceLine();
						}
				}
		}else{
			_StdIn.putText("Running: None");
			_StdIn.advanceLine();
		}
}

function shellKill(args)
{
	if (_cpu.isExecuting)
		{
			//krnTrace("DFSDGFDGHD " + _current_pcb.pid);
			//krnTrace("DFSDGFDGHD2 " + args);
			if (parseInt(_current_pcb.pid) == parseInt(args))
				{
					_cpu.isExecuting = false;
					_StdIn.putText("Killing process " + args + "...");
					_StdIn.advanceLine();
					//_current_pcb = this.pcb
					_current_pcb.state = "TERMINATED";
					_current_pcb.display();
					//_readyqueue.shift();
					_StdIn.putText("Program " + args + " terminated by user.");
					_StdIn.advanceLine();
				}else{
					_StdIn.putText("Error: Given process not running.");
					_StdIn.advanceLine();
				}
		
		}else{
			_StdIn.putText("Error: No processes running.");
			_StdIn.advanceLine();
		}
}

//now deprecated, keeping anyway
function shellSwapMode(args)
{
	if (_cpu.isExecuting == false)
		{
			if (_scheduler.executionmode == "FCFS")
				{
					_scheduler.executionmode = "RR";
					_StdIn.putText("Mode set to Round Robin.");
					_StdIn.advanceLine();
					
				}else if (_scheduler.executionmode == "RR"){
					_scheduler.executionmode = "FCFS";
					_StdIn.putText("Mode set to FCFS.");
					_StdIn.advanceLine();
				}
		}else{
			_StdIn.putText("Can't do that while executing!");
			_StdIn.advanceLine();
		}
}

function shellSetSchedule(args)
{
	if (args == "rr")
		{
			_scheduler.executionmode = "RR";
			_StdIn.putText("Mode set to Round Robin.");
			_StdIn.advanceLine();
		}else if (args == "fcfs")
			{
				_scheduler.executionmode = "FCFS";
				_StdIn.putText("Mode set to FCFS.");
				_StdIn.advanceLine();
			}else if (args == "priority")
				{
					_scheduler.executionmode = "PRIORITY";
					_StdIn.putText("Mode set to Priority.");
					_StdIn.advanceLine();
				}else{
					_StdIn.putText("Please enter a valid algorithm name. (Reference help)");
					_StdIn.advanceLine();
				}
	
}

function shellGetSchedule()
{
	if (_scheduler.executionmode == "RR")
	{
		_StdIn.putText("Current mode is Round Robin.");
		_StdIn.advanceLine();
	}else if (_scheduler.executionmode == "FCFS")
		{
			_StdIn.putText("Current mode is FCFS.");
			_StdIn.advanceLine();
		}else if (_scheduler.executionmode == "PRIORITY")
			{
				_StdIn.putText("Current mode is Priority.");
				_StdIn.advanceLine();
			}
}

function shellCreate(args)
{
	var file = args[0];
	
	if (file != "" && file != null)
		{
			var success = krnFileSystemDriver.create(file);
			
			if (success == true)
				{
				_StdIn.putText("Created a file named " + file);
				_StdIn.advanceLine();
				}else{
					_StdIn.putText("File creation failed.");
					_StdIn.advanceLine();
				}
		}else{
			_StdIn.putText("Please enter a valid filename.");
			_StdIn.advanceLine();
		}
}

function shellRead(args)
{
	var file = args.join(" ");
	
	if ( file != "" && file != null)
		{
			var contents = krnFileSystemDriver.read(file);
			
			if (contents != null)
				{
				_StdIn.putText(contents);
				_StdIn.advanceLine();
				}
		}else{
			_StdIn.putText("Please enter a valid filename.");
			_StdIn.advanceLine();
			}
}

function shellWrite(args)
{
	
}

function shellDelete(args)
{
	
}

function shellFormat()
{
	var formatstatus = krnFileSystemDriver.format();
	
	if (formatstatus)
		{
			_StdIn.putText("Format Successful.");
			_StdIn.advanceLine();
		}else{
    		_StdIn.putText("Format was not successful.");
    		_StdIn.advanceLine();
		}
	
}

function shellLS()
{
	
}


function isNumber(n) {
	  
	return !isNaN(parseInt(n)) && isFinite(n);
}



