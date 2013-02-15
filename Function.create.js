(function() {

	// This is a long list of reserved and possible reserved JavaScript identifiers. Better safe than sorry.
	var jsReservedWords = [
		'abstract', 'as', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
		'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do',
		'double', 'else', 'enum', 'export', 'extends', 'false', 'final', 'finally',
		'float', 'for', 'function', 'goto', 'if', 'implements', 'import', 'in',
		'instanceof', 'int', 'interface', 'is', 'let', 'long', 'namespace',
		'native', 'new', 'null', 'package', 'private', 'protected', 'public',
		'return', 'short', 'static', 'super', 'switch', 'synchronized', 'this',
		'throw', 'throws', 'transient', 'true', 'try', 'typeof', 'undefined',
		'use', 'var', 'void', 'volatile', 'while', 'with', 'yield'
	];
	var jsReservedWordsSet = {};
	for (var i = 0; i < jsReservedWords.length; i++) {
		jsReservedWordsSet[jsReservedWords[i]] = true;
	}

	var isFunction = function(f) {
		return typeof(f) === 'function';
	};

	if (!Function.create) {
		Function.create = function(name, call, construct, proto) {
			/*jshint eqnull:true,evil:true*/
			var func, proxy, string;

			// Convert to string keeping '0' and 'false', but null/defined becomes ''.
			name = '' + [name];
			if (jsReservedWordsSet.hasOwnProperty(name)) {
				throw new TypeError('Argument name must not be a reserved word or common identifier in JavaScript.');
			}
			// TODO: Validate name argument properly.

			// Validate other arguments.
			if (call == null || !isFunction(call)) {
				throw new TypeError('Argument call is required and must be a function.');
			}
			if (construct != null && !isFunction(construct)) {
				throw new TypeError('Argument construct must be a function.');
			}
			if (proto === Function || proto === Function.prototype) {
				// Null means using the default Function prototype (by not setting it).
				proto = null;
			}
			if (proto != null) {
				// TODO: Implement proto argument.
				throw new TypeError('Argument proto is not yet supported.');
			}
			if (proto != null && !(proto instanceof Function)) {
				throw new TypeError('Argument proto must be instance of Function.');
			}

			// Create function proxy and generate proper toString() for resulting function.
			if (call && construct) {
				proxy = function function_proxy() {
					// Heuristically determine whether the function was invoked as a constructor or regular function.
					if (this instanceof func) {
						return construct.apply(this, arguments);
					} else {
						return call.apply(this, arguments);
					}
				};
				// TODO: Include arguments in generated toString() if `call` and `construct` have the same (prefix) sequence of argument names.
				string = 'function ' + name + '() { [proxy code] }';
			} else {
				proxy = call;
				// Insert the proper name into toString() presentation.
				string = ('' + proxy.toString()).replace(/function.*?\(/, 'function ' + name + '(');
			}

			// Generate named function that just calls proxy with context and all arguemnts.
			if (name) {
				func = (new Function('proxy',
					'return function ' + name + '(){' +
						'return proxy.apply(this,arguments);' +
					'};')
				)(proxy);
			} else {
				// Anonymous function, faster than creating the above named function.
				func = function(){ return proxy.apply(this,arguments); };
			}

			// Use our generated toString() presentation.
			func.toString = function() {
				return string;
			};

			// Remember to update the other ways to query the function name.
			func.name = name;
			func.displayName = name;

			return func;
		};
	}

	if (!Function.getDisplayNameOf) {
		Function.getDisplayNameOf = function(f) {
			return (isFunction(f) && f.displayName || f.name) || void 0;
		};		
	}

}());
