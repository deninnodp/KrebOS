/* ------------
   Kernel.js
   
   Requires globals.js
   
   Routines for the Operating System, NOT the host.
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// OS Startup and Shutdown Routines   
//
function krnBootstrap() // Page 8.
{
	hostLog("bootstrap", "host"); // Use hostLog because we ALWAYS want this, even if _Trace is off.

	// Initialize our global queues.
	_KernelInterruptQueue = new Queue(); // A (currently) non-priority queue for interrupt requests (IRQs).
	_KernelBuffers = new Array(); // Buffers... for the kernel.
	_KernelInputQueue = new Queue(); // Where device input lands before being processed out somewhere.
	_Console = new CLIconsole(); // The command line interface / console I/O device.

	//Initialize the taskbar
	_TaskBar = new TaskBar();
	_TaskBar.init();

	// Initialize the CLIconsole.
	_Console.init();

	// Initialize standard input and output to the _Console.
	_StdIn = _Console;
	_StdOut = _Console;

	_mainMem = new mainMem();
	_mainMem.init();

	_memManagement = new memManagement();

	_current_pcb = new pcb();

	_cpu = new cpu();
	_cpu.init();
	
	_scheduler = new scheduler();
	
	//_readyqueue = new Queue();
	

	_pcDisplay = document.getElementById("tdPC");
	_accDisplay = document.getElementById("tdACC");
	_xDisplay = document.getElementById("tdX");
	_yDisplay = document.getElementById("tdY");
	_zDisplay = document.getElementById("tdZ");
	
	_pcDisplay0 = document.getElementById("tdPC0");
	_accDisplay0 = document.getElementById("tdACC0");
	_xDisplay0 = document.getElementById("tdX0");
	_yDisplay0 = document.getElementById("tdY0");
	_zDisplay0 = document.getElementById("tdZ0");
	
	_pcDisplay1 = document.getElementById("tdPC1");
	_accDisplay1 = document.getElementById("tdACC1");
	_xDisplay1 = document.getElementById("tdX1");
	_yDisplay1 = document.getElementById("tdY1");
	_zDisplay1 = document.getElementById("tdZ1");
	
	_pcDisplay2 = document.getElementById("tdPC2");
	_accDisplay2 = document.getElementById("tdACC2");
	_xDisplay2 = document.getElementById("tdX2");
	_yDisplay2 = document.getElementById("tdY2");
	_zDisplay2 = document.getElementById("tdZ2");
	
	_pcDisplay3 = document.getElementById("tdPC3");
	_accDisplay3 = document.getElementById("tdACC3");
	_xDisplay3 = document.getElementById("tdX3");
	_yDisplay3 = document.getElementById("tdY3");
	_zDisplay3 = document.getElementById("tdZ3");
	
	_stateDisplay0 = document.getElementById("tdSTATE0");
	_baseDisplay0 = document.getElementById("tdBASE0");
	_limitDisplay0 = document.getElementById("tdLIMIT0");
	
	_stateDisplay1 = document.getElementById("tdSTATE1");
	_baseDisplay1 = document.getElementById("tdBASE1");
	_limitDisplay1 = document.getElementById("tdLIMIT1");
	
	_stateDisplay2 = document.getElementById("tdSTATE2");
	_baseDisplay2 = document.getElementById("tdBASE2");
	_limitDisplay2 = document.getElementById("tdLIMIT2");
	
	_stateDisplay3 = document.getElementById("tdSTATE3");
	_baseDisplay3 = document.getElementById("tdBASE3");
	_limitDisplay3 = document.getElementById("tdLIMIT3");

	// Load the Keyboard Device Driver
	krnTrace("Loading the keyboard device driver.");
	krnKeyboardDriver = new DeviceDriverKeyboard(); // Construct it.  TODO: Should that have a _global-style name?
	krnKeyboardDriver.driverEntry(); // Call the driverEntry() initialization routine.
	krnTrace(krnKeyboardDriver.status);

	
	krnTrace("Loading the File System device driver.");
    krnFileSystemDriver = new DeviceDriverFileSystem();     // Construct it.  TODO: Should that have a _global-style name?
    krnFileSystemDriver.driverEntry();                    // Call the driverEntry() initialization routine.
    krnTrace(krnFileSystemDriver.status);
	//
	// ... more?
	//

	// Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
	krnTrace("Enabling the interrupts.");
	krnEnableInterrupts();

	// Launch the shell.
	krnTrace("Creating and Launching the shell.");
	_OsShell = new Shell();
	_OsShell.init();

	// Finally, initiate testing.
	if (_GLaDOS) {
		_GLaDOS.afterStartup();
	}
}

function krnShutdown() {
	krnTrace("begin shutdown OS");
	// TODO: Check for running processes.  Alert if there are some, alert and stop.  Else...    
	// ... Disable the Interrupts.
	krnTrace("Disabling the interrupts.");
	krnDisableInterrupts();
	// 
	// Unload the Device Drivers?
	// More?
	//
	krnTrace("end shutdown OS");
}

function krnOnCPUClockPulse() {
	//Update the register displays
	/*
	_pcDisplay.innerHTML=_current_pcb.program_counter;
	_accDisplay.innerHTML=_current_pcb.accum;
	_xDisplay.innerHTML=_current_pcb.xreg;
	_yDisplay.innerHTML=_current_pcb.yreg;
	_zDisplay.innerHTML=_current_pcb.Zflag;
	 */

	if (counteri < 9) {
		counteri++;
	} else {
		//krnTrace("hello");
		//_Taskbar.clockTick();
		krnInterruptHandler(TIMER_IRQ, "params");
		//clockTick();
		counteri = 0;
	}
	/* This gets called from the host hardware sim every time there is a hardware clock pulse.
	   This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
	   This, on the other hand, is the clock pulse from the hardware (or host) that tells the kernel 
	   that it has to look for interrupts and process them if it finds any.                           */

	// Check for an interrupt, are any. Page 560
	if (_KernelInterruptQueue.getSize() > 0) {
		krnTrace("queue");
		// Process the first interrupt on the interrupt queue.
		// TODO: Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
		var interrupt = _KernelInterruptQueue.dequeue();
		krnInterruptHandler(interrupt.irq, interrupt.params);
	} else if (_cpu.isExecuting) // If there are no interrupts then run one CPU cycle if there is anything being processed.
	{
		if (step == false) {
			_cpu.iterate();
		}
	} else // If there are no interrupts and there is nothing being executed then just be idle.
	{
		krnTrace("Idle");
	}
}

