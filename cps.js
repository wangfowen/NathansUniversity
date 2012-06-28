function sum(n) { return (n <= 1) ? 1 : (sum(n - 1) + n); }

> sum(15389);
< 118418355
> sum(15390);
< RangeError: Maximum call stack size exceeded

function thunk(fn) {
  	var args = Array.prototype.slice.call(thunk.arguments);
  
 	if (args.length > 1) { args = args.slice(1); }
  
 	return function() {
		return fn.apply(null, args);
	}
}

function trampoline(fn) {
	function _trampoline(bouncer){
	    while (typeof(bouncer) === 'function') {
			bouncer = bouncer();
	    }
	    return bouncer;
  	}

  	return function() {
		return _trampoline(fn.apply(null, 
            Array.prototype.slice.call(arguments)));
  	}
}

function identity(x) { return x; }

function sumCPS(number) {
	var start = new Date().getTime();
  
	function _sumCPS(n, c) {
		c = c || identity;
	    
	    if (n === 1) {
	    	return c(1);
	    } else {
	      	return thunk(_sumCPS, n - 1, function(result) {
	        	return thunk(c, n + result);
	      	});
	    }
	}

	var result = (trampoline(_sumCPS))(number);

	var end = new Date().getTime();
	console.log("time", end - start);

	return result;
}

> sumCPS(10000000);
 time 47999
 time 46703
 time 47888
< 50000005000000


function sumLoop(n) {
	var start = new Date().getTime(),
		sum = 0;

	while (n > 0) {
		sum += n;
		n--;
	}

	var end = new Date().getTime();
  	console.log("time", end - start);

	return sum;
}

> sumLoop(10000000);
 time 13
 time 13
 time 14
< 50000005000000