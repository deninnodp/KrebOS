
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
    
    this.display = function()
    {
    	//krnTrace("PC: " + this.pc + " ACC: " + this.acc + " X: " + this.x + " Y: " + this.y + " STATE: " + this.state + " Z: " + this.z + " BASE: " + this.base + " LIMIT: " + this.limit);
    	if (this.pid == 0)
    		{	
	        	_stateDisplay0.innerHTML = this.state;
	        	_baseDisplay0.innerHTML = this.base;
	        	_limitDisplay0.innerHTML = this.limit;
	        	_pcDisplay0.innerHTML = this.pc;
	        	_accDisplay0.innerHTML = this.acc;
	        	_xDisplay0.innerHTML = this.x;
	        	_yDisplay0.innerHTML = this.y;
	        	_zDisplay0.innerHTML = this.z;
	        	
    		}else if (this.pid == 1){
	        	_stateDisplay1.innerHTML = this.state;
	        	_baseDisplay1.innerHTML = this.base;
	        	_limitDisplay1.innerHTML = this.limit;
	        	_pcDisplay1.innerHTML = this.pc;
	        	_accDisplay1.innerHTML = this.acc;
	        	_xDisplay1.innerHTML = this.x;
	        	_yDisplay1.innerHTML = this.y;
	        	_zDisplay1.innerHTML = this.z;
    		}else if (this.pid == 2){
	        	_stateDisplay2.innerHTML = this.state;
	        	_baseDisplay2.innerHTML = this.base;
	        	_limitDisplay2.innerHTML = this.limit;
	        	_pcDisplay2.innerHTML = this.pc;
	        	_accDisplay2.innerHTML = this.acc;
	        	_xDisplay2.innerHTML = this.x;
	        	_yDisplay2.innerHTML = this.y;
	        	_zDisplay2.innerHTML = this.z;
    		}
    	

    	
    }
}