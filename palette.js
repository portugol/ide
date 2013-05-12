// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ palette.js - CODEBY                                                │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ 																    │ \\
// │ Copyright © 2013 - ESTT - ESCOLA SUPERIOR DE TECNOLOGIA DE TOMAR   │ \\
// │ 																    │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ DEVELOP FOR: LEI - LICENCIATURA ENGENHARIA INFORMATICA             │ \\
// │              PSI - PROJECTO SISTEMAS INFORMACAO 2012/2013          │ \\
// │                                                                    │ \\
// │          BY: Jorge Martins   n.º 13683                             │ \\
// │              Rafael Costa    n.º 13686                             │ \\
// │              André Candido   n.º 14019                             │ \\
// │              Vasco Palmeirão n.º 14067                             │ \\
// │              Joni Correia    n.º 15501                             │ \\
// │              João Graça      n.º 15190                             │ \\
// │              Pedro Pacheco   n.º 15305                             │ \\
// │              André Farinha   n.º 16181                             │ \\
// │              João Mauricio   n.º 16499                             │ \\
// └────────────────────────────────────────────────────────────────────┘ \\


/*
*
*palette.js
*This class represent the palette dragndrop in IDE
*
*Palette recives as paramenters
*paper: Raphael Paper Object (canvas)
*workspace: workspace (Flowspace Object)
*
*/
var Palette = function(paper, workspace){
	this.workspace = workspace;
	this.paletteOptions = {
	    "begin"  :{type:1, stroke: "none", color:"yellow", path:"M0,15 C0,15 0,0 15,0 L85,0 C85,0 100,0 100,15 C100,15 100,30 85,30 L15,30 C15,30 0,30 0,15 Z"},
	    "end"    :{type:2, stroke: "none", color:"yellow", path:"M0,15 C0,15 0,0 15,0 L85,0 C85,0 100,0 100,15 C100,15 100,30 85,30 L15,30 C15,30 0,30 0,15 Z"},
	    "write"  :{type:3, stroke: "none", color:"yellow", path:"M20,0 L100,0 L100,70 L0,70 L0,20 L20,0 Z"},
	    "read"   :{type:4, stroke: "none", color:"yellow", path:"M20,0 L100,0 L80,70 L0,70 L20,0 Z"},
	    "process":{type:6, stroke: "none", color:"yellow", path:"M0,0 L100,0 L100,70 L0,70 L0,0 Z"},
	    "if"     :{type:5, stroke: "none", color:"yellow", path:"M50,0 L100,50 L50,100 L0,50 L50,0 Z"},
	    "return" :{type:7, stroke: "none", color:"yellow", path:"M0,15 L15,0 L85,0 C85,0 100,0 100,15 C100,15 100,30 85,30 L15,30 L0,15 Z"},
	    "join"   :{type:8, stroke: "none", color:"yellow", path:"M0,15 C0,15 0,0 15,0 C15,0 30,0 30,15 C30,15 30,30 15,30 C15,30 0,30 0,15  Z"},
	    "comment":{type:9, stroke: "none", color:"yellow", path:"M0,0 L100,0 L100,50 L30,50 L20,60 L10,50 L0,50 L0,0 z"}
	};
	this.loadPalette(paper);

	self = this;
};

Palette.prototype.loadPalette = function(paper){
	optionsSet = paper.set();
    var paletteBorder = paper.rect(0,0,100,this.workspace.workspace.getBBox().height,10).attr({stroke: "red"});
    optionsSet.push(paletteBorder);
    var i = 1;
    var paletteYOffset = 20;
    var imageTextTopMargin = 10;
    for(var optionName in this.paletteOptions){
        var paletteOption = this.paletteOptions[optionName];
        var image = paper.path(paletteOption.path).attr({"fill": paletteOption.color, "stroke": paletteOption.stroke});
        image.transform("S1.3T20," + paletteYOffset);
        image.scale(0.5,0.5,0,0);
        image.data('type',paletteOption.type);
        var text = paper.text(image.getBBox().width/2, (image.getBBox().height/2)+imageTextTopMargin,optionName).attr({fill:'black'});
        optionSet = paper.set([image,text]);
        optionsSet.push(optionSet);
        this.addDragAndDropCapabilityToPaletteOption(optionSet);
        i++;
        imageTextTopMargin+=70;
        paletteYOffset+= 70;
    }
};

//Adiciona capacidade de drag and drop ao compset(Para objectos da pallete)
Palette.prototype.addDragAndDropCapabilityToPaletteOption = function (compSet) {
	compSet.drag(this.move, this.paletteStart, this.paletteUp, compSet, compSet, compSet);
};

Palette.prototype.paletteStart = function (){
	this.ox = 0;
    this.oy = 0;

    var newPaletteObj = this.clone();
    newPaletteObj.data('type',this.items[0].data('type'));
    optionsSet.exclude(this);
    optionsSet.push(newPaletteObj);
    self.addDragAndDropCapabilityToPaletteOption(newPaletteObj);
    this.animate({"opacity":0.5}, 500);
};

Palette.prototype.move = function (dx, dy, x, y, e){
	var new_x = dx - this.ox;
    var new_y = dy - this.oy;
    this.ox = dx;
    this.oy = dy;
    this.xx = x;
    this.yy = y;
    if(e.which == 1) {
        this.transform('...T' + new_x + ',' + new_y);
    }
};

Palette.prototype.paletteUp = function(){
	if(!self.isInsideCanvas(this)){
        this.remove();
    }else{
		this.undrag();

		self.workspace.addDragAndDropCapabilityToSet(this);

		self.workspace.addHover(this);


		this.animate({"opacity":1}, 500);
		var self1=this;

		if(this.items[0].data('type') === 3 || this.items[0].data('type') === 4 || this.items[0].data('type') === 5){
		    this.node = new Node(this.items[0].data('type'), 'Click me');
		    this.items[1].attr({text: 'Click me'});
		    this.dblclick(function (){
		        var t = prompt('Inserir dados:','');
		        if(t === undefined || t.length === 0){
		                t = 'Click me';
		        }
		        self1.attr({text: t});
		        self1.node.data = t;
		    });
		}else if(this.items[0].data('type') === 1 || this.items[0].data('type') === 2){
		    this.node = new Node(this.items[0].data('type'));
		}
        
       self.workspace.graph.add(this.node);
       self.workspace.addNode(this);

       //funçaõ para remocao do no selecionado
       /*this.dblclick(function (){
            for (var i = dragndrop.lines.length; i--;) {
                if(dragndrop.lines[i].source.items[0] == this || dragndrop.lines[i].target.items[0] == this || dragndrop.lines[i].source.items[1] == this || dragndrop.lines[i].target.items[1] == this) {
                    graph.removeline(dragndrop.lines[i]);
                    dragndrop.lines[i].shape.line.remove();
                    dragndrop.lines.splice(i, 1);
                }
            } 
            graph.remove(self1.node);
            self1.remove();
            dragndrop.nodes.splice(dragndrop.findNode(this), 1);  
        });*/
    }
};


//Verifica se o obj se encontra dentro da area de trabalho
Palette.prototype.isInsideCanvas = function(obj){
	var canvasBBox = this.workspace.workspace.getBBox();
    var objectBBox = obj.getBBox();
    var objectPartiallyOutside = !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x, objectBBox.y) || !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x, objectBBox.y2) || !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x2, objectBBox.y) || !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x2, objectBBox.y2);
    return !(objectPartiallyOutside);
};