/* ------------
   Console.js

   Requires globals.js

   The OS Console - stdIn and stdOut by default.
   Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
   ------------ */

function CLIconsole() {
	// Properties
	this.CurrentFont = _DefaultFontFamily;
	this.CurrentFontSize = _DefaultFontSize;
	this.CurrentXPosition = 0;
	this.CurrentYPosition = _DefaultFontSize;
	this.buffer = "";

	// Methods
	this.init = function() {
		this.clearScreen();
		this.resetXY();
	};

	this.clearScreen = function() {
		_DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
	};

	this.resetXY = function() {
		this.CurrentXPosition = 0;
		this.CurrentYPosition = this.CurrentFontSize;
	};

	 this.clearCharacter = function(x, y, chr) {
		_DrawingContext.clearCharacter(x, y, chr);
	}

	this.clearCurrentLine = function() {
		this.CurrentXPosition = 0;
		_DrawingContext.clearLine(this.CurrentYPosition);
	}

	this.handleInput = function() {
		while (_KernelInputQueue.getSize() > 0) {
			// Get the next character from the kernel input queue.
			var chr = _KernelInputQueue.dequeue();
			// Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
			if (chr == String.fromCharCode(13)) //     Enter key
			{
				// The enter key marks the end of a console command, so ...
				// ... tell the shell ...
				_OsShell.handleInput(this.buffer);
				// ... and reset our buffer.
				this.buffer = "";
			}
			// TODO: Write a case for Ctrl-C.
			else if (chr == String.fromCharCode(8)) {
				// don't backspace if theres nothing on the line
				if (this.buffer.length > 0) {

					// Remove the backspace and the last character from the buffer
					var lastChar = this.popBuffer(1);

					// Remove the last character from the canvas object
					this.removeLastChar(lastChar);

				}
			} else {
				// This is a "normal" character, so ...
				// ... draw it on the screen...
				this.putText(chr);
				// ... and add it to our buffer.
				this.buffer += chr;
			}
		}
	};

	this.putText = function(text) {
		// My first inclination here was to write two functions: putChar() and putString().
		// Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
		// between the two.  So rather than be like PHP and write two (or more) functions that
		// do the same thing, thereby encouraging confusion and decreasing readability, I
		// decided to write one function and use the term "text" to connote string or char.
		if (text !== "") {
			// Draw the text at the current X and Y coordinates.
			_DrawingContext.drawText(this.CurrentFont, this.CurrentFontSize, this.CurrentXPosition, this.CurrentYPosition, text);
			// Move the current X position.
			var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, text);
			this.CurrentXPosition = this.CurrentXPosition + offset;
		}
	};

	this.advanceLine = function() {
		this.CurrentXPosition = 0;

		if ((_Canvas.height - this.CurrentYPosition) < (_DefaultFontSize + _FontHeightMargin)) //if at last line
		{
			//copy the the canvas - top line
			var topPart = _DrawingContext.getImageData(0, _DefaultFontSize + _FontHeightMargin, _Canvas.width, _Canvas.height - (_DefaultFontSize + _FontHeightMargin));
			this.clearScreen();
			//paste, don't increment y position, stay at last line
			_DrawingContext.putImageData(topPart, 0, 0);
		} else
			this.CurrentYPosition += _DefaultFontSize + _FontHeightMargin;
	};
	
	this.unadvanceLine = function() {
		this.CurrentXPosition = 0;
		this.CurrentYPosition -= _DefaultFontSize + _FontHeightMargin;
	}
	
	this.removeText = function(txt) {
		if (txt != "") {
			// Undraw the text at the current X and Y coordinates.
			_DrawingContext.unDrawText(this.CurrentFont, this.CurrentFontSize, this.CurrentXPosition, this.CurrentYPosition, txt);
			// Move the current X position.
			var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, txt);
			this.CurrentXPosition = this.CurrentXPosition - offset;

			if (this.CurrentXPosition <= 0) {
				this.unadvanceLine();
			}
		}
	}
	
	this.scrollDown = function(numLines) {
		//this.scrollDown(numLines);
		this.CurrentYPosition -= (_DefaultFontSize + _FontHeightMargin) * numLines;

	}
	
	this.popBuffer = function(num) {
		if (this.buffer.length >= num && num > 0) {
			lastChar = this.buffer.charAt(this.buffer.length - num);
			this.buffer = this.buffer.substring(0, (this.buffer.length - num));
			return lastChar;
		}

		else {
			throw new Error(STRING_ERROR, "Invalid pop value.");
		}
	}
	
	
	this.removeLastChar = function(lastChar) {
		if (lastChar != "") {
			// Move the current X position BACK.
			var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, lastChar);
			this.CurrentXPosition = this.CurrentXPosition - offset;

			// Actually clear the area on the canvas object
			_DrawingContext.clearCharacter(this.CurrentXPosition, this.CurrentYPosition, this.CurrentFontSize, lastChar);
			this.clearCharacter(this.CurrentXPosition, this.CurrentYPosition, lastChar);
		}

		// move the current position back

	}
}
