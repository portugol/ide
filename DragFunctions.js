var paper;
var graph;
window.onload = function (){
    var w = window.innerWidth;
    w=w-285;
    var h = window.innerHeight;
    paper = Raphael('canvas','100%','100%');
    pitch = loadPitch(paper, w, h).attr({fill: "url('./img/panel.png')" , stroke: "black"});

    bin = paper.rect(w-60,50,75,90).attr({"fill": "none", stroke: "none"}); //pitch.getBBox().width

    rec = paper.path("M20.826,5.75l0.396,1.188c1.54,0.575,2.589,1.44,2.589,2.626c0,2.405-4.308,3.498-8.312,3.498c-4.003,0-8.311-1.093-8.311-3.498c0-1.272,1.21-2.174,2.938-2.746l0.388-1.165c-2.443,0.648-4.327,1.876-4.327,3.91v2.264c0,1.224,0.685,2.155,1.759,2.845l0.396,9.265c0,1.381,3.274,2.5,7.312,2.5c4.038,0,7.313-1.119,7.313-2.5l0.405-9.493c0.885-0.664,1.438-1.521,1.438-2.617V9.562C24.812,7.625,23.101,6.42,20.826,5.75zM11.093,24.127c-0.476-0.286-1.022-0.846-1.166-1.237c-1.007-2.76-0.73-4.921-0.529-7.509c0.747,0.28,1.58,0.491,2.45,0.642c-0.216,2.658-0.43,4.923,0.003,7.828C11.916,24.278,11.567,24.411,11.093,24.127zM17.219,24.329c-0.019,0.445-0.691,0.856-1.517,0.856c-0.828,0-1.498-0.413-1.517-0.858c-0.126-2.996-0.032-5.322,0.068-8.039c0.418,0.022,0.835,0.037,1.246,0.037c0.543,0,1.097-0.02,1.651-0.059C17.251,18.994,17.346,21.325,17.219,24.329zM21.476,22.892c-0.143,0.392-0.69,0.95-1.165,1.235c-0.474,0.284-0.817,0.151-0.754-0.276c0.437-2.93,0.214-5.209-0.005-7.897c0.881-0.174,1.708-0.417,2.44-0.731C22.194,17.883,22.503,20.076,21.476,22.892zM11.338,9.512c0.525,0.173,1.092-0.109,1.268-0.633h-0.002l0.771-2.316h4.56l0.771,2.316c0.14,0.419,0.53,0.685,0.949,0.685c0.104,0,0.211-0.017,0.316-0.052c0.524-0.175,0.808-0.742,0.633-1.265l-1.002-3.001c-0.136-0.407-0.518-0.683-0.945-0.683h-6.002c-0.428,0-0.812,0.275-0.948,0.683l-1,2.999C10.532,8.77,10.815,9.337,11.338,9.512z");
    rec.attr({fill: "#236B8E", stroke: "none"});
    rec.translate(w-85,30);
    rec.scale(4,4,0,0);

    graph = new Graph(paper);
    loadPalette(paper);        
};

