var evalScheem = function (expr, env) {
  
  if (typeof expr === 'number') {
    return expr;
  }
  if (typeof expr === 'string') {
    return env[expr];
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
    case 'cons':
      var a;
      (a = evalScheem(expr[2], env)).unshift(evalScheem(expr[1], env));
      return a;
    case 'car':
      return evalScheem(expr[1], env).shift();
    case 'cdr':
      var b;
      (b = evalScheem(expr[1], env)).shift();
      return b;
    case 'set!':
      env[expr[1]] = evalScheem(expr[2], env);
      return 0;
    case 'begin':
      for (var i = 1; i < expr.length - 1; i++) {
          evalScheem(expr[i], env);
      }
      return evalScheem(expr[expr.length - 1], env);
  }
};

if (typeof module !== 'undefined') {
  module.exports.evalScheem = evalScheem;
}