var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs');


var data = fs.readFileSync('mus.peg', 'utf-8');

var parse = PEG.buildParser(data).parse;

var MUS, PARSE;

PARSE = {
	"single note": "a",
	"double duration": "a+",
	"half duration": "a-"/*,
	"basic expression": "a b c+ d+",
	"with parallel": "a b (c+ d) e+",
	"3 in parallel": "a b (c d+ e) c7+",
	"sequence alongside parallel": "a b+ ({c d+} e+) Gb+",
	"with rest": "a = c+ Ab+"*/
};

MUS = {
	"single note": { tag: 'note', pitch: 'a4', dur: 250 },
	"double duration": { tag: 'note', pitch: 'a4', dur: 500 },
	"half duration": { tag: 'note', pitch: 'a4', dur: 125 }/*,
	"basic expression": 
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
	}*/
};

for (i in MUS) {
	try {
		assert.deepEqual( parse(PARSE[i]), MUS[i] );
		console.log("pass test " + (i));
	} 
	catch (err) {
		console.log("error in test " + (i));
		console.log(parse(PARSE[i]));
		console.log(MUS[i]);
	}
}