/*window.onresize = function(){
    var w = window.innerWidth;
    var h = window.innerHeight;
    console.log("w", w,"h",h);


    paper = Raphael('canvas','100%','100%');
    pitch = loadPitch(paper , w , h).attr({fill: "url('panel.png')" , stroke: "black"});

    bin = paper.rect(pitch.getBBox().width,75,75,75).attr({"fill": "none", stroke: "none"});
    rec = paper.path("M20.826,5.75l0.396,1.188c1.54,0.575,2.589,1.44,2.589,2.626c0,2.405-4.308,3.498-8.312,3.498c-4.003,0-8.311-1.093-8.311-3.498c0-1.272,1.21-2.174,2.938-2.746l0.388-1.165c-2.443,0.648-4.327,1.876-4.327,3.91v2.264c0,1.224,0.685,2.155,1.759,2.845l0.396,9.265c0,1.381,3.274,2.5,7.312,2.5c4.038,0,7.313-1.119,7.313-2.5l0.405-9.493c0.885-0.664,1.438-1.521,1.438-2.617V9.562C24.812,7.625,23.101,6.42,20.826,5.75zM11.093,24.127c-0.476-0.286-1.022-0.846-1.166-1.237c-1.007-2.76-0.73-4.921-0.529-7.509c0.747,0.28,1.58,0.491,2.45,0.642c-0.216,2.658-0.43,4.923,0.003,7.828C11.916,24.278,11.567,24.411,11.093,24.127zM17.219,24.329c-0.019,0.445-0.691,0.856-1.517,0.856c-0.828,0-1.498-0.413-1.517-0.858c-0.126-2.996-0.032-5.322,0.068-8.039c0.418,0.022,0.835,0.037,1.246,0.037c0.543,0,1.097-0.02,1.651-0.059C17.251,18.994,17.346,21.325,17.219,24.329zM21.476,22.892c-0.143,0.392-0.69,0.95-1.165,1.235c-0.474,0.284-0.817,0.151-0.754-0.276c0.437-2.93,0.214-5.209-0.005-7.897c0.881-0.174,1.708-0.417,2.44-0.731C22.194,17.883,22.503,20.076,21.476,22.892zM11.338,9.512c0.525,0.173,1.092-0.109,1.268-0.633h-0.002l0.771-2.316h4.56l0.771,2.316c0.14,0.419,0.53,0.685,0.949,0.685c0.104,0,0.211-0.017,0.316-0.052c0.524-0.175,0.808-0.742,0.633-1.265l-1.002-3.001c-0.136-0.407-0.518-0.683-0.945-0.683h-6.002c-0.428,0-0.812,0.275-0.948,0.683l-1,2.999C10.532,8.77,10.815,9.337,11.338,9.512z");
    rec.attr({fill: "#236B8E", stroke: "none"});
    rec.translate(850,30);
    rec.scale(4,4,0,0);

    graph = new Graph(paper);
    loadPalette(paper);   
};*/

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
            var self=this;

            if(this.items[0].data('type') === 3 || this.items[0].data('type') === 4 || this.items[0].data('type') === 5){
                this.node = new Node(this.items[0].data('type'), 'Click me');
                this.items[1].attr({text: 'Click me'});
                this.dblclick(function (){
                    var t = prompt('Inserir dados:','');
                    if(t === undefined || t.length === 0){
                            t = 'Click me';
                    }
                    self.attr({text: t});
                    self.node.data = t;
                });
            }else if(this.items[0].data('type') === 1 || this.items[0].data('type') === 2){
                this.node = new Node(this.items[0].data('type'), null);
            }
            
           graph.add(this.node);
           DragFunctions.nodes.push(this);
           //funçaõ para remocao do no selecionado
           /*this.dblclick(function (){
                for (var i = DragFunctions.lines.length; i--;) {
                    if(DragFunctions.lines[i].source.items[0] == this || DragFunctions.lines[i].target.items[0] == this || DragFunctions.lines[i].source.items[1] == this || DragFunctions.lines[i].target.items[1] == this) {
                        graph.removeline(DragFunctions.lines[i]);
                        DragFunctions.lines[i].shape.line.remove();
                        DragFunctions.lines.splice(i, 1);
                    }
                } 
                graph.remove(self.node);
                self.remove();
                DragFunctions.nodes.splice(DragFunctions.findNode(this), 1);  
            });*/
        }
    },
    //acção provocada quando se levanta o rato de um objecto da area de trabalho
    up: function (e) {
        console.log(e.clientX);
        console.log(e.clientX+160);
        if(e.which == 1) {
            if(!DragFunctions.isInsideCanvas(this)){
                this.animate({transform:'...T' + (-this.ox) + ',' + (-this.oy)}, 1000, "bounce", function() {
                    for (var i = DragFunctions.lines.length; i--;) {
                        paper.connection(DragFunctions.lines[i].shape);
                    };
                });
            }
            if(bin.isPointInside(this.xx,this.yy)){
                console.log(bin.realPath);
                console.log(this.xx, this.yy);
                for (var i = DragFunctions.lines.length; i--;) {
                    var shape = this.items[0];
                    if(DragFunctions.lines[i].source.items[0] == shape || DragFunctions.lines[i].target.items[0] == shape || DragFunctions.lines[i].source.items[1] == shape || DragFunctions.lines[i].target.items[1] == shape) {
                        graph.removeline(DragFunctions.lines[i]);
                        DragFunctions.lines[i].shape.line.remove();
                        DragFunctions.lines.splice(i, 1);
                    }
                } 
                graph.remove(this.node);
                this.remove();
                DragFunctions.nodes.splice(DragFunctions.findNode(this), 1);  
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
            if(nn != undefined && this != DragFunctions.getElement(nn)){
                //caso ainda nao exista linha ja definida
                if(!DragFunctions.checkLine(this, DragFunctions.getElement(nn)) && !DragFunctions.checkLine(DragFunctions.getElement(nn),this)){
                    var linha = new Connection(paper, this, DragFunctions.getElement(nn));
                    DragFunctions.lines.push(linha);
                    graph.lines.push(linha);
                }
                /*if(nn.items == undefined){
                    var linha = new Connection(paper, this, nn);
                    DragFunctions.lines.push(linha);
                    graph.lines.push(linha);
                }*/
            }
        }
    },
        //Verifica se o obj se encontra dentro da area de trabalho
        isInsideCanvas: function(obj){
            var canvasBBox = pitch.getBBox();
            var objectBBox = obj.getBBox();
            var objectPartiallyOutside = !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x, objectBBox.y) || !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x, objectBBox.y2) || !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x2, objectBBox.y) || !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x2, objectBBox.y2);
            return !(objectPartiallyOutside);
        },
        //verifica se a ligacao ja existe
        checkLine: function(source,target){
            for (var i = DragFunctions.lines.length - 1; i >= 0; i--) {
                if(DragFunctions.lines[i].source == source && DragFunctions.lines[i].target == target){
                    return true;
                }
            };
            return false;
        },
        //Pesquisa um set Raphael e devolve o seu node do array nodes
        getElement: function(shape){
            for (var i = DragFunctions.nodes.length - 1; i >= 0; i--) {
                if(DragFunctions.nodes[i].items[0] == shape){
                    return DragFunctions.nodes[i];
                }
            };
        },
        //Adiciona Capacidades de drag and drop ao comSet(Para objectos da área de trabalho)
        addDragAndDropCapabilityToSet: function(compSet) {
            compSet.drag(this.move, this.start, this.up, compSet, compSet, compSet);
        },
        //Adiciona capacidade de drag and drop ao compset(Para objectos da pallete)
        addDragAndDropCapabilityToPaletteOption:function (compSet) {
            compSet.drag(this.move, this.paletteStart, this.paletteUp, compSet, compSet, compSet);
        }
};

