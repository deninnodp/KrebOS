/* ----------------------------------
   DeviceDriverKeyboard.js
   
   Requires deviceDriver.js
   
   The Kernel Keyboard Device Driver.
   ---------------------------------- */

var keyCodeArray = new Array();
keyCodeArray[48] = ['0', ')'];
keyCodeArray[49] = ['1', '!'];
keyCodeArray[50] = ['2', '@'];
keyCodeArray[51] = ['3', '#'];
keyCodeArray[52] = ['4', '$'];
keyCodeArray[53] = ['5', '%'];
keyCodeArray[54] = ['6', '^'];
keyCodeArray[55] = ['7', '&'];
keyCodeArray[56] = ['8', '*'];
keyCodeArray[57] = ['9', '('];
keyCodeArray[59] = [';', ':'];
keyCodeArray[65] = ['a', 'A'];
keyCodeArray[66] = ['b', 'B'];
keyCodeArray[67] = ['c', 'C'];
keyCodeArray[68] = ['d', 'D'];
keyCodeArray[69] = ['e', 'E'];
keyCodeArray[70] = ['f', 'F'];
keyCodeArray[71] = ['g', 'G'];
keyCodeArray[72] = ['h', 'H'];
keyCodeArray[73] = ['i', 'I'];
keyCodeArray[74] = ['j', 'J'];
keyCodeArray[75] = ['k', 'K'];
keyCodeArray[76] = ['l', 'L'];
keyCodeArray[77] = ['m', 'M'];
keyCodeArray[78] = ['n', 'N'];
keyCodeArray[79] = ['o', 'O'];
keyCodeArray[80] = ['p', 'P'];
keyCodeArray[81] = ['q', 'Q'];
keyCodeArray[82] = ['r', 'R'];
keyCodeArray[83] = ['s', 'S'];
keyCodeArray[84] = ['t', 'T'];
keyCodeArray[85] = ['u', 'U'];
keyCodeArray[86] = ['v', 'V'];
keyCodeArray[87] = ['w', 'W'];
keyCodeArray[88] = ['x', 'X'];
keyCodeArray[89] = ['y', 'Y'];
keyCodeArray[90] = ['z', 'Z'];
keyCodeArray[96] = ['0', '0'];
keyCodeArray[97] = ['1', '1'];
keyCodeArray[98] = ['2', '2'];
keyCodeArray[99] = ['3', '3'];
keyCodeArray[100] = ['4', '4'];
keyCodeArray[101] = ['5', '5'];
keyCodeArray[102] = ['6', '6'];
keyCodeArray[103] = ['7', '7'];
keyCodeArray[104] = ['8', '8'];
keyCodeArray[105] = ['9', '9'];
keyCodeArray[106] = ['*', '*'];
keyCodeArray[107] = ['+', '+'];
keyCodeArray[109] = ['-', '-'];
keyCodeArray[110] = ['.', '.'];
keyCodeArray[111] = ['/', '/'];
keyCodeArray[186] = [';', ':'];
keyCodeArray[187] = ['=', '+'];
keyCodeArray[188] = [',', '<'];
keyCodeArray[189] = ['-', '_'];
keyCodeArray[190] = ['.', '>'];
keyCodeArray[191] = ['/', '?'];
keyCodeArray[192] = ['`', '~'];
keyCodeArray[219] = ['[', '{'];
keyCodeArray[220] = ['\\', '|'];
keyCodeArray[221] = [']', '}'];
keyCodeArray[222] = ['\'', '\"'];



DeviceDriverKeyboard.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.
function DeviceDriverKeyboard()                     // Add or override specific attributes and method pointers.
{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnKbdDriverEntry;
    this.isr = krnKbdDispatchKeyPress;
    // "Constructor" code.
}

function krnKbdDriverEntry()
{
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "loaded";
    // More?
}

function krnKbdDispatchKeyPress(params)
{
    // Parse the params.    TODO: Check that they are valid and osTrapError if not.
    var keyCode = params[0];
    var isShifted = params[1];
    krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
    var chr = "";
    
    //Error Check
    if (keyCode == null || 
            isNaN(keyCode) ||
            (keyCode < 0 || keyCode > 255)
           )
          throw new Error(KERNEL_TRAP_ERROR, "Null or invalid key code in krnKbdDispatchKeyPress.");
    
    // Check to see if we even want to deal with the key that was pressed.
    if ( ((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
         ((keyCode >= 97) && (keyCode <= 123)) ||  // a..z
         ((keyCode == 59))                        ||   // (semi)colon
         ((keyCode >= 96) && (keyCode <= 107))    ||   // numpad #1
         ((keyCode >= 109) && (keyCode <= 111))   ||   // numpad #2
         ((keyCode >= 186) && (keyCode <= 192))   ||   // punct #1
         ((keyCode >= 219) && (keyCode <= 222))   ||
         ((keyCode >= 48) && (keyCode <= 57)))
    {
        // Determine the character we want to display.  
        // Assume it's lowercase...
        chr = keyCodeArray[keyCode][Number(isShifted)];
        // ... then check the shift key and re-adjust if necessary.
       // if (isShifted)
      //  {
      //      chr = String.fromCharCode(keyCode);
      //  }
        // TODO: Check for caps-lock and handle as shifted if so.
        _KernelInputQueue.enqueue(chr);        
    }    
    else if ((keyCode == 32)                     ||   // space
               (keyCode == 13)                   ||   // enter
               (keyCode == 8))                           //backspace
    	{
    	 chr = String.fromCharCode(keyCode);
        _KernelInputQueue.enqueue(chr); 
        
    } else if (keyCode == 38)
    	{
    	chr = String.fromCharCode(9);
    		_KernelInputQueue.enqueue(chr); 
    	} else if (keyCode == 40)
    	{
        	chr = String.fromCharCode(10);
    		_KernelInputQueue.enqueue(chr);
    	} 
}