// 
// Interrupt Handling
// 
function krnEnableInterrupts() {
	// Keyboard
	hostEnableKeyboardInterrupt();
	// Put more here.
}

function krnDisableInterrupts() {
	// Keyboard
	hostDisableKeyboardInterrupt();
	// Put more here.
}

function krnInterruptHandler(irq, params) // This is the Interrupt Handler Routine.  Pages 8 and 560.
{
	// Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on.  Page 766.
	krnTrace("Handling IRQ~" + irq);

	// Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
	// TODO: Consider using an Interrupt Vector in the future.
	// Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.  
	//       Maybe the hardware simulation will grow to support/require that in the future.
	switch (irq) {
	case TIMER_IRQ:
		krnTimerISR(); // Kernel built-in routine for timers (not the clock).
		break;
	case KEYBOARD_IRQ:
		krnKeyboardDriver.isr(params); // Kernel mode device driver
		_StdIn.handleInput();
		break;
	case "SYSTEM_IRQ": //system call
		krnHandleSystemCall();
		break;
	default:
		krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
	}
}

function krnTimerISR() // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver).
{
	_TaskBar.clockTick();
	// Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
}

//
// System Calls... that generate software interrupts via tha Application Programming Interface library routines.
//
// Some ideas:
// - ReadConsole
// - WriteConsole
// - CreateProcess
// - ExitProcess
// - WaitForProcessToExit
// - CreateFile
// - OpenFile
// - ReadFile
// - WriteFile
// - CloseFile

//
// OS Utility Routines
//
function krnTrace(msg) {
	// Check globals to see if trace is set ON.  If so, then (maybe) log the message. 
	if (_Trace) {
		if (msg === "Idle") {
			// We can't log every idle clock pulse because it would lag the browser very quickly.
			if (_OSclock % 10 == 0) // Check the CPU_CLOCK_INTERVAL in globals.js for an 
			{ // idea of the tick rate and adjust this line accordingly.
				hostLog(msg, "OS");
			}
		} else {
			hostLog(msg, "OS");
		}
	}
}

function krnHandleSystemCall() {
	krnTrace("handling FF system call");
	krnTrace("hi " + _current_pcb.xreg);
	if (_current_pcb.xreg == 1) {
	//	krnTrace("hu " + _current_pcb.yreg);
		//_StdIn.advanceLine();
		//_StdIn.putText(_current_pcb.yreg);

		var temp = _current_pcb.yreg.toString();
		krnTrace("TEMP1 " + temp);
		//temp = temp.replace(/^0+/, '');
		krnTrace("TEMP2 " + temp);
		_StdIn.putText(temp);
		_StdIn.advanceLine();
		//_StdIn.putText(">");

	} else if (_current_pcb.xreg == 2) {
	//	krnTrace("hi");
		//_StdIn.advanceLine();
	//	krnTrace("hu " + _current_pcb.yreg);
		var startaddress = _current_pcb.yreg;
	//	krnTrace("startaddress: " + startaddress);
		
		
		var mem_loca = parseInt(startaddress, 16);

	//	krnTrace("mem_loca: " + mem_loca);
		var string = "";
		
		if (_scheduler.executionmode == "FCFS")
			{
			var char = _memManagement.getAddress(mem_loca);
			}else{
				var char = _memManagement.getAddress2(mem_loca);
			}
		
		var charencoded = parseInt(char, 16);
		krnTrace("char: " + char);
	//	krnTrace("charencoded: " + charencoded);
		while (charencoded != 0) {
		//	krnTrace("actualchar " + String.fromCharCode(charencoded));
			string += String.fromCharCode(charencoded);
			mem_loca++;
			if (_scheduler.executionmode == "FCFS")
			{
			char = _memManagement.getAddress(mem_loca);
			}else{
				char = _memManagement.getAddress2(mem_loca);
			}
			charencoded = parseInt(char, 16);
		//	krnTrace("chare: " + charencoded);
		}
		_StdOut.putText(string);
		_StdOut.advanceLine();
	}
}

function krnTrapError(msg) {
	hostLog("OS ERROR - TRAP: " + msg);
	_DrawingContext.clearRect(0, 0, _Canvas.width, 500);
	_DrawingContext.fillStyle = "blue";
	_DrawingContext.fillRect(0, 0, _Canvas.width, 500);
	_StdIn.putText("THE OS IS SINKING! ABANDON SHIP!");
	krnShutdown();
}
