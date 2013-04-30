var paper;
window.onload = function (){
    paper = Raphael('canvas', 450, 600);
    pitch = loadPitch(paper);
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

    findNode: function(shape) {

            for (var i = DragFunctions.nodes.length; i--;) {
                    if(DragFunctions.nodes[i].items[0] == shape) {
                        console.log("removing: " + i);
                        return i;
                    }
            }
            return -1;
    },

    paletteUp: function(){
        console.log("palet up");
        if(!DragFunctions.isInsideCanvas(this)){
            this.remove();
        }else{
            this.undrag();
            this.scale(1.5,1.5,0,0);
            DragFunctions.addDragAndDropCapabilityToSet(this);
            this.animate({"opacity":1}, 500);
           
this.dblclick(function (){
        console.log(this);
        var aux = -1;
      for (var i = DragFunctions.lines.length; i--;) {
        console.log(DragFunctions.lines[i]);

        if(DragFunctions.lines[i].source.items[0] == this || DragFunctions.lines[i].target.items[0] == this) {
               console.log( DragFunctions.lines[i].shape);
                        DragFunctions.lines[i].shape.line.remove();

                      DragFunctions.lines.splice(i, 1);               
                       }
            }



        this.remove();

         DragFunctions.nodes.splice(DragFunctions.findNode(this), 1);  
       });

            console.log(DragFunctions.nodes);
            if(DragFunctions.nodes.length != 0)
                DragFunctions.lines.push(new Connection(paper, DragFunctions.nodes[DragFunctions.nodes.length-1], this));
            DragFunctions.nodes.push(this);



        }
    },

        up: function () {
            console.log("up");
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
         "begin"  :{color:"yellow", path:"M0,15 C0,15 0,0 15,0 L85,0 C85,0 100,0 100,15 C100,15 100,30 85,30 L15,30 C15,30 0,30 0,15 Z"},
         "read"   :{color:"yellow", path:"M20,0 L100,0 L80,70 L0,70 L20,0 Z"},
         "write"  :{color:"yellow", path:"M20,0 L100,0 L100,70 L0,70 L0,20 L20,0 Z"},
         "if"     :{color:"yellow", path:"M50,0 L100,50 L50,100 L0,50 L50,0 Z"},
         "process":{color:"yellow", path:"M0,0 L100,0 L100,70 L0,70 L0,0 Z"},
		 "return" :{color:"yellow", path:"M0,15 L15,0 L85,0 C85,0 100,0 100,15 C100,15 100,30 85,30 L15,30 L0,15 Z"},
		 "join"   :{color:"yellow", path:"M0,15 C0,15 0,0 15,0 C15,0 30,0 30,15 C30,15 30,30 15,30 C15,30 0,30 0,15  Z"},
		 "switch" :{color:"yellow", path:"M30,0 L70,0 L100,35 L70,70 L30,70 L0,35 L30,0 Z"},
		 "for"    :{color:"yellow", path:"M0,0 L50,0 L50,20 L75,0 L100,20 L100,0 L150,0 L150,40 L100,40 L100,20 L75,40 L50,20 L50,40 L0,40 Z"},
         "comment":{color:"yellow", path:"M0,0 L100,0 L100,50 L30,50 L20,60 L10,50 L0,50 L0,0 z"}
     };

var loadPitch = function (paper) {
    var pitch = paper.rect(0,0,300,500);
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
        optionSet = paper.set([image]);
        optionsSet.push(optionSet);
        DragFunctions.addDragAndDropCapabilityToPaletteOption(optionSet);
        i++;
        paletteYOffset+= 70;
    }
};
