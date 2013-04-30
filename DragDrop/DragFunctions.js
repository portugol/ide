var paper;
window.onload = function (){
    paper = Raphael('canvas', '100%','100%');
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
            this.scale(1.5,1.5,0,0);
            DragFunctions.addDragAndDropCapabilityToSet(this);
            this.animate({"opacity":1}, 500);

            this.dblclick(function (){
                var aux = -1;
                for (var i = DragFunctions.lines.length; i--;) {
                    if(DragFunctions.lines[i].source.items[0] == this || DragFunctions.lines[i].target.items[0] == this) {
                        DragFunctions.lines[i].shape.line.remove();
                        DragFunctions.lines.splice(i, 1);               
                    }
                }
                this.remove();
                DragFunctions.nodes.splice(DragFunctions.findNode(this), 1);  
            });

            this.node = new Node(this.items[0].data('type'), null);
            
            if(DragFunctions.nodes.length != 0){
                DragFunctions.lines.push(new Connection(paper, DragFunctions.nodes[DragFunctions.nodes.length-1], this));
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
         "begin"  :{type : 1, color:"yellow", path:"m 0, 0 ,0l0,0c7.8186,0 14.15759,6.72683 14.15759,15.02464c0,8.29783 -6.33899,15.02444 -14.15759,15.02444l-59.68466,0l0,0c-7.8186,0 -14.15775,-6.72662 -14.15775,-15.02444c0,-8.29781 6.33914,-15.02464 14.15775,-15.02464z"},
         "end"    :{type : 2, color:"yellow", path:"m 0, 0 ,0l0,0c7.8186,0 14.15759,6.72683 14.15759,15.02464c0,8.29783 -6.33899,15.02444 -14.15759,15.02444l-59.68466,0l0,0c-7.8186,0 -14.15775,-6.72662 -14.15775,-15.02444c0,-8.29781 6.33914,-15.02464 14.15775,-15.02464z"},
         "read"   :{type : 3,color:"yellow", path:"M20,0 L100,0 L80,70 L0,70 L20,0 Z"},
         "write"  :{type : 4,color:"yellow", path:"M20,0 L100,0 L100,70 L0,70 L0,20 L20,0 Z"},
         "if"     :{type : 5,color:"yellow", path:"M25,0 L75,50 L50,75 L0,50 L25,0 Z"},
         "process":{type : 6,color:"yellow", path:"M0,0 L100,0 L100,70 L0,70 L0,0 Z"},
         "comment":{type : 7,color:"yellow", path:"m42,152l-3,-128l268,0l1,126l-175,0l-25,45l-27,-43l-39,0z"}
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
        console.log(image.data('type'));
        optionSet = paper.set([image]);
        optionsSet.push(optionSet);
        DragFunctions.addDragAndDropCapabilityToPaletteOption(optionSet);
        i++;
        paletteYOffset+= 70;
    }
};
