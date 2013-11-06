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
		krnTrace("CONTEXT SWITCH");
		//make sure something is on the ready queue
		if (_readyqueue.length != 0)
			{
			krnTrace("outside");
				//mode is FCFS
			//	if (this.executionmode == "FCFS")
		//			{
						_Mode = 0;
						if (_current_pcb.state != "TERMINATED")
							{
								krnTrace("inside");
								_current_pcb.status = "READY";
								_current_pcb.display();
								//_current_pcb.update("READY", _cpu.PC, _cpu.Acc, _cpu.Xreg, _cpu.Yreg, _cpu.Zflag, _current_pcb.base, _current_pcb.limit);
								_readyqueue.push(_current_pcb);
								_tickcount = 0;
								_cpu.exec();
								_Mode = 1;
							}else{
								krnTrace("inside2");
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
	

}