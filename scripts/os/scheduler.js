/*
scheduler.js

schedules cpu processes and executes context switches

*/

function scheduler()
{
	
	this.quantum = rrquantum;
	
	//can be RR or FCFS
	this.executionmode = "FCFS";
	
	this.contextSwitch = function()
	{
		if (_readyqueue.length != 0)
			{
				_Mode = 0;
			
				if (_current_pcb.state != "TERMINATED")
					{
						_current_pcb.update("READY", _cpu.PC, _cpu.Acc, _cpu.Xreg, _cpu.Yreg, _cpu.Zflag, _current_pcb.base, _current_pcb.limit);
						_readyqueue.push(_current_pcb);
					}
				//krnTrace("ASASASAS " + _readyqueue[0].state);
				//_current_pcb = _readyqueue.shift();
				//krnTrace("ASASASAS " + _current_pcb.state);
				_cpu.exec();
				_Mode = 1;
			}
		
		
	}

}