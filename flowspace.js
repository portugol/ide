// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ flowspace.js - CODEBY 				                                │ \\
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
*flowspace.js
*This class represent the workspace in IDE
*
*FlowSpace recives as paramenters
*paper: Raphael Paper Object (canvas)
*
*/
var FlowSpace = function(paper){
	this.nodes = [];
	this.lines = [];
	this.graph = new Graph();
	this.workspace = this.loadWorkSpace(paper);
	this.bin = paper.rect(this.workspace.getBBox().width,50,50,50).attr({"fill": "red"});
	aux = this;
};

FlowSpace.prototype.loadWorkSpace = function(paper){
	var workspace = paper.rect(0,0,400,600,10);
    workspace.attr({stroke: "blue"});
    workspace.transform("...T110,0");
    return workspace;
};

FlowSpace.prototype.getWorkSpace = function(){
	return this;
};

FlowSpace.prototype.addNode = function(node){
	this.nodes.push(node);
	//console.log(this.nodes);
};

FlowSpace.prototype.addLine = function(line){
	this.lines.push(line);
	//console.log(this.lines);
};

//Adiciona Capacidades de drag and drop ao comSet(Para objectos da área de trabalho)
FlowSpace.prototype.addDragAndDropCapabilityToSet = function (compSet){
	compSet.drag(this.move, this.start, this.up, compSet, compSet, compSet);
};

FlowSpace.prototype.addHover = function (compSet){
	compSet.hover(function(){
            compSet.items[0].attr({stroke: '#000'});
        },function(){
            compSet.items[0].attr({stroke: 'none'});
        });
};

FlowSpace.prototype.start = function (x,y,e){
	this.ox = 0;
    this.oy = 0;
    if(e.which == 1) {
        this.animate({"opacity":0.5}, 500);
    }
};

FlowSpace.prototype.move = function (dx, dy, x, y, e){
	var new_x = dx - this.ox;
    var new_y = dy - this.oy;
    this.ox = dx;
    this.oy = dy;
    this.xx = x;
    this.yy = y;
    if(e.which == 1) {
        this.transform('...T' + new_x + ',' + new_y);
        for (var i = aux.lines.length; i--;) {
            paper.connection(aux.lines[i].shape);
        };
    }
};

FlowSpace.prototype.up = function (e){
	if(e.which == 1) {
        if(!aux.isInsideCanvas(this)){
            this.animate({transform:'...T' + (-this.ox) + ',' + (-this.oy)}, 1000, "bounce", function() {
                for (var i = aux.lines.length; i--;) {
                    paper.connection(aux.lines[i].shape);
                };
            });
        }
        if(aux.bin.isPointInside(this.xx,this.yy)){
            for (var i = aux.lines.length; i--;) {
                var shape = this.items[0];
                if(aux.lines[i].source.items[0] == shape || aux.lines[i].target.items[0] == shape || aux.lines[i].source.items[1] == shape || aux.lines[i].target.items[1] == shape) {
                    aux.graph.removeline(aux.lines[i]);
                    aux.lines[i].shape.line.remove();
                    aux.lines.splice(i, 1);
                }
            } 
            aux.graph.remove(this.node);
            this.remove();
            aux.nodes.splice(aux.findNode(this), 1);  
        }
        this.animate({"opacity": 1}, 500);
    } else if(e.which == 3 && paper.getElementByPoint(this.xx,this.yy) != null) {
        //procura o elemento pelas coordenadas do rato
        var nn = paper.getElementByPoint(this.xx,this.yy);
        //caso seja selecionado o texto, muda-se para o path
        if(nn.type == 'text') {
            nn = nn.prev;
        }
        //se nn estiver definido e não for ele mesmo
        if(nn != undefined && this != aux.getElement(nn)){
            //caso ainda nao exista linha ja definida
            if(!aux.checkLine(this, aux.getElement(nn)) && !aux.checkLine(aux.getElement(nn),this)){
                var linha = new Connection(paper, this, aux.getElement(nn));
                aux.lines.push(linha);
                aux.graph.lines.push(linha);
            }
            /*if(nn.items == undefined){
                var linha = new Connection(paper, this, nn);
                aux.lines.push(linha);
                aux.graph.lines.push(linha);
            }*/
        }
    }
};

//Verifica se o obj se encontra dentro da area de trabalho
FlowSpace.prototype.isInsideCanvas = function(obj){
	var canvasBBox = this.workspace.getBBox();
    var objectBBox = obj.getBBox();
    var objectPartiallyOutside = !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x, objectBBox.y) || !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x, objectBBox.y2) || !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x2, objectBBox.y) || !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x2, objectBBox.y2);
    return !(objectPartiallyOutside);
};

//Pesquisa um set Raphael e devolve o seu node do array nodes
FlowSpace.prototype.getElement = function(shape){
	for (var i = aux.nodes.length - 1; i >= 0; i--) {
		if(aux.nodes[i].items[0] == shape){
			return aux.nodes[i];
		}
	};
};

//verifica se a ligacao ja existe
FlowSpace.prototype.checkLine = function(source, target){
	for (var i = aux.lines.length - 1; i >= 0; i--) {
		if(aux.lines[i].source == source && aux.lines[i].target == target){
            return true;
        }
    };
    return false;
};

FlowSpace.prototype.findNode = function(shape){
	for (var i = aux.nodes.length; i--;){
        if(aux.nodes[i].items[0] == shape){
            return i;
        }
    }
    return -1;
};

