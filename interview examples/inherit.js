var Parent = function() {
	this.p1 = 'p1',
	this.p2 = 'p2'
}

var Child = function() {
	this.c1 = 'c1',
	this.c2 = 'c2'
}

Child.prototype = new Parent();

var objChild = new Child()

// Parent.prototype.p3 = 'p3'

// console.log(objChild.p3);

Child.Prototype.p4 = 'p4';
console.log(objChild.p4);