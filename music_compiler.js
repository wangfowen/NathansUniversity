//Homework 2

//compile MUS format:
var MUS = 
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
};

//into NOTE format:
var NOTE = [ 
  { tag: 'note', pitch: 'a4', start: 0, dur: 250 },
  { tag: 'note', pitch: 'b4', start: 250, dur: 500 },
  { tag: 'note', pitch: 'c4', start: 750, dur: 500 },
  { tag: 'note', pitch: 'd4', start: 750, dur: 250 },
  { tag: 'note', pitch: 'e4', start: 1250, dur: 500 } ];

var endTime = function (expr, time) {
	time = time || 0;

	switch (expr.tag) {
		//hmm... I don't ever use the seq case...
		//this entire method could probably be refactored into addNote
		case 'seq':
			return time + endTime(expr.left) + endTime(expr.right);
		case 'par':
			return time + Math.max(endTime(expr.left), endTime(expr.right));
		default:
			return time + expr.dur;
	}
};

var compile = function (musexpr) {
	var note = [];
	var start = 0;

	var addNote = function (expr, inPar) {
		inPar = inPar || false;

		switch (expr.tag) {
			case 'seq':
				addNote(expr.left);
				addNote(expr.right);
				break;
			case 'par':
				addNote(expr.left, true);
				addNote(expr.right, true);
				//if in parallel, add the notes with same start time, then change it
				start = endTime(expr, start);
				break;
			default:
				note.push({ tag: 'note', pitch: expr.pitch, start: start, dur: expr.dur });
				//if not in parallel, set start time for next note
				if (!inPar) { start = endTime(expr, start); }
		}
	};
	addNote(musexpr);

	return note;
};

console.log(compile(MUS));
console.log(NOTE);