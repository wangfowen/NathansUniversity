var lookup = function (env, v) {
    if (env.bindings[v]) {
      return env.bindings[v];
    } else {
      return lookup(env.outer, v);  
    }
};

var update = function (env, v, val) {
    if (env.bindings[v]) {
      env.bindings[v] = evalScheem(val, env);
    } else {
      update(env.outer, v, val);
    }
};

var add_binding = function (env, v, val) {
    if(!env.bindings) { env.bindings = {}; }
    env.bindings[v] = val;
};

var evalScheem = function (expr, env) {
  
  if (typeof expr === 'number') { return expr; }
  if (typeof expr === 'string') { return lookup(env, expr); }

  add_binding(env, '+', function(x, y) { return x + y; });
  add_binding(env, '-', function(x, y) { return x - y; });
  add_binding(env, '*', function(x, y) { return x * y; });
  add_binding(env, '/', function(x, y) { return x / y; });
  add_binding(env, '=', function(x, y) { return x === y ? '#t' : '#f'; });
  add_binding(env, '>', function(x, y) { return x > y ? '#t' : '#f'; });
  add_binding(env, '<', function(x, y) { return x < y ? '#t' : '#f'; });
  add_binding(env, '>=', function(x, y) { return x >= y ? '#t' : '#f'; });
  add_binding(env, '<=', function(x, y) { return x <= y ? '#t' : '#f'; });
  
  add_binding(env, 'cons', function(x, y) {
    if (typeof y !== 'object') { y = [y]; } 
    y.unshift(x); 
    return y; 
  });

  add_binding(env, 'car', function(x) {
    if (typeof x !== 'object') { x = [x]; } 
    return x[0];
  });

  add_binding(env, 'cdr', function(x) {
    if (typeof x !== 'object') { x = [x]; }
    x.shift();
    return x;
  });
  
  switch (expr[0]) {
    case 'quote':
      if (expr.length === 2) { return expr[1]; }
      else { throw new Error("quote only takes one parameter"); }
    case 'if':
      return (evalScheem(expr[1], env) === '#t') ? evalScheem(expr[2], env) : evalScheem(expr[3], env);
    case 'set!':
      if (env.bindings && env.bindings[expr[1]]) { update(env, expr[1], expr[2]); }
      else { throw new Error("can't set unset variable, use define instead"); }
      return 0;
    case 'define':
      if (env.bindings && env.bindings[expr[1]]) { throw new Error("can't define set variable, use set! instead"); }
      else { add_binding(env, expr[1], evalScheem(expr[2], env)); }
      return 0;
    case 'begin':
      for (var i = 1; i < expr.length - 1; i++) {
          evalScheem(expr[i], env);
      }
      return evalScheem(expr[expr.length - 1], env);
    case 'lambda':
      return function() {
        var new_env = {bindings: {}, outer: env};
        for (var i = 0; i < arguments.length; i++) {
          new_env.bindings[expr[1][i]] = evalScheem(arguments[i], env);
        }
        return evalScheem(expr[2], new_env); 
      };
    default:
      var func = evalScheem(expr[0], env);
      var args = [];
      for (var i = 1; i < expr.length; i++) {
        args.push(evalScheem(expr[i], env));
      }
      return func.apply(null, args);
  }
};

if (typeof module !== 'undefined') {
  module.exports.evalScheem = evalScheem;
}