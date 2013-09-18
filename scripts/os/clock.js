function Clock() {
	// attributes
	this.timeStr = null;
	this.currentMinute = null;

	// refresh the clock every CLOCK_REFRESH seconds
	this.refreshCycles = (1000 / CPU_CLOCK_INTERVAL) * CLOCK_REFRESH;
	this.cycles = -1;

	// methods
	this.tick = clockTick;
	this.formatTime = clockFormatTime;
}

function clockTick() {
	// increment the number of cycles
	this.cycles++;
	if (this.cycles % this.refreshCycles) {
		var time = new Date();
		var minutes = time.getMinutes();
		if (this.minutes != minutes) {
			this.minutes = minutes;
			this.timeStr = this.formatTime(time);
			// _TaskBar.displayClock(this.timeStr);
			_TaskBar.clearClock();
			_TaskBar.putClock(this.timeStr);
			// krnTrace("hello");
		}
	}
}

function clockFormatTime(time) {
	var hour = time.getHours();
	var minute = time.getMinutes();
	if (minute < 10)
		minute = '0' + minute;

	return (hour + ":" + minute);
}
