var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('scheem.peg', 'utf-8');
// Create my parser
var parse = PEG.buildParser(data).parse;
// Do a test
console.log("basic test");
assert.deepEqual( parse("(a b c)"), [["a", "b", "c"]] );
console.log("nested expressions test");
assert.deepEqual( parse("(* n (factorial (- n 1)))"), [["*", "n", ["factorial", ["-", "n", "1"]]]]);
console.log("spaces at end test"); 
assert.deepEqual( parse("(a b c  )  "), [["a", "b", "c"]] );
console.log("spaces in middle test");
assert.deepEqual( parse("(a  b   c )"), [["a", "b", "c"]] );
console.log("spaces at start test");
assert.deepEqual( parse("  (  a b c)"), [["a", "b", "c"]] );
console.log("tabs test");
assert.deepEqual( parse("(a \tb c)"), [["a", "b", "c"]] );
console.log("comments test");
assert.deepEqual( parse(";;(a b c) @#$(#$^*|\n(a b c)"), [["a", "b", "c"]] );
console.log("multiple expressions test");
assert.deepEqual( parse("(a b c)\n(e f g)"), [["a", "b", "c"],["e", "f", "g"]] );
