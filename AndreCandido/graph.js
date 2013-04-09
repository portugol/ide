var Graph = function (r){
    this.nodes = [];
    this.lines = [];
    this.r = r;
    self = this;
};

Graph.prototype.add = function (node){
    if (this.root === undefined) {
        this.root = node;
    }else{
        this.lines.push(new Connection(this.r, this.nodes[this.nodes.length-1], node));
    }
    this.nodes.push(node);

    for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].shape.drag(this.move,this.dragger, this.up);
    };

    self1 = this;

    for(var i = 0; i < this.nodes.length; i++){
        if (this.nodes[i].shape[0].type == 'rect') {
            this.nodes[i].shape.dblclick(function (){
                console.log();
                var t = prompt('Inserir dados: ','');
                console.log(i);
                console.log(t);
                self1.nodes[i].data = t;
                self1.nodes[i].shape[1].attr({
                    text: t
                });
            });
            break;
        };
    };
};

var self = {};

Graph.prototype.dragger = function (){
    if(this.type == 'circle' || this.type == 'ellipse'){
        this.ox = this.attr('cx');
        this.oy = this.attr('cy');
        this.animate({opacity: .25});
    }else if(this.type == 'rect'){
        this.ox = this.attr("x");
        this.oy = this.attr("y");
        this.animate({opacity:.25});
    }
};


Graph.prototype.move = function (dx, dy){
    if(this.type == 'circle' || this.type == 'ellipse'){
        this.attr({
            cx: this.ox + dx,
            cy: this.oy + dy
        });
        for (var i = 0; i < self.nodes.length; i++) {
            if(self.nodes[i].shape[0].type == 'circle' || self.nodes[i].shape[0].type == 'ellipse'){
                self.nodes[i].shape[1].attr({
                    x: self.nodes[i].shape[0].attr('cx'),
                    y: self.nodes[i].shape[0].attr('cy')
                });
            }
        };
    }else if (this.type == 'rect') {
        this.attr({
            x: this.ox + dx,
            y: this.oy + dy
        });
        for (var i = 0; i < self.nodes.length; i++) {
            if(self.nodes[i].shape[0].type == 'rect'){
                self.nodes[i].shape[1].attr({
                    x: (self.nodes[i].shape[0].attr('x') + (self.nodes[i].shape[0].attr('width')/2)),
                    y: (self.nodes[i].shape[0].attr('y') + (self.nodes[i].shape[0].attr('height')/2))
                });
            }
            
        };
    }
    for (var i = self.lines.length; i--;) {
        self.r.connection(self.lines[i].shape);
    };
};


Graph.prototype.up = function (){
    if(this.type == 'circle'){
        this.animate({opacity: .5});
    }else if(this.type == 'rect'){
        this.animate({opacity:.5}, 500,">");
    };
}

Graph.prototype.extract = function (){
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
};
