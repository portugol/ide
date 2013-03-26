var Connection = function(r, source, target) {
	this.source = source;
	this.target= target;
	this.source.next = target;
    this.shape = r.connection(source.shape, target.shape, "#000");
};