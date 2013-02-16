/*globals exports:true,require:true,console:true*/
/*jshint evil:true*/

// Support testing in Node.JS and other CommonJS environments.
if (typeof exports !== 'undefined') {
	require('./Function.create');
}


console.log('---- Example 1 ----');

var anon = Function.create(null, function(str) {
	console.log('anon called:', str);
});

anon('Hello, anon!');


console.log('---- Example 2 ----');

var simple = Function.create('simple', function(str) {
	console.log('simple called:', str);
});

console.log(simple.name); // "simple"
simple('Hello, simple!');


console.log('---- Example 3 ----');

var Constr = Function.create('Constr', function(n) {
	this.n = n;
});
Constr.prototype.say = function(text) {
	console.log('say: ' + text + ', ' + this.n + '!');
};

console.log(Constr.name); // "Constr"
var c = new Constr('simple named constructor');
c.say('Bonjour'); // say: Bonjour, simple named constructor!


console.log('---- Example 4 ----');

var Person = Function.create('Person', function(name) {
	return new Person(name);
}, function(name) {
	this.name = name;
});

console.log(Person.name); // "Person"
var p1 = new Person('Bobby');
var p2 = Person('Bobby');
console.log('Same person?', p1.name === p2.name); // true


console.log('---- Example 5 ----');

var func = function fancyFunction() {};
console.log('Function name:', Function.getDisplayNameOf(func));


console.log('---- Example 6 ----');

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
	},
	getName: function() {
		return this.name;
	}
});
var andy = new Person('Andy');
console.log(andy instanceof Person); // true
console.log(andy.getName()); // "Andy"


console.log('---- Example 7 ----');

function createFunctor(name, properties) {
	return Function.create(name, function() {
		if (typeof(this.invoke) === 'function') {
			this.invoke.apply(this, arguments);
		}
	}, null, properties);
}

function Module() {}
Module.prototype = new Function();
Module.prototype.constructor = Module;

Module.prototype.say = function(message) {
	console.log('I want to say: ' + message);
};
Module.prototype.invoke = function(a, b) {
	this.say(a + ' + ' + b + ' = ' + (a + b));
	return a + b;
};

var M = createFunctor('Module', new Module());
console.log(M.name); // "Module"
console.log(typeof(M)); // "function"
console.log(M instanceof Module); // true, in all browsers except MSIE
M(20, 22); // outputs "I want to say: 20 + 22 = 42"


console.log('---- Test A ----');

var foo = Function.create('foo', function() { });

console.log('[1] ', foo instanceof Function);
console.log('[2] ', typeof(foo) === 'function');
console.log('[3] ', Object.prototype.toString.call(foo) === '[object Function]');
console.log('[4] ', foo.name === 'foo');
console.log('[5] ', foo.displayName === 'foo');
console.log('[6] ', Function.getDisplayNameOf(foo) === 'foo');
console.log('[7] ', foo() === undefined);
console.log('[8] ', foo.toString());


console.log('---- Test B ----');

var bar = Function.create('bar', function(a,b){ return a+b; });

console.log('[1] ', bar instanceof Function);
console.log('[2] ', typeof(bar) === 'function');
console.log('[3] ', Object.prototype.toString.call(bar) === '[object Function]');
console.log('[4] ', bar.name === 'bar');
console.log('[5] ', bar.displayName === 'bar');
console.log('[6] ', Function.getDisplayNameOf(bar) === 'bar');
console.log('[7] ', bar(4, 5) === 9);
console.log('[8] ', bar.toString());


console.log('---- Test C ----');

var baz = Function.create('baz', function(a){ this.baz1(a+1); });
baz.prototype.baz1 = function(value){ this.value2=2*value; };
baz.prototype.baz2 = function(value){ return value*this.value2; };

var b = new baz(11);

console.log('[1] ', baz instanceof Function);
console.log('[2] ', typeof(baz) === 'function');
console.log('[3] ', Object.prototype.toString.call(baz) === '[object Function]');
console.log('[4] ', baz.name === 'baz');
console.log('[5] ', baz.displayName === 'baz');
console.log('[6] ', Function.getDisplayNameOf(baz) === 'baz');
console.log('[7] ', b instanceof baz);
console.log('[8] ', b.constructor === baz);
console.log('[9] ', b.baz2(321) === 7704);
console.log('[10] ', baz.toString());


console.log('---- Test D ----');

var plop = Function.create('pløp', function(a,b){ return a+b; }, function(a){ this.plop1(a+1); });
plop.prototype.plop1 = function(value){ this.value2=3*value; };
plop.prototype.plop2 = function(value){ return value*this.value2; };

var p = new plop(5);

console.log('[1] ', plop instanceof Function);
console.log('[2] ', typeof(plop) === 'function');
console.log('[3] ', Object.prototype.toString.call(plop) === '[object Function]');
console.log('[4] ', plop.name === 'pløp');
console.log('[5] ', plop.displayName === 'pløp');
console.log('[6] ', Function.getDisplayNameOf(plop) === 'pløp');
console.log('[7] ', p instanceof plop);
console.log('[8] ', p.constructor === plop);
console.log('[9] ', p.plop2(123) === 2214);
console.log('[10] ', plop(44, 45) === 89);
console.log('[11] ', plop.toString());


console.log('---- Test E ----');

function Drux() {}
Drux.prototype = new Function();
Drux.prototype.constructor = Drux;
Drux.prototype.drux = function(){ this.value = 32; };

function Flux() {}
Flux.prototype = new Drux();
Flux.prototype.constructor = Flux;
Flux.prototype.fluxy1 = function(){ this.drux(); };

var flux = Function.create('flux', function(a){ this.fluxy1(); return a-1; }, null, new Flux());
flux.fluxy2 = function(value){ return value/this.value; };

console.log('[1] ', flux instanceof Function);
console.log('[2] ', flux instanceof Flux);
console.log('[3] ', flux.constructor === Flux);
console.log('[4] ', typeof(flux) === 'function');
console.log('[5] ', Object.prototype.toString.call(flux) === '[object Function]');
console.log('[6] ', flux.name === 'flux');
console.log('[7] ', flux.displayName === 'flux');
console.log('[8] ', Function.getDisplayNameOf(flux) === 'flux');
console.log('[9] ', flux(99) === 98);
console.log('[10] ', flux.fluxy2(64) === 2);
console.log('[11] ', flux.toString());


console.log('----------------');
