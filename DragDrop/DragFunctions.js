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

    start:function () {
        this.ox = 0;
        this.oy = 0;
        this.animate({"opacity":0.5}, 500);
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

    move: function (dx, dy) {
        var new_x = dx - this.ox;
        var new_y = dy - this.oy;
        this.transform('...T' + new_x + ',' + new_y);
        this.ox = dx;
        this.oy = dy;
        for (var i = DragFunctions.lines.length; i--;) {
            paper.connection(DragFunctions.lines[i].shape);
        };
    },

    findNode: function(shape) { for (var i = DragFunctions.nodes.length; i--;)
    { if(DragFunctions.nodes[i].items[0] == shape) {    return i; }    }
    return -1; },

    paletteUp: function(){
        if(!DragFunctions.isInsideCanvas(this)){
            this.remove();
        }else{
            this.undrag();
            this.scale(1.5,1.5,0,0);
            this.items[1].dx = 100
            DragFunctions.addDragAndDropCapabilityToSet(this);
            this.animate({"opacity":1}, 500);
            
            this.node = new Node(this.items[0].data('type'), null);
            graph.add(this.node);
           
            var self=this;
            console.log(self);
            /*this.dblclick(function (){
                var aux = -1;
                for (var i = DragFunctions.lines.length; i--;) {
                    console.log(DragFunctions.lines)
                    if(DragFunctions.lines[i].source.items[0] == this || DragFunctions.lines[i].target.items[0] == this) {
                        graph.removeline(DragFunctions.lines[i]);
                        DragFunctions.lines[i].shape.line.remove();
                        DragFunctions.lines.splice(i, 1);
                    }
                } 
                graph.remove(self.node);
                this.remove();
                DragFunctions.nodes.splice(DragFunctions.findNode(this), 1);  
            });*/
            this.dblclick(function (){
                    var t = prompt('Inserir dados:','');
                    if(t === undefined || t.length === 0){
                            t = 'Click me';
                    }
                    self.attr({text: t});
            });
            

            if(DragFunctions.nodes.length != 0){
                var linha = new Connection(paper, DragFunctions.nodes[DragFunctions.nodes.length-1],this);
                DragFunctions.lines.push(linha);
                graph.lines.push(linha);
            }
            
            DragFunctions.nodes.push(this);
        }
    },

        up: function () {
            if(!DragFunctions.isInsideCanvas(this)){
                this.animate({transform:'...T' + (-this.ox) + ',' + (-this.oy)}, 1000, "bounce", function() {
                    for (var i = DragFunctions.lines.length; i--;) {
                        paper.connection(DragFunctions.lines[i].shape);
                    };
                });
            }
            this.animate({"opacity": 1}, 500);
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

         "process":{type : 6,color:"yellow", path:"M0,0 L100,0 L100,70 L0,70 L0,0 Z"},
         "read"   :{type : 3,color:"yellow", path:"M20,0 L100,0 L80,70 L0,70 L20,0 Z"},
         "write"  :{type : 4,color:"yellow", path:"M20,0 L100,0 L100,70 L0,70 L0,20 L20,0 Z"},
         "if"     :{type : 5,color:"yellow", path:"M25,0 L75,50 L50,75 L0,50 L25,0 Z"}
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
    var imageTextTopMargin = 15;

    for(var optionName in paletteOptions){
        var paletteOption = paletteOptions[optionName];
        var image = paper.path(paletteOption.path).attr({"fill": paletteOption.color});
        image.transform("S1.3T20," + paletteYOffset);
        image.scale(0.5,0.5,0,0);
        image.data('type',paletteOption.type);
        var text = paper.text(image.getBBox().width/2, (image.getBBox().height/2)+paletteYOffset, optionName).attr({fill:'black'});
        optionSet = paper.set([image,text]);
        optionsSet.push(optionSet);
        DragFunctions.addDragAndDropCapabilityToPaletteOption(optionSet);
        i++;
        paletteYOffset+= 70;
    }
};
