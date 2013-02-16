Function.create
===============

This allows you to create named functions easily in JavaScript. Tested browsers:

 *  IE 8
 *  Chrome
 *  Firefox
 *  Safari

It is similar to the [sketched `Function.create`](http://wiki.ecmascript.org/doku.php?id=strawman:name_property_of_functions) in ECMAScript (two years old). The proposal was never accepted, so this function is not based on any standards, but it's still very useful.


Install
-------

Installing is as easy as:

```
npm install function.create
```

... or just download the `Function.create.js` file, which includes comments.

Loading it in Node.JS:

```javascript
require('function.create'); // now loaded globally
```

Loading it in the browser:

```html
<script src="Function.create.js"></script>
```


Usage
-----

Two functions are provided:

 *  **Function**.create(name, call[, construct[, proto]])
 *  **Function**.getDisplayNameOf(f)

Currently the `proto` argument is not supported, but work is underway to support it in browsers where possible.

Example 1 (creating unnamed function):

```javascript
var anon = Function.create(null, function(str) {
	console.log('anon called:', str);
});

anon('Hello, anon!');
```

Example 2 (creating simple named function):

```javascript
var simple = Function.create('simple', function(str) {
	console.log('simple called:', str);
});

console.log(simple.name); // "simple"
simple('Hello, simple!');
```

Example 3 (creating simple named constructor):

```javascript
var Constr = Function.create('Constr', function(n) {
	this.n = n;
});
Constr.prototype.say = function(text) {
	console.log('say: ' + text + ', ' + this.n + '!');
};

console.log(Constr.name); // "Constr"
var c = new Constr('simple named constructor');
c.say('Bonjour'); // say: Bonjour, simple named constructor!
```

Example 4 (creating named function and constructor):

```javascript
var Person = Function.create('Person', function(name) {
	return new Person(name);
}, function(name) {
	this.name = name;
});

console.log(Person.name); // "Person"
var p1 = new Person('Bobby');
var p2 = Person('Bobby');
console.log('Same person?', p1.name === p2.name); // true
```

Example 5 (getting name of function):

```javascript
var func = function fancyFunction() {};
console.log('Function name:', Function.getDisplayNameOf(func));
```

Example 6 (named classes):

```javascript
function createClass(name, properties) {
	var Class = Function.create(name, function() {
		if (typeof(this.initialize) === 'function') {
			this.initialize.apply(this, arguments);
		}
	});
	Class.prototype = properties;
	Class.prototype.constructor = Class;
	return Class;
}

var Person = createClass('Person', {
	initialize: function(name) {
		this.name = name;
	}
});
var andy = new Person('Andy');
```

Hopefully, there is more to come!
