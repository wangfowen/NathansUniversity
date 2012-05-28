if (typeof module !== 'undefined') {
    var assert = require('chai').assert;
    var fs = require('fs');
    var evalScheem = require('./scheem_interpreter.js').evalScheem;
} else {
    var assert = chai.assert;
}

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
  test('errors on multiple parameters', function() {
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
  var env = {x:2, a:1}
  test('a number', function() {
    evalScheem(['set!', 'a', 3], env);
    assert.deepEqual(env["a"], 3);
  });
  test('an atom', function() {
    evalScheem(['set!', 'a', ['quote', 'dog']], env);
    assert.deepEqual(env["a"], 'dog');
  });
  test('a list', function() {
    evalScheem(['set!', 'a', ["+", "x", 1]], env);
    assert.deepEqual(env["a"], 3);
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
      evalScheem(['begin', ['set!', 'x', 5], ['set!', 'x', ['+', 'y', 'x']], 'x'], {x:1, y:2}),
      7
    );
  });
});
suite('=', function() {
  test('true', function() {
    assert.deepEqual(
      evalScheem(['=', 4, 4], {}),
      '#t'
    );
  });
  test('false', function() {
    assert.deepEqual(
      evalScheem(['=', 4, 3], {}),
      '#f'
    );
  });
});
suite('<', function() {
  test('true', function() {
    assert.deepEqual(
      evalScheem(['<', 3, 4], {}),
      '#t'
    );
  });
  test('false', function() {
    assert.deepEqual(
      evalScheem(['<', 4, 3], {}),
      '#f'
    );
  });
});
suite('cons', function() {
  test('a number', function() {
    assert.deepEqual(
      evalScheem(['cons', 1, ['quote', [2, 3]]], {}),
      [1, 2, 3]
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
      evalScheem(['car', ['quote', [1, 2, 3]]], {}),
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
      evalScheem(['cdr', ['quote', [1, 2, 3]]], {}),
      [2, 3]
    );
  });
  test('a list', function() {
    assert.deepEqual(
      evalScheem(['cdr', ['quote', [[1, 2], 3, 4]]], {}),
      [3, 4]
    );
  });
});