/* ------------  
   Globals.js

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS
//
var APP_NAME = "KrebOS";  // because I am DJ KREBMEN ....really.
var APP_VERSION = "0.1";   // Version #

var CPU_CLOCK_INTERVAL = 100;   // This is in ms, or milliseconds, so 1000 = 1 second.

var CLOCK_REFRESH = 10;

var TIMER_IRQ = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                    // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;  

//for program execution
var instruction;
var start_location;


//register displays
var _pcDisplay;
var _accDisplay;
var _xDisplay;
var _yDisplay;
var _zDisplay;

//pcb display
var _stateDisplay0;
var _baseDisplay0;
var _limitDisplay0;
var _stateDisplay1;
var _baseDisplay1;
var _limitDisplay1;
var _stateDisplay2;
var _baseDisplay2;
var _limitDisplay2;


//
// Global Variables
//
var _cpu = null;

var _OSclock = 0;       // Page 23.

var _Mode = 0;   // 0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas = null;               // Initialized in hostInit().
var _DrawingContext = null;       // Initialized in hostInit().
var _DefaultFontFamily = "sans";  // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;        // Additional space added to font size when advancing a line.

// Default the OS trace to be on.
var _Trace = true;

// OS queues
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn  = null;
var _StdOut = null;

// UI
var _Console = null;
var _OsShell = null;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;

// Global Device Driver Objects - page 12
var krnKeyboardDriver = null;

// For taskBar

var _TaskBar = null;
var _StatusContext = null;
var _ClockXLocation = 50;
var _ClockYLocation = 5;

//for clock
var CLOCK_ENABLED = true;
var currentdatetime = new Date();
var counteri = 0;

//for command history
var historyarray = new Array();
var historyindex = 0;
var chararray;
var i=0;

//main memory
var _mainMem = null;

//pid stuff
current_pid = 0; //pid thats loaded into memory
pid_next = 0; //used to determine what a free pid is
_program_queue = new Array();
_current_pcb = null;

//mem managament
var _memManagement = null;

// For testing...
var _GLaDOS = null;

//for stepping
var step = false;

var lastmemspace = 0;

//default rr quantum
var rrquantum = 6;

//the ready queue
var _readyqueue = new Array();

var _scheduler;




