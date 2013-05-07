var Graph = function (r){
    this.nodes = [];
    this.lines = [];
    this.r = r;
    self = this;
};

Graph.prototype.add = function (node){
    if (this.root === undefined) {
        this.root = node;
    }
    this.nodes.push(node);
};

Graph.prototype.removeline = function(line){
    for(var i = 0; i < this.lines.length;i++){
        if(line == this.lines[i]){
            this.lines.splice(i,1);
        }
    }
}
Graph.prototype.remove = function(node){
    for(var i = 0; i < this.nodes.length; i++){
        if(node == this.nodes[i]){
            this.nodes.splice(i,1);
        }
    }
}

Graph.prototype.setData = function(node, data){
    console.log('entrou');
    /*for(var i = 0; i < this.nodes.length; i++){
        if(this.nodes[i] == node){
            console.log(this.nodes[i]);
        }
    }*/
};

/*Graph.prototype.extract = function (){
    for (var i = 0; i < this.nodes.length; i++) {
        delete this.nodes[i].shape[1];
        delete this.nodes[i].shape;
        delete this.nodes[i].r;
    };
    for(var i = 0; i < this.lines.length; i++){
        delete this.lines[i].shape;
        delete this.lines[i].r;
    };
    return this;
};*/
