var paper;
var graph;
window.onload = function (){
    paper = Raphael('canvas', '100%','100%');
    pitch = loadPitch(paper);
    graph = new Graph(paper);
    loadPalette(paper);         
};

var DragFunctions = {
    nodes:[],
    lines:[],

    start:function (x,y,e) {
        this.ox = 0;
        this.oy = 0;
        if(e.which == 1) {
            this.animate({"opacity":0.5}, 500);
        }
    },

    paletteStart:function () {
        this.ox = 0;
        this.oy = 0;

        var newPaletteObj = this.clone();
        newPaletteObj.data('type',this.items[0].data('type'));
        optionsSet.exclude(this);
        optionsSet.push(newPaletteObj);
        DragFunctions.addDragAndDropCapabilityToPaletteOption(newPaletteObj);
        this.animate({"opacity":0.5}, 500);
    },

    move: function (dx, dy, x, y, e) {
        var new_x = dx - this.ox;
        var new_y = dy - this.oy;
        this.ox = dx;
        this.oy = dy;
        this.xx = x;
        this.yy = y;
        if(e.which == 1) {
            this.transform('...T' + new_x + ',' + new_y);
            for (var i = DragFunctions.lines.length; i--;) {
                paper.connection(DragFunctions.lines[i].shape);
            };
        }
    },

    findNode: function(shape) {
        for (var i = DragFunctions.nodes.length; i--;){
            if(DragFunctions.nodes[i].items[0] == shape){
                return i;
            }
        }
        return -1;
    },

    paletteUp: function(){
        if(!DragFunctions.isInsideCanvas(this)){
            this.remove();
        }else{
            this.undrag();

            DragFunctions.addDragAndDropCapabilityToSet(this);
            this.animate({"opacity":1}, 500);
            
            if(this.items[0].data('type') === 3 || this.items[0].data('type') === 4 || this.items[0].data('type') === 5){
                this.node = new Node(this.items[0].data('type'), 'Click me');
                this.items[1].attr({text: 'Click me'});
                console.log(this.items[1]);
                this.dblclick(function (){
                    var t = prompt('Inserir dados:','');
                    if(t === undefined || t.length === 0){
                            t = '';
                    }
                    self.attr({text: t});
                    self.node.data = t;
            });
            }else if(this.items[0].data('type') === 1 || this.items[0].data('type') === 2){
                this.node = new Node(this.items[0].data('type'), null);
            }
            
            graph.add(this.node);
           
            var self=this;

           /* this.dblclick(function (){
                var aux = -1;
                for (var i = DragFunctions.lines.length; i--;) {

                    if(DragFunctions.lines[i].source.items[0] == this || DragFunctions.lines[i].target.items[0] == this) {
                        graph.removeline(DragFunctions.lines[i]);
                        DragFunctions.lines[i].shape.line.remove();
                        DragFunctions.lines.splice(i, 1);
                    }
                } 
                graph.remove(self.node);
                self.remove();
                DragFunctions.nodes.splice(DragFunctions.findNode(this), 1);  
            });*/

            
            

            
            DragFunctions.nodes.push(this);
        }
    },

    up: function (e) {
        if(e.which == 1) {
            if(!DragFunctions.isInsideCanvas(this)){
                this.animate({transform:'...T' + (-this.ox) + ',' + (-this.oy)}, 1000, "bounce", function() {
                    for (var i = DragFunctions.lines.length; i--;) {
                        paper.connection(DragFunctions.lines[i].shape);
                    };
                });
            }
            this.animate({"opacity": 1}, 500);
        } else if(e.which == 3) {
            var nn = paper.getElementByPoint(this.xx,this.yy);
            if(nn.type == 'text') {
                console.log("corrigido");
                nn = nn.prev;
            }

            if(nn != undefined){
                //console.log(nn);
                var linha = new Connection(paper, this, nn);
                DragFunctions.lines.push(linha);
                graph.lines.push(linha);
            }
        }
    },

        isInsideCanvas: function(obj){
            var canvasBBox = pitch.getBBox();
            var objectBBox = obj.getBBox();
            var objectPartiallyOutside = !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x, objectBBox.y) || !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x, objectBBox.y2) || !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x2, objectBBox.y) || !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x2, objectBBox.y2);
            return !(objectPartiallyOutside);
        },


        addDragAndDropCapabilityToSet: function(compSet) {
            compSet.drag(this.move, this.start, this.up, compSet, compSet, compSet);
        },

        addDragAndDropCapabilityToPaletteOption:function (compSet) {
            compSet.drag(this.move, this.paletteStart, this.paletteUp, compSet, compSet, compSet);
        }
};

var paletteOptions = {
         "begin"  :{type:1, color:"yellow", path:"M0,15 C0,15 0,0 15,0 L85,0 C85,0 100,0 100,15 C100,15 100,30 85,30 L15,30 C15,30 0,30 0,15 Z"},
         "end"    :{type:2, color:"yellow", path:"M0,15 C0,15 0,0 15,0 L85,0 C85,0 100,0 100,15 C100,15 100,30 85,30 L15,30 C15,30 0,30 0,15 Z"},
         "write"  :{type:3, color:"yellow", path:"M20,0 L100,0 L100,70 L0,70 L0,20 L20,0 Z"},
         "read"   :{type:4, color:"yellow", path:"M20,0 L100,0 L80,70 L0,70 L20,0 Z"},
         "if"     :{type:5, color:"yellow", path:"M50,0 L100,50 L50,100 L0,50 L50,0 Z"},
         "process":{type:6, color:"yellow", path:"M0,0 L100,0 L100,70 L0,70 L0,0 Z"},
         "return" :{type:7, color:"yellow", path:"M0,15 L15,0 L85,0 C85,0 100,0 100,15 C100,15 100,30 85,30 L15,30 L0,15 Z"},
         "join"   :{type:8, color:"yellow", path:"M0,15 C0,15 0,0 15,0 C15,0 30,0 30,15 C30,15 30,30 15,30 C15,30 0,30 0,15  Z"},
         "comment":{type:9, color:"yellow", path:"M0,0 L100,0 L100,50 L30,50 L20,60 L10,50 L0,50 L0,0 z"}
     };

var loadPitch = function (paper) {
    var pitch = paper.rect(0,0,400,800);
    pitch.attr({stroke: "blue"});
    pitch.transform("...T110,0");
    return pitch;
};
/*
    Carrega a palete
*/
var loadPalette = function(paper){
    optionsSet = paper.set();
    var paletteBorder = paper.rect(0,0,100,pitch.getBBox().height,10).attr({stroke: "red"});
    optionsSet.push(paletteBorder);
    var i = 1;
    var paletteYOffset = 20;
    var imageTextTopMargin = 10;

    for(var optionName in paletteOptions){
        var paletteOption = paletteOptions[optionName];
        var image = paper.path(paletteOption.path).attr({"fill": paletteOption.color});
        image.transform("S1.3T20," + paletteYOffset);
        image.scale(0.5,0.5,0,0);
        image.data('type',paletteOption.type);
        var text = paper.text(image.getBBox().width/2, (image.getBBox().height/2)+imageTextTopMargin,optionName).attr({fill:'black'});
        optionSet = paper.set([image,text]);
        optionsSet.push(optionSet);
        DragFunctions.addDragAndDropCapabilityToPaletteOption(optionSet);
        i++;
        imageTextTopMargin+=70;
        paletteYOffset+= 70;
    }
};
