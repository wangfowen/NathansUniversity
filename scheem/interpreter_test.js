if (typeof module !== 'undefined') {
    var assert = require('chai').assert;
    var fs = require('fs');
    var evalScheem = require('./scheem_interpreter.js').evalScheem;
} else {
    var assert = chai.assert;
}

var env1 = { bindings: {'x': 19}, outer: { } };
var env2 = { bindings: {'y': 16}, outer: env1};
var env3 = { bindings: {'x': 2}, outer: env2};
var env4 = { bindings: {'x': 2, 'a': 1}, outer: { } }

suite('quote', function() {
  test('a number', function() {
    assert.deepEqual(
      evalScheem(['quote', 3], {}),
      3
    );
  });
  test('an atom', function() {
    assert.deepEqual(
      evalScheem(['quote', 'dog'], {}),
      'dog'
    );
  });
  test('a list', function() {
    assert.deepEqual(
      evalScheem(['quote', [1, 2, 3]], {}),
      [1, 2, 3]
    );
  });
  test('errors on wrong number of parameters', function() {
    assert.throws(function() {evalScheem(['quote', [1, 2, 3], 4], {})});
  });
});

suite('arithmetic', function() {
  test('two numbers', function() {
    assert.deepEqual(
      evalScheem(['+', 3, 5], {}),
      8
    );
    assert.deepEqual(
      evalScheem(['-', 5, 3], {}),
      2
    );
    assert.deepEqual(
      evalScheem(['*', 3, 5], {}),
      15
    );
    assert.deepEqual(
      evalScheem(['/', 8, 4], {}),
      2
    );
  });
  test('a number and an expression', function() {
    assert.deepEqual(
      evalScheem(['+', 3, ['-', 2, 1]], {}),
      4
    );
    assert.deepEqual(
      evalScheem(['-', 3, ['*', 3, 1]], {}),
      0
    );
    assert.deepEqual(
      evalScheem(['*', 3, ['/', 4, 2]], {}),
      6
    );
    assert.deepEqual(
      evalScheem(['/', 8, ['+', 2, 2]], {}),
      2
    );
  });
});

suite('if', function() {
  test('true', function() {
    assert.deepEqual(
      evalScheem(['if', ['quote', '#t'], 1, 2], {}),
      1
    );
  });
  test('false', function() {
    assert.deepEqual(
      evalScheem(['if', ['quote', '#f'], 1, 2], {}),
      2
    );
  });
  test('list evaluating to true', function() {
    assert.deepEqual(
      evalScheem(['if', ['=', 1, 1], 1, 2], {}),
      1
    );
  });
  test('list evaluating to false', function() {
    assert.deepEqual(
      evalScheem(['if', ['=', 1, 0], 1, 2], {}),
      2
    );
  });
});

suite('set!', function() {
  test('a number', function() {
    evalScheem(['set!', 'a', 3], env4);
    assert.deepEqual(env4.bindings["a"], 3);
  });
  test('an atom', function() {
    evalScheem(['set!', 'a', ['quote', 'dog']], env4);
    assert.deepEqual(env4.bindings["a"], 'dog');
  });
  test('a list', function() {
    evalScheem(['set!', 'a', ["+", "x", 1]], env4);
    assert.deepEqual(env4.bindings["a"], 3);
  });
  test("can't set unset variable", function() {
    assert.throws(function() {evalScheem(['set!', 'b', 3], env4)});
  });
});

suite('define', function() {
  test('a number', function() {
    env4 = { };
    evalScheem(['define', 'b', 3], env4);
    assert.deepEqual(env4.bindings["b"], 3);
  });
  test('an atom', function() {
    env4 = { bindings: {'x': 2, 'a': 1}, outer: { } };
    evalScheem(['define', 'b', ['quote', 'dog']], env4);
    assert.deepEqual(env4.bindings["b"], 'dog');
  });
  test('a list', function() {
    env4 = { bindings: {'x': 2, 'a': 1}, outer: { } };
    evalScheem(['define', 'b', ["+", "x", 1]], env4);
    assert.deepEqual(env4.bindings["b"], 3);
  });
  test("can't define set variable", function() {
    assert.throws(function() {evalScheem(['define', 'a', 3], env4)});
  });
});

