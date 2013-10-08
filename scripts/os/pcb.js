
/*
* pcb.js
* stores info for a process
*/


function pcb(state, pid, pc, base, limit, priority)
{
    //members
    this.state = state;
    this.pid = pid;
    this.pc = pc;
    this.base = base;
    this.limit = limit;
	this.priority = priority;
	this.inMemory = true; //all newly created pcb for procs will be in memory by default.
    
    //initialize the registers to 0 since upon initial creation, the state isn't being saved into the pcb
    this.acc = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    
    //functions
    
    //will update a pcb object with given values
    this.update = function(state, pc, acc, x, y, z, base, limit) {
        this.pc = pc;
        this.acc = acc;
        this.x = x;
        this.y = y;
        this.state = state;
        this.z = z;
        this.base = base;
        this.limit = limit;
    };
}