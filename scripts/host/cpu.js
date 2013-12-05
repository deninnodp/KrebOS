/* ------------  
   CPU.js

   Requires global.js.
   
   Routines for the host CPU simulation, NOT for the OS itself.  
   In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
   that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
   JavaScript in both the host and client environments.

   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

function cpu() {
	this.PC = 0; // Program Counter
	this.Acc = 0; // Accumulator
	this.Xreg = 0; // X register
	this.Yreg = 0; // Y register
	this.Zflag = 0; // Z-ero flag (Think of it as "isZero".)
	this.isExecuting = false;

	this.init = function() {
		this.PC = 0
		this.Acc = 0;
		this.Xreg = 0;
		this.Yreg = 0;
		this.Zflag = 0;
		this.isExecuting = false;

	}
	
/*	this.update = function(PC, Acc, Xreg, Yreg, Zflag)
	{
		this.PC = PC;
		this.Acc = Acc;
		this.Xreg = Xreg;
		this.Yreg = Yreg;
		this.Zflag = Zflag;
	}*/

	this.pulse = function() {
		// TODO: Do we need this? Probably not.
	}

	this.cycle = function() {

		krnTrace("CPU cycle");
		// TODO: Accumulate CPU usage and profiling statistics here.
		// Do real work here. Set this.isExecuting appropriately.
	}

	this.exec = function() {
		// gets initial info
		
		if (_scheduler.executionmode == "PRIORITY")
			{
				krnTrace("sup");
				//krnTrace(_readyqueue.length);
				var bestchoice = 999999999;
				var finalchoice = 0;
				var temp = new Array();
				var len = _readyqueue.length;
				
				for(var j=0;j<_readyqueue.length;j++)
					{
						if (_readyqueue[j].priority < bestchoice)
							{
								bestchoice = _readyqueue[j].priority;
								finalchoice = j;
								//krnTrace("BEST " + bestchoice);
								//krnTrace("FINAL " + finalchoice);
							}
					}
				
				if (_readyqueue[finalchoice] != _readyqueue[0])
					{
				
						temp = _readyqueue[0];
					
						
						//krnTrace("temp = " + temp[0].pid);
						
				    	_readyqueue[0] = _readyqueue[finalchoice];
						_readyqueue.push(temp);
		
						//krnTrace("0 = " + _readyqueue[0].pid);
						//krnTrace("1 = " + _readyqueue[1].pid);
						//krnTrace("2 = " + _readyqueue[2].pid);
				
					}
				
				_current_pcb = _readyqueue.shift();
				
				krnTrace("yogsssssssdfg " + _current_pcb.pid);
				
				this.pcb = _current_pcb;
				
				krnTrace("yogdfg " + this.pcb.pid);

				
						this.pcb.state = "RUNNING";
				start_location = _memManagement.getPC();

				// get first instruction
				instruction = _memManagement.getAddress(start_location);
				daflag = true;
				_cpu.isExecuting = true;
				
			
			}else
				{

					if (_readyqueue[0].inMemory == false && _readyqueue[0].onDisk == true)
					{
						var swapee = _readyqueue.length - 1;
						var swapee2 = swapee;
						swapee = _readyqueue[swapee].pid;
						_memManagement.swap(_readyqueue[0].pid,swapee,0,swapee2);
					}
					_current_pcb = _readyqueue.shift();
					
					
					this.pcb = _current_pcb;
					
					krnTrace("yo " + this.pcb.pid);
			
					
							this.pcb.state = "RUNNING";
					start_location = _memManagement.getPC();
			
					// get first instruction
					instruction = _memManagement.getAddress(start_location);
			
					_cpu.isExecuting = true;
		
				}

	}

	// need to restore the info in the array of pid/current pid

	this.iterate = function() {
		
		if (_scheduler.executionmode == "FCFS")
			{
				if (this.pcb.state == "TERMINATED")
					{
					//krnTrace("WASFSDGFG");
						if (_readyqueue.length != 0)
							{
								//krnTrace("WASFSDGFG111111");
								_scheduler.contextSwitch();
							}else{
								
								_StdIn.advanceLine();
								_StdIn.putText(">");
								
								_cpu.isExecuting = false;
							}
					}
			}else if (_scheduler.executionmode == "PRIORITY")
			{
				//krnTrace("WAfsdfsdG");
				if (this.pcb.state == "TERMINATED")
				{
				//krnTrace("WASFSDGFG");
					if (_readyqueue.length != 0)
						{
							_scheduler.contextSwitch();
						}else{
							
							_StdIn.advanceLine();
							_StdIn.putText(">");
							
							_cpu.isExecuting = false;
						}
				}
				}else if (_scheduler.executionmode == "RR")
				{
				if (this.pcb.state == "TERMINATED")
				{
				//krnTrace("WASFSDGFG");
					if (_readyqueue.length != 0)
						{
							_scheduler.contextSwitch();
						}else{
							
							_StdIn.advanceLine();
							_StdIn.putText(">");
							
							_cpu.isExecuting = false;
						}
				}else{
					
				
				
				
				krnTrace(_tickcount+ " CSSSSSSS " + rrquantum);
					if (_tickcount >= rrquantum)
						{
						//krnTrace(_tickcount+ " CSSSSSSSSSS " + rrquantum);
							_scheduler.contextSwitch();
						}
				}
				}
		
		if (_cpu.isExecuting)
			{
		
		
		//krnTrace("LOOKY HERE " + instruction);
		
		//Update the register displays
		_pcDisplay.innerHTML = _current_pcb.pc;
		_accDisplay.innerHTML = _current_pcb.accum;
		_xDisplay.innerHTML = _current_pcb.xreg;
		_yDisplay.innerHTML = _current_pcb.yreg;
		_zDisplay.innerHTML = _current_pcb.Zflag;
		
		_current_pcb.display();

		var current_pc = _memManagement.getPC();

		//this.pcb.pc = current_pc;
	//	krnTrace("WINNER: " + current_pc);
		
		if (instruction == "00") {
			//we done, yo
		//	krnTrace("WE DONE YO");
			_current_pcb = this.pcb
			_current_pcb.state = "TERMINATED";
			_current_pcb.display();
			//_cpu.isExecuting = false;
			//_readyqueue.shift();

		} else if (instruction == "A9") {
			// A9 means take next value and store in accum.

			var strConst = _memManagement.getAddress(current_pc + 1);

			krnTrace("CNST " + strConst);
		/*	if (strConst == "4F" || strConst == "4E") {
				this.pcb.accum = strConst;
			} else {*/
				var value = parseInt(strConst, 16);

				this.pcb.accum = value; // set accum to value

				krnTrace("ACC " + this.pcb.accum);
		//}
			// need to increment pc- will skip the variable
			this.pcb.pc++;
			current_pc++;

			// check for store into mainmem
		} else if (instruction == "8D") {

			// get location where need to store accum
			// var current_pc = this.pcb.program_counter;

			// swap the locations - little n-dian
			var location = _memManagement.getAddress(current_pc + 2) + _memManagement.getAddress(current_pc + 1);
		//	krnTrace("woop " + location);
			var mem_loc = parseInt(location, 16); // get hex value
		//	krnTrace("woop2 " + mem_loc);
			//krnTrace("GOING IN " + this.pcb.accum);
			
			mem_loc = mem_loc + _current_pcb.base; //THIS WAS THE PROBLEM.
			
		//	krnTrace("woop454545 " + mem_loc);
			
			_mainMem.Memory[mem_loc] = this.pcb.accum;

			this.pcb.pc += 2;
			current_pc += 2;
			// LDA from mem
		} else if (instruction == "AD") {

			// get location where need to store accum
			// var current_pc = this.pcb.program_counter;

			// swap the locations - little n-dian
			var location = _memManagement.getAddress(current_pc + 2) + _memManagement.getAddress(current_pc + 1);

			var mem_loc = parseInt(location, 16); // get hex value
			mem_loc = mem_loc + _current_pcb.base;
			this.pcb.accum = _mainMem.Memory[mem_loc];

			this.pcb.pc += 2;
			current_pc += 2;
			// check for add with carry (add address with accum)
		} else if (instruction == "6D") {
			// get location where need to add from
			// var current_pc = this.pcb.program_counter;

			// swap the locations - little n-dian
			var location = _memManagement.getAddress(current_pc + 2) + _memManagement.getAddress(current_pc + 1);
			var mem_loc = parseInt(location, 16);
			mem_loc = mem_loc + _current_pcb.base;
			// alert(this.memory[mem_loc] + " " + this.pcb.accum);
			this.pcb.accum = this.pcb.accum + _mainMem.Memory[mem_loc];

			this.pcb.pc += 2;
			current_pc += 2;

			// check to load x with constant
		} else if (instruction == "A2") {

			var strConst = _memManagement.getAddress(current_pc + 1);

			var value = parseInt(strConst, 16);

			this.pcb.xreg = value; // set accum to value

			// need to increment pc- will skip the variable
			this.pcb.pc++;
			current_pc++;

			// load y reg with constant
		} else if (instruction == "A0") {

			// var current_pc = this.pcb.program_counter;

			var strConst = _memManagement.getAddress(current_pc + 1);

			var value = parseInt(strConst, 10);
			//krnTrace("my dad " + strConst);
			this.pcb.yreg = strConst; // set accum to value

			// need to increment pc- will skip the variable
			this.pcb.pc++;
			current_pc++;

			// load y reg from mem
		} else if (instruction == "AC") {

			var location = _memManagement.getAddress(current_pc + 2) + _memManagement.getAddress(current_pc + 1);
			var mem_loc = parseInt(location, 16);
			//krnTrace("my dad " + mem_loc);
			mem_loc = mem_loc + _current_pcb.base;
			this.pcb.yreg = _mainMem.Memory[mem_loc];

			this.pcb.pc += 2;
			current_pc += 2;
			//load x reg from mem
		} else if (instruction == "AE") {
			// get location where need to add from
			// var current_pc = this.pcb.program_counter;

			// swap the locations - little n-dian
			var location = _memManagement.getAddress(current_pc + 2) + _memManagement.getAddress(current_pc + 1);
			var mem_loc = parseInt(location, 16);
			mem_loc = mem_loc + _current_pcb.base;
			this.pcb.xreg = _mainMem.Memory[mem_loc];

			this.pcb.pc += 2;
			current_pc += 2;

		} else if (instruction == "FF") {
			//System call
			krnInterruptHandler("SYSTEM_IRQ", 0);
			// krnInterruptDispatcher(irq, params)

		} else if (instruction == "EA") {
			//this is useless, it's the DO NOTHING opcode

		} else if (instruction == "D0") {
			//krnTrace("WE GOT D0 " + this.pcb.Zflag);
			if (this.pcb.Zflag == 0) //if z register is 0 then set pc to given location
			{
				var location = _memManagement.getAddress(current_pc + 1); //_memManagement.getAddress(current_pc + 2) +
				//krnTrace("loc " + location);
				var mem_loc = parseInt(location, 16);
				//	krnTrace("memloc " + mem_loc);
				//	krnTrace("before: " + this.pcb.pc);
				this.pcb.pc = this.pcb.pc + mem_loc + 1;
				current_pc = current_pc + mem_loc + 1;
				//	krnTrace("after: " + this.pcb.pc);

				if (this.pcb.pc > 255) {
					this.pcb.pc = this.pcb.pc - 256;
				}
				
				/*if (current_pc > _current_pcb.limit) {
					current_pc = current_pc - 256;
				}*/
				
				
				//krnTrace("after2: " + this.pcb.pc);
			} else //just inc pc as normal
			{
				//krnTrace(this.pcb.pc);
				this.pcb.pc++;
				current_pc++;
			}

		} else if (instruction == "EE") {
			var location = _memManagement.getAddress(current_pc + 2) + _memManagement.getAddress(current_pc + 1);
			var mem_loc = parseInt(location, 16); // get hex value
			mem_loc = mem_loc + _current_pcb.base;
			var memByte = _mainMem.Memory[mem_loc];
			_mainMem.Memory[mem_loc] = ++memByte;

			this.pcb.pc += 2;
			current_pc +=2;

		} else if (instruction == "EC") {
			var location = _memManagement.getAddress(current_pc + 2) + _memManagement.getAddress(current_pc + 1);

			var mem_loc = parseInt(location, 16); // get hex value
			//krnTrace("memloc " + )
			mem_loc = mem_loc + _current_pcb.base;
			var memByte = _mainMem.Memory[mem_loc];

			if (this.pcb.xreg == memByte) {
				this.pcb.Zflag = 1;
			} else {
				this.pcb.Zflag = 0;
			}
			this.pcb.pc += 2;
			current_pc += 2;
		} else {
			//krnTrapError("Invalid Machine Code.");
		}

		if (instruction != "00")
			{
			// increment PC by 1, get next instruction
			this.pcb.pc++;
			current_pc++;
			var current_location = _memManagement.getPC();
			instruction = _memManagement.getAddress(current_location);
			_tickcount++;
			_current_pcb = this.pcb;
			//_current_pcb.update(this.state, this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag, _current_pcb.base, _current_pcb.limit);
			_current_pcb.display();
			_mainMem.display();
			}

			}
	}
	}

	// returns memory as a string
	this.memory = function() {
		// alert("in get memory");
		var output = "";
		for (x in this.memory) {

			if (!this.memory[x] == "") {
				output = output + this.memory[x] + " ";
			}
		}
		return (output);
	}

