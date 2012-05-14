var convertPitch = function (pitch) {
	var sharp = (pitch.length === 3);
	var octave = sharp ? pitch[2] : pitch[1];
	var letterPitch = {
		C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11
	};

	return 12 + 12 * parseInt(octave, 10) - (sharp ? 1 : 0) + letterPitch[pitch[0].toUpperCase()];
};

var compile = function (musexpr) {
	var notes = [];

	var addNote = function (expr, endTime) {
		switch (expr.tag) {
			case 'seq':
				endTime = addNote(expr.left, endTime);
				endTime = addNote(expr.right, endTime);
				return endTime;
			case 'par':
				var endTimeLeft = addNote(expr.left, endTime);
				var endTimeRight = addNote(expr.right, endTime);
				return Math.max(endTimeLeft, endTimeRight);
			case 'note':
				notes.push({ tag: 'note', pitch: convertPitch(expr.pitch), start: endTime, dur: expr.dur });
				return endTime + expr.dur;
			case 'rest':
				notes.push({ tag: 'note', pitch: 'rest', start: endTime, dur: expr.dur });
				return endTime + expr.dur;
			default:
				throw new Error('bad tag ' + expr.tag )
		}
	};
	addNote(musexpr, 0);

	return notes;
};

module.exports.compile = compile;