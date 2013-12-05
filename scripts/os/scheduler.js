/*
scheduler.js

schedules cpu processes and executes context switches

*/

function scheduler()
{		
	//can be RR or FCFS
	this.executionmode = "RR";
	this.quantum = rrquantum;
	
	this.contextSwitch = function()
	{
		//krnTrace("CONTEXT SWITCH");
		//make sure something is on the ready queue
		if (_readyqueue.length != 0)
			{
		//	krnTrace("outside");
				//mode is FCFS
			//	if (this.executionmode == "FCFS")
		//			{
						_Mode = 0;
						if (_current_pcb.state != "TERMINATED")
							{
								//krnTrace("inside");
								_current_pcb.status = "READY";
								//krnTrace(_current_pcb.status + " g " + _current_pcb.pid);
							   	if (_current_pcb.pid == "0")
					    		{	
						        	_stateDisplay0.innerHTML = "READY";
						        	_baseDisplay0.innerHTML = _current_pcb.base;
						        	_limitDisplay0.innerHTML = _current_pcb.limit;
					    		}else if (_current_pcb.pid == "1"){
						        	_stateDisplay1.innerHTML = "READY";
						        	_baseDisplay1.innerHTML = _current_pcb.base;
						        	_limitDisplay1.innerHTML = _current_pcb.limit;
					    		}else if (_current_pcb.pid == "2"){
						        	_stateDisplay2.innerHTML = "READY";
						        	_baseDisplay2.innerHTML = _current_pcb.base;
						        	_limitDisplay2.innerHTML = _current_pcb.limit;
					    		}else if (_current_pcb.pid == "3"){
						        	_stateDisplay3.innerHTML = "READY";
						        	_baseDisplay3.innerHTML = _current_pcb.base;
						        	_limitDisplay3.innerHTML = _current_pcb.limit;
					    		}
								//_current_pcb.update("READY", _cpu.PC, _cpu.Acc, _cpu.Xreg, _cpu.Yreg, _cpu.Zflag, _current_pcb.base, _current_pcb.limit);
								_readyqueue.push(_current_pcb);
								_tickcount = 0;
								_cpu.exec();
								_Mode = 1;
							}else{
							//	krnTrace("inside2");
								_current_pcb.display();
								_tickcount = 0;
								_cpu.exec();
								_Mode = 1;
							}
		//			}else if (this.executionmode == "RR")
		//				{
						//	_mode = 0;
		//				}
			}
		
	}
	
	
	this.priorityContextSwitch = function()
	{
		//krnTrace("CONTEXT SWITCH");
		//make sure something is on the ready queue
		if (_readyqueue.length != 0)
			{
				_Mode = 0;
				_current_pcb.display();
				_tickcount = 0;
				_cpu.exec();
				_Mode = 1;
			}
		
	}
	

}