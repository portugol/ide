var Graph = function(r) {
	this.nodes = [];
	this.lines = [];
	this.r = r;
	self = this;
};

Graph.prototype.add = function(node) {
	if(this.root === undefined) {
		this.root = node;
	} else {
		this.lines.push(new Connection(r, this.nodes[this.nodes.length-1], node));
	}
	this.nodes.push(node);

    for (var i = 0, ii = this.nodes.length; i < ii; i++) {
        var color = Raphael.getColor();
        this.nodes[i].shape.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
        this.nodes[i].shape.drag(this.move, this.dragger, this.up);
    }
}

var self = {};

Graph.prototype.dragger = function () {
    this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
    this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
    this.animate({"fill-opacity": .2}, 500);
};

Graph.prototype.move = function (dx, dy) {
    var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
    this.attr(att);
    for (var i = self.lines.length; i--;) {
        r.connection(self.lines[i].shape);
    }
    r.safari();
};

Graph.prototype.up = function () {
    this.animate({"fill-opacity": 0}, 500);
};

Graph.prototype.extract = function () {
	for (var i = 0; i < this.nodes.length; i++) {
		delete this.nodes[i].shape;
		delete this.nodes[i].r;
	};

	for (var i = 0; i < this.lines.length; i++) {
		delete this.lines[i].shape;
		delete this.lines[i].r;
	};

	return this;
}