/* ------------
   taskBar.js

   Requires globals.js

   The OS Console - stdIn and stdOut by default.
   Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this taskBar.
   ------------ */

function TaskBar() {
	// Properties
	this.CurrentFontSize = _DefaultFontSize;
	this.CurrentXPosition = 0;
	this.CurrentYPosition = _DefaultFontSize;
	this.buffer = "";
	this.clock = new Clock();

	this.clockWidth = 500 - _ClockXLocation;
	this.clockHeight = 30 - _ClockYLocation;

	this.DEBUG_FLAG = false;

	// Methods
	this.init = taskBarInit;
	this.clearScreen = taskBarClearScreen;
	this.resetXY = taskBarResetXY;
	this.handleInput = taskBarHandleInput;
	this.putText = taskBarPutText;
	this.putTextAtLocation = taskBarPutTextAtLocation;
	this.displayClock = taskBarDisplayClock;
	this.removeLastChar = taskBarRemoveLastChar;
	this.clearCharacter = taskBarClearCharacter;
	this.advanceLine = taskBarAdvanceLine;
	this.popBuffer = taskBarPopBuffer;
	this.clockTick = taskBarClockTick;
	this.setStatusMessage = taskBarSetStatusMessage;
	this.putClock = taskBarPutClock;
	this.clearClock = taskBarClearClock;

	_TaskBar = document.getElementById('taskBar');
	// Get a global reference to the drawing context.
	_TaskbarContext = _TaskBar.getContext('2d');
}

function taskBarInit() {
	taskBarClearScreen();
	taskBarResetXY();
}

//Clears only the status area of the taskbar
function taskBarClearScreen() {
	_StatusContext.clearRect(0, 0, 440, 30);
}
//Clears only the time area of the taskbar
function taskBarClearClock() {
	_StatusContext.clearRect(440, 0, 500, 30);
}

function taskBarClearCharacter(x, y, chr) {
	_StatusContext.clearCharacter(x, y, chr);
}

function taskBarResetXY() {
	this.CurrentXPosition = 0;
	this.CurrentYPosition = this.CurrentFontSize;
}

function taskBarHandleInput() {
	while (_KernelInputQueue.getSize() > 0) {
		// Get the next character from the kernel input queue.
		var chr = _KernelInputQueue.dequeue();
		// Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
		if (chr == String.fromCharCode(13)) //     Enter key   
		{
			// The enter key marks the end of a taskBar command, so ...
			// ... tell the shell ... 
			_OsShell.handleInput(this.buffer);
			// ... and reset our buffer.
			this.buffer = "";
		}

		else if (chr == String.fromCharCode(8)) // backspace 
		{
			// don't backspace if theres nothing on the line
			if (this.buffer.length > 0) {

				// Remove the backspace and the last character from the buffer
				var lastChar = this.popBuffer(1);

				// Remove the last character from the canvas object
				this.removeLastChar(lastChar);
			}
		}

		// TODO: Write a case for Ctrl-C.
		else {
			// This is a "normal" character, so ...
			// ... draw it on the screen...
			this.putText(chr);
			// ... and add it to our buffer.
			this.buffer += chr;
		}
	}
}
//puts text in the status bar area
function taskBarPutText(txt) {
	// My first inclination here was to write two functions: putChar() and putString().
	// Then I remembered that Javascript is (sadly) untyped and it won't differentiate 
	// between the two.  So rather than be like PHP and write two (or more) functions that
	// do the same thing, thereby encouraging confusion and decreasing readability, I 
	// decided to write one function and use the term "text" to connote string or char.
	if (txt != "") {
		// Draw the text at the current X and Y coordinates.
		_StatusContext.drawText(this.CurrentFont, this.CurrentFontSize, this.CurrentXPosition, 20, txt);
		// Move the current X position.
		//var offset = _StatusContext.measureText(this.CurrentFont, this.CurrentFontSize, txt);
		// this.CurrentXPosition = this.CurrentXPosition + offset;    
	}
}

//Special case for displaying the clock, so that you
//wont cause collisions between the status and time
function taskBarPutClock(txt) {

	if (txt != "") {
		// Draw the text at the current X and Y coordinates.
		_StatusContext.drawText(this.CurrentFont, this.CurrentFontSize, 450, 20, txt);
		// Move the current X position.
		//var offset = _StatusContext.measureText(this.CurrentFont, this.CurrentFontSize, txt);
		// this.CurrentXPosition = this.CurrentXPosition + offset;    
	}
}

/*
 * Displays text at the specified location. After displaying,
 * sets the current X and Y back to its previous value.
 */
function taskBarPutTextAtLocation(x, y, txt) {
	if (this.DEBUG_FLAG == false) {
		this.DEBUG_FLAG = true;
	}
	_StatusContext.drawText(this.CurrentFont, this.CurrentFontSize, x, y, txt);
}

//DOES NOTHING
function taskBarDisplayClock(time) {
	_StatusContext.clearRect(_ClockXLocation, _ClockYLocation, this.clockWidth, this.clockHeight);
	//this.clearScreen();
	this.putTextAtLocation(_ClockXLocation, _ClockYLocation + _DefaultFontSize, time);
}

function taskBarRemoveLastChar(lastChar) {
	if (lastChar != "") {
		// Move the current X position BACK.
		var offset = _StatusContext.measureText(this.CurrentFont, this.CurrentFontSize, lastChar);
		this.CurrentXPosition = this.CurrentXPosition - offset;

		// Actually clear the area on the canvas object
		_StatusContext.clearCharacter(this.CurrentXPosition, this.CurrentYPosition, this.CurrentFontSize, lastChar);
		//this.clearCharacter(this.CurrentXPosition, this.CurrentYPosition, lastChar);
	}

	// move the current position back

}

function taskBarAdvanceLine() {
	this.CurrentXPosition = 0;
	this.CurrentYPosition += _DefaultFontSize + _FontHeightMargin;
	// TODO: Handle scrolling.
}

/*
 * Pop a specified amount of characters off the buffer. Return
 * the last character popped.
 */
function taskBarPopBuffer(num) {
	if (this.buffer.length > num && num > 0) {
		lastChar = this.buffer.charAt(this.buffer.length - num);
		this.buffer = this.buffer.substring(0, (this.buffer.length - num));
		return lastChar;
	}

	//else
		//throw new Error(STRING_ERROR, "Invalid pop value.");
}

//Ticks clock for the taskbar clock
function taskBarClockTick() {
	this.clock.tick();
}

//DOES NOTHING
function taskBarSetStatusMessage(message) {
	_StatusContext.clearRect(0, 0, _ClockXLocation, 30);
	this.putTextAtLocation(3, 5 + _DefaultFontSize, message);
}