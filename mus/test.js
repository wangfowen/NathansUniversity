var mus = require('./compiler.js');
var assert = require('assert');
var fs = require('fs'); // for loading files

var MUS, NOTE;

MUS = {
	"basic": 
	{ tag: 'seq',
	  left: 
	   { tag: 'seq',
	     left: { tag: 'note', pitch: 'a4', dur: 250 },
	     right: { tag: 'note', pitch: 'b4', dur: 250 } },
	  right:
	   { tag: 'seq',
	     left: { tag: 'note', pitch: 'c4', dur: 500 },
	     right: { tag: 'note', pitch: 'd4', dur: 500 } } 
	},
	"with parallel": 
	{ tag: 'seq',
	  left:
		{ tag: 'seq',
		  left: 
		   { tag: 'seq',
		     left: { tag: 'note', pitch: 'a4', dur: 250 },
		     right: { tag: 'note', pitch: 'b4', dur: 500 } },
		  right:
		   { tag: 'par',
		     left: { tag: 'note', pitch: 'c4', dur: 500 },
		     right: { tag: 'note', pitch: 'd4', dur: 250 } } 
		 },
	  right: { tag: 'note', pitch: 'e4', dur: 500 }
	},
	"3 in parallel":
	{ tag: 'seq',
	  left:
		{ tag: 'seq',
		  left: 
		   { tag: 'seq',
		     left: { tag: 'note', pitch: 'a4', dur: 250 },
		     right: { tag: 'note', pitch: 'b4', dur: 500 } },
		  right:
		   { tag: 'par',
		     left: 
		     	{ tag: 'par',
			      left: { tag: 'note', pitch: 'c4', dur: 250 },
			      right: { tag: 'note', pitch: 'd4', dur: 500 } },
		     right: { tag: 'note', pitch: 'e4', dur: 250 } } 
		 },
	  right: { tag: 'note', pitch: 'c7', dur: 500 }
	},
	"sequence alongside parallel":
	{ tag: 'seq',
	  left:
		{ tag: 'seq',
		  left: 
		   { tag: 'seq',
		     left: { tag: 'note', pitch: 'a4', dur: 250 },
		     right: { tag: 'note', pitch: 'b4', dur: 500 } },
		  right:
		   { tag: 'par',
		     left: 
		     	{ tag: 'seq',
			      left: { tag: 'note', pitch: 'c4', dur: 250 },
			      right: { tag: 'note', pitch: 'd4', dur: 500 } },
		     right: { tag: 'note', pitch: 'e4', dur: 500 } } 
		 },
	  right: { tag: 'note', pitch: 'Gb4', dur: 500 }
	},
	"with rest":
	{ tag: 'seq',
	  left: 
	   { tag: 'seq',
	     left: { tag: 'note', pitch: 'a4', dur: 250 },
	     right: { tag: 'rest', dur: 250 } },
	  right:
	   { tag: 'seq',
	     left: { tag: 'note', pitch: 'c4', dur: 500 },
	     right: { tag: 'note', pitch: 'Ab4', dur: 500 } } 
	}
};

NOTE = {
	"basic": 
	[ { tag: 'note', pitch: '69', start: 0, dur: 250 },
	  { tag: 'note', pitch: '71', start: 250, dur: 250 },
	  { tag: 'note', pitch: '60', start: 500, dur: 500 },
	  { tag: 'note', pitch: '62', start: 1000, dur: 500 } 
	],
	"with parallel":
	[ { tag: 'note', pitch: '69', start: 0, dur: 250 },
	  { tag: 'note', pitch: '71', start: 250, dur: 500 },
	  { tag: 'note', pitch: '60', start: 750, dur: 500 },
	  { tag: 'note', pitch: '62', start: 750, dur: 250 },
	  { tag: 'note', pitch: '64', start: 1250, dur: 500 } 
	],
	"3 in parallel":
	[ { tag: 'note', pitch: '69', start: 0, dur: 250 },
	  { tag: 'note', pitch: '71', start: 250, dur: 500 },
	  { tag: 'note', pitch: '60', start: 750, dur: 250 },
	  { tag: 'note', pitch: '62', start: 750, dur: 500 },
	  { tag: 'note', pitch: '64', start: 750, dur: 250 },
	  { tag: 'note', pitch: '96', start: 1250, dur: 500 }  
	],
	"sequence alongside parallel":
	[ { tag: 'note', pitch: '69', start: 0, dur: 250 },
	  { tag: 'note', pitch: '71', start: 250, dur: 500 },
	  { tag: 'note', pitch: '60', start: 750, dur: 250 },
	  { tag: 'note', pitch: '62', start: 1000, dur: 500 },
	  { tag: 'note', pitch: '64', start: 750, dur: 500 },
	  { tag: 'note', pitch: '66', start: 1500, dur: 500 }  
	],
	"with rest":
	[ { tag: 'note', pitch: '69', start: 0, dur: 250 },
	  { tag: 'note', pitch: 'rest', start: 250, dur: 250 },
	  { tag: 'note', pitch: '60', start: 500, dur: 500 },
	  { tag: 'note', pitch: '68', start: 1000, dur: 500 } 
	]
};

for (i in MUS) {
	try {
		assert.deepEqual( mus.compile(MUS[i]), NOTE[i] )
		console.log("pass test " + (i));
	} 
	catch (err) {
		console.log("error in test " + (i));
		console.log(mus.compile(MUS[i]));
		console.log(NOTE[i]);
	}
}