var paletteOptions = {
         "begin"  :{type:1, color:"red", path:"M0,15 C0,15 0,0 15,0 L85,0 C85,0 100,0 100,15 C100,15 100,30 85,30 L15,30 C15,30 0,30 0,15 Z"},
         "end"    :{type:2, color:"red", path:"M0,15 C0,15 0,0 15,0 L85,0 C85,0 100,0 100,15 C100,15 100,30 85,30 L15,30 C15,30 0,30 0,15 Z"},
         "write"  :{type:3, color:"yellow", path:"M20,0 L100,0 L100,70 L0,70 L0,20 L20,0 Z"},
         "read"   :{type:4, color:"green", path:"M20,0 L100,0 L80,70 L0,70 L20,0 Z"},
         "process":{type:6, color:"orange", path:"M0,0 L100,0 L100,70 L0,70 L0,0 Z"},
         "if"     :{type:5, color:"blue", path:"M50,0 L100,50 L50,100 L0,50 L50,0 Z"},
         "return" :{type:7, color:"brown", path:"M0,15 L15,0 L85,0 C85,0 100,0 100,15 C100,15 100,30 85,30 L15,30 L0,15 Z"},
         "join"   :{type:8, color:"yellow", path:"M0,15 C0,15 0,0 15,0 C15,0 30,0 30,15 C30,15 30,30 15,30 C15,30 0,30 0,15  Z"},
         "comment":{type:9, color:"yellow", path:"M0,0 L100,0 L100,50 L30,50 L20,60 L10,50 L0,50 L0,0 z"}
     };

var loadPitch = function (paper, xmax, ymax) {
    var pitch = paper.rect(110,0,xmax,ymax,10); // 10 para os cantos 
    pitch.attr({stroke: "orange"});
    pitch.transform("...T110,");
    return pitch;
};
/*
    Carrega a palete
*/
var loadPalette = function(paper){
    optionsSet = paper.set();
    var paletteBorder = paper.rect(0,0,110,pitch.getBBox().height,10).attr({stroke: "black"});
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
