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
    env.bindings[v] = val;
};

var evalScheem = function (expr, env) {
  
  if (typeof expr === 'number') {
    return expr;
  }
  if (typeof expr === 'string') {
    return lookup(env, expr);
  }
  
  switch (expr[0]) {
    case '+':
      return evalScheem(expr[1], env) + evalScheem(expr[2], env);
    case '-':
      return evalScheem(expr[1], env) - evalScheem(expr[2], env);
    case '*':
      return evalScheem(expr[1], env) * evalScheem(expr[2], env);
    case '/':
      return evalScheem(expr[1], env) / evalScheem(expr[2], env);
    case 'quote':
      if (expr.length === 2) { return expr[1]; }
      else { throw new Error("quote only takes one parameter"); }
    case 'if':
      return (evalScheem(expr[1], env) === '#t') ? evalScheem(expr[2], env) : evalScheem(expr[3], env); 
    case '=':
      return (evalScheem(expr[1], env) === evalScheem(expr[2], env)) ? '#t' : '#f';
    case '<':
      return evalScheem(expr[1], env) < evalScheem(expr[2], env) ? '#t' : '#f';
    case '>':
      return evalScheem(expr[1], env) > evalScheem(expr[2], env) ? '#t' : '#f';
    case '<=':
      return evalScheem(expr[1], env) <= evalScheem(expr[2], env) ? '#t' : '#f';
    case '>=':
      return evalScheem(expr[1], env) >= evalScheem(expr[2], env) ? '#t' : '#f';
    case 'cons':
      var a;
      if (typeof expr[2] === "object") {
        (a = evalScheem(expr[2], env)).unshift(evalScheem(expr[1], env));
      } else {
        (a = [evalScheem(expr[2], env)]).unshift(evalScheem(expr[1], env));
      }
      return a;
    case 'car':
      if (typeof expr[1] === "object") {
        return evalScheem(expr[1], env).shift();
      } else {
        return [evalScheem(expr[1], env)].shift();
      }
    case 'cdr':
      var b;
      if (typeof expr[1] === "object") {
        (b = evalScheem(expr[1], env)).shift();
      } else {
        (b = [evalScheem(expr[1], env)]).shift();
      }
      return b;
    case 'set!':
      if (env.bindings[expr[1]]) { update(env, expr[1], expr[2]); }
      else { throw new Error("can't set unset variable, use define instead"); }
      return 0;
    case 'define':
      if (!env.bindings) { env.bindings = {}; } 
      if (env.bindings[expr[1]]) { throw new Error("can't define set variable, use set! instead"); }
      else { env.bindings[expr[1]] = evalScheem(expr[2], env); }
      return 0;
    case 'begin':
      for (var i = 1; i < expr.length - 1; i++) {
          evalScheem(expr[i], env);
      }
      return evalScheem(expr[expr.length - 1], env);
    case 'let-one':
      var new_env = {bindings: {}};
      new_env.outer = env;
      new_env.bindings[expr[1]] = evalScheem(expr[2], env);
      return evalScheem(expr[3], new_env);
    case 'lambda-one':
      return function(arg) {
        var new_env = {bindings: {}};
        new_env.outer = env; 
        new_env.bindings[expr[1]] = evalScheem(arg, env);
        return evalScheem(expr[2], new_env); 
      };
    default:
      return evalScheem(expr[0], env)(evalScheem(expr[1], env));
  }
};

if (typeof module !== 'undefined') {
  module.exports.evalScheem = evalScheem;
}