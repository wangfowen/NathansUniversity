//compile MUS format:
var MUS = 
{ tag: 'seq',
  left: 
   { tag: 'seq',
     left: { tag: 'note', pitch: 'a4', dur: 250 },
     right: { tag: 'note', pitch: 'b4', dur: 250 } },
  right:
   { tag: 'seq',
     left: { tag: 'note', pitch: 'c4', dur: 500 },
     right: { tag: 'note', pitch: 'd4', dur: 500 } } 
 };

//into NOTE format:
var NOTE = [ 
  { tag: 'note', pitch: 'a4', start: 0, dur: 250 },
  { tag: 'note', pitch: 'b4', start: 250, dur: 250 },
  { tag: 'note', pitch: 'c4', start: 500, dur: 500 },
  { tag: 'note', pitch: 'd4', start: 1000, dur: 500 } ];

var endTime = function (expr, time) {
	time = time || 0;

	switch (expr.tag) {
		case 'seq':
			time += endTime(expr.left) + endTime(expr.right);
			break;
		case 'par':
			time += Math.max(endTime(expr.left), endTime(expr.right));
			break;
		default:
			time += expr.dur;
	}

	return time;
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
				start = endTime(expr, start);
				break;
			default:
				note = note.concat({ tag: 'note', pitch: expr.pitch, start: start, dur: expr.dur });
				if (!inPar) { start = endTime(expr, start); }
		}
	};
	addNote(musexpr);

	return note;
};

console.log(MUS);
console.log(compile(MUS));
console.log(NOTE);