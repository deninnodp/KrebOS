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
		this.pcb = _current_pcb;

		// search through the array and look for one of the commands
		// once found do the command, then remove that from the list

		var start_location = _memManagement.getPC(); // will get the virtual
														// address where program
														// start in mem

		// get first instruction
		var instruction = _memManagement.getAddress(start_location);

		while (instruction != "00") // go till 00 (break)
		{
			krnTrace("LOOKY HERE " + instruction);
			//Update the register displays
			/*
			_pcDisplay.innerHTML=_current_pcb.pc;
			_accDisplay.innerHTML=_current_pcb.accum;
			_xDisplay.innerHTML=_current_pcb.xreg;
			_yDisplay.innerHTML=_current_pcb.yreg;
			_zDisplay.innerHTML=_current_pcb.Zflag;
			*/
			var current_pc = _memManagement.getPC();

			// check for load
			if (instruction == "A9") {
				// A9 means take next value and store in accum.

				var strConst = _memManagement.getAddress(current_pc + 1);

				var value = parseInt(strConst);

				this.pcb.accum = value; // set accum to value

				// need to increment pc- will skip the variable
				this.pcb.pc++;

				// check for store into mainmem
			}else if (instruction == "8D") {

				// get location where need to store accum
				// var current_pc = this.pcb.program_counter;

				// swap the locations - little n-dian
				var location = _memManagement.getAddress(current_pc + 2) + _memManagement.getAddress(current_pc + 1);

				var mem_loc = parseInt(location, 16); // get hex value

				_mainMem.Memory[mem_loc] = this.pcb.accum;

				this.pcb.pc += 2;
				// LDA from mem
			}else if (instruction == "AD") {

				// get location where need to store accum
				// var current_pc = this.pcb.program_counter;

				// swap the locations - little n-dian
				var location = _memManagement.getAddress(current_pc + 2) + _memManagement.getAddress(current_pc + 1);

				var mem_loc = parseInt(location, 16); // get hex value

				this.pcb.accum = _mainMem.Memory[mem_loc];

				this.pcb.pc += 2;
				// check for add with carry (add address with accum)
			}else if (instruction == "6D") {
				// get location where need to add from
				// var current_pc = this.pcb.program_counter;

				// swap the locations - little n-dian
				var location = _memManagement.getAddress(current_pc + 2) + _memManagement.getAddress(current_pc + 1);
				var mem_loc = parseInt(location, 16);

				// alert(this.memory[mem_loc] + " " + this.pcb.accum);
				this.pcb.accum = this.pcb.accum + _mainMem.Memory[mem_loc];

				this.pcb.pc += 2;
				
				// check to load x with constant
			}else if (instruction == "A2") {

				var strConst = _memManagement.getAddress(current_pc + 1);

				var value = parseInt(strConst);

				this.pcb.xreg = value; // set accum to value

				// need to increment pc- will skip the variable
				this.pcb.pc++;
				
				// load y reg with constant
			}else if (instruction == "A0") {

				// var current_pc = this.pcb.program_counter;

				var strConst = _memManagement.getAddress(current_pc + 1);

				var value = parseInt(strConst);

				this.pcb.yreg = value; // set accum to value

				// need to increment pc- will skip the variable
				this.pcb.pc++;
				
				// load y reg from mem
			}else if (instruction == "AC") {

				var location = _memManagement.getAddress(current_pc + 2) + _memManagement.getAddress(current_pc + 1);
				var mem_loc = parseInt(location, 16);

				this.pcb.yreg = _mainMem.Memory[mem_loc];

				this.pcb.pc += 2;
				//load x reg from mem
			}else if (instruction == "AE") {
				// get location where need to add from
				// var current_pc = this.pcb.program_counter;

				// swap the locations - little n-dian
				var location = _memManagement.getAddress(current_pc + 2) + _memManagement.getAddress(current_pc + 1);
				var mem_loc = parseInt(location, 16);

				this.pcb.xreg = _mainMem.Memory[mem_loc];

				this.pcb.pc += 2;
				
			}else if (instruction == "FF") {
				//System call
				krnInterruptHandler("SYSTEM_IRQ", 0);
				// krnInterruptDispatcher(irq, params)
			}else if (instruction == "EA") {
				//this is useless, it's the DO NOTHING opcode
			}else if (instruction == "D0") {
				krnTrace("WE GOT D0 " + this.pcb.zflag)
				if(this.pcb.zflag == 0) //if z register is 0 then set pc to given location
	            {
					var location = _memManagement.getAddress(current_pc + 2) + _memManagement.getAddress(current_pc + 1);

					var mem_loc = parseInt(location, 16);
					this.pcb.pc = this.pcb.pc + mem_loc;
	            
					if (this.pcb.pc > 255)
						{
						this.pcb.pc = this.pcb.pc - 256;
						}
	            }
	            else //just inc pc as normal
	            {
	                this.pc++;
	            }
				
			}else if (instruction == "EE") {
				var location = _memManagement.getAddress(current_pc + 2) + _memManagement.getAddress(current_pc + 1);

				var mem_loc = parseInt(location, 16); // get hex value
				var memByte = _mainMem.Memory[mem_loc];
				_mainMem.Memory[mem_loc] = ++memByte;
				
				this.pcb.pc += 2;
				
			}else if (instruction == "EC") {
				var location = _memManagement.getAddress(current_pc + 2) + _memManagement.getAddress(current_pc + 1);

				var mem_loc = parseInt(location, 16); // get hex value

				var memByte = _mainMem.Memory[mem_loc];
				
				if (this.pcb.xreg == memByte)
					{
					this.pcb.zflag = 1;
					}else{
						this.pcb.zflag = 0;
					}
				this.pcb.pc += 2;
			}else
				{
				//krnTrapError("Invalid Machine Code.");
				}

			// increment PC by 1, get next instruction
			this.pcb.pc++;
			var current_location = _memManagement.getPC();
			instruction = _memManagement.getAddress(current_location);

			_current_pcb = this.pcb
			_mainMem.display();

			// krnTrace("last instruction was: " + instruction);
			// this.pcb.display();

		}

		// need to restore the info in the array of pid/current pid
		_current_pcb = this.pcb

		_current_pcb.display();
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
		return (output)
	}

}