suite('begin', function() {
  test('numbers should return last one', function() {
    assert.deepEqual(
      evalScheem(['begin', 1, 2, 3], {}),
      3
    );
  });
  test('lists should evaluate correctly', function() {
    assert.deepEqual(
      evalScheem(['begin', ['set!', 'x', 5], ['set!', 'x', ['+', 'y', 'x']], 'x'], 
        { bindings: {'x':1, 'y':2}, outer: {} }),
      7
    );
  });
});

suite('comparisons', function() {
  test('< true', function() {
    assert.deepEqual(
      evalScheem(['<', 3, 4], {}),
      '#t'
    );
  });
  test('< false', function() {
    assert.deepEqual(
      evalScheem(['<', 4, 3], {}),
      '#f'
    );
  });
  test('= true', function() {
    assert.deepEqual(
      evalScheem(['=', 4, 4], {}),
      '#t'
    );
  });
  test('= false', function() {
    assert.deepEqual(
      evalScheem(['=', 4, 3], {}),
      '#f'
    );
  });
  test('> true', function() {
    assert.deepEqual(
      evalScheem(['>', 4, 3], {}),
      '#t'
    );
  });
  test('> false', function() {
    assert.deepEqual(
      evalScheem(['>', 4, 4], {}),
      '#f'
    );
  });
  test('<= true', function() {
    assert.deepEqual(
      evalScheem(['<=', 4, 4], {}),
      '#t'
    );
  });
  test('<= false', function() {
    assert.deepEqual(
      evalScheem(['<=', 4, 3], {}),
      '#f'
    );
  });
  test('>= true', function() {
    assert.deepEqual(
      evalScheem(['>=', 4, 3], {}),
      '#t'
    );
  });
  test('>= false', function() {
    assert.deepEqual(
      evalScheem(['>=', 3, 4], {}),
      '#f'
    );
  });
});

suite('cons', function() {
  test('a number', function() {
    assert.deepEqual(
      evalScheem(['cons', 1, 2], {}),
      [1, 2]
    );
  });
  test('a list', function() {
    assert.deepEqual(
      evalScheem(['cons', ['quote', [1, 2]], ['quote', [3, 4]]], {}),
      [[1, 2], 3, 4]
    );
  });
});

suite('car', function() {
  test('a number', function() {
    assert.deepEqual(
      evalScheem(['car', 1], {}),
      1
    );
  });
  test('a list', function() {
    assert.deepEqual(
      evalScheem(['car', ['quote', [[1, 2], 3, 4]]], {}),
      [1, 2]
    );
  });
});

suite('cdr', function() {
  test('a number', function() {
    assert.deepEqual(
      evalScheem(['cdr', ['quote', 1]], {}),
      []
    );
  });
  test('a list', function() {
    assert.deepEqual(
      evalScheem(['cdr', ['quote', [[1, 2], 3, 4]]], {}),
      [3, 4]
    );
  });
});

suite('functions', function() {
  var always3 = function (x) { return 3; };
  var plusone = function (x) { return x + 1; };
  var add3 = function (x, y, z) { return x + y + z; };
  var env = {
    bindings: {'always3': always3,
               'add3': add3,
               'plusone': plusone}, outer: { }};
  test('one parameter simple', function() {
    assert.deepEqual(
      evalScheem(['plusone', ['always3', 5]], env), 
      4
    );
  });
  test('one parameter eval', function() {
    assert.deepEqual(
      evalScheem(['plusone', ['+', ['plusone', 2], ['plusone', 3]]], env),
      8
    );
  });
  test('multiple parameters simple', function() {
    assert.deepEqual(
      evalScheem(['add3', ['always3', 5], 2, 1], env), 
      6
    );
  });
  test('multiple parameter eval', function() {
    assert.deepEqual(
      evalScheem(['add3', ['+', ['plusone', 2], ['plusone', 3]], 1, 2], env),
      10
    );
  });
});

suite('lambda', function() {
  test('simple one parameter', function() {
    assert.deepEqual(
      evalScheem([['lambda', 'x', 'x'], 5], { }), 
      5
    );
  });
  test('eval one parameter', function() {
    assert.deepEqual(
      evalScheem([[['lambda', 'x', ['lambda', 'y', ['+', 'x', 'y']]], 5], 3], { }), 
      8
    );
  });
  test('simple multiple parameters', function() {
    assert.deepEqual(
      evalScheem([['lambda', ['x', 'y'], 'x'], 5, 6], { }), 
      5
    );
  });
  test('eval multiple parameters', function() {
    assert.deepEqual(
      evalScheem([['lambda', ['x', 'y'], ['+', 'x', 'y']], 5, 3], { }), 
      8
    );
  });
});