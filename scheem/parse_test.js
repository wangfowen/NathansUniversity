if (typeof module !== 'undefined') {
	var PEG = require('pegjs');
	var assert = require('chai').assert;
	var fs = require('fs');
	var parse = PEG.buildParser(fs.readFileSync('./scheem/scheem_parser.peg', 'utf-8')).parse;
} else {
	var parse = scheem.parse;
    var assert = chai.assert;
}

suite('expressions', function() {
	test('basic', function() {
    	assert.deepEqual(
			parse("(a b c)"),
			["a", "b", "c"]
    	);
  	});
	test('nested', function() {
    	assert.deepEqual(
			parse("(* n (factorial (- n 1)))"),
			["*", "n", ["factorial", ["-", "n", 1]]]
    	);
	});
//	test('multiple', function() {
//		assert.deepEqual(
//			parse("(a b c)\n(e f g)"),
//			[["a", "b", "c"],["e", "f", "g"]]
//    	);
//	});
	test('numbers', function() {
  		assert.deepEqual(
  			parse("(1 b 2)"),
  			[1, "b", 2]
  		);
	});
});
suite('whitespace', function() {
	test('at end', function() {
    	assert.deepEqual(
      		parse("(a b c  )  "),
      		["a", "b", "c"]
    	);
	});
	test('in middle', function() {
    	assert.deepEqual(
			parse("(a  b   c )"),
			["a", "b", "c"]
    	);
  	});
	test('at the start', function() {
    	assert.deepEqual(
			parse("  (  a b c)"),
			["a", "b", "c"]
    	);
  	});
	test('tabs', function() {
    	assert.deepEqual(
			parse("(a \tb c)"),
			["a", "b", "c"]
    	);
	});
});
suite('quote', function() {
	test('formats correctly', function() {
    	assert.deepEqual(
    		parse("'(a b c)"),
			['quote', ["a", "b", "c"]]
    	);
	});
});
suite('comments', function() {
	test("doesn't get parsed", function() {
    	assert.deepEqual(
     		parse(";;(a b c) @#$(#$^*|\n(a b c)"),
    		["a", "b", "c"]
    	);
	});
});

