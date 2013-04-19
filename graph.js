var Graph = function (r){
    this.nodes = [];
    this.lines = [];
    this.r = r;
    self = this;
};

Graph.prototype.add = function (nodev){
    if (this.root === undefined) {
        this.root = nodev;
    }else{
        this.lines.push(new Connection(this.r, this.nodes[this.nodes.length-1], nodev));
    }
    this.nodes.push(nodev);

    for (var i = 0; i < this.nodes.length; i++) {
        //console.log("Graph Shape: ",this.nodes[i].shape);
        this.nodes[i].shape.drag(this.move,this.dragger, this.up);
    };


    //console.log(nodev);
    if (nodev.node.type == 3 || nodev.node.type == 5) {
          nodev.shape.dblclick(function (){
          var t = prompt('Inserir dados:','');
          if(t === undefined || t.length === 0){
            t = 'Click me';
          }
          nodev.node.data = t;
          nodev.shape[1].attr({
              text: t
          });
       });
    };

};

var self = {};


Graph.prototype.dragger = function (x, y){
    //console.log("Drag: ",this.node);
    if (this.type !== 'text'){
        this.lastdx ? this.odx += this.lastdx : this.odx = 0;
        this.lastdy ? this.ody += this.lastdy : this.ody = 0;
        this.next.lastdx ? this.next.odx += this.next.lastdx : this.next.odx = 0;
        this.next.lastdy ? this.next.ody += this.next.lastdy : this.next.ody = 0;
        this.animate({"fill-opacity": 0.2}, 500);
        this.next.animate({"fill-opacity": 0.2}, 500);
    }   
};


Graph.prototype.move = function (dx, dy){
    //console.log("Move: ",this.type);
    if (this.type !== 'text'){
        this.transform("T"+(dx+this.odx)+","+(dy+this.ody));
        this.next.transform("T"+(dx+this.odx)+","+(dy+this.ody));
        this.lastdx = dx;
        this.lastdy = dy;
        this.next.lastdx = dx;
        this.next.lastdy = dy;        
    };
    for (var i = self.lines.length; i--;) {
            self.r.connection(self.lines[i].shape);
        };
};


Graph.prototype.up = function (){
    //console.log("Up: ",this.type);
    if (this.type !== 'text'){
        this.animate({"fill-opacity": 1}, 500);
        this.next.animate({"fill-opacity": 1}, 500);
    };
}


Graph.prototype.extract = function (){
    console.log("EXTRACT");
    console.log(this.root.node);
    return this.root.node;
};
