// Variaveis globais
// canvas do raphael
var paper;
// estrutura de dados de logica do portugol
var graph;
// Area de desenho
var pitch;
var bin;
var selSet;
var hasSelection=false;
var multipleSelection=false;
var dragging=false;
var active = true;
var previous;
var running;
var openmenu = false;

/*
*
*
*/
var DragFunctions = function(){
    var w = window.innerWidth;
    w=w-305;
    var h = window.innerHeight;
    paper = Raphael('canvas', '100%',h + 1000);
    graph = new Graph(paper); 
    pitch = this.loadPitch(paper, w, h + 1000).attr({fill: "url('./img/panel.png')" , stroke: "black"});
    this.loadPalette(paper,0,0);
    move = ShapesSet; 
    this.graph = graph;
    selSet = paper.set();

    this.nodes = [];
    this.lines = [];
    self = this;
};

/*
*   Evento que espera que o utilizdor carregue na tecla del
*
*/
document.addEventListener('keydown', function(event) {
    if(event.keyCode == 46) {
        self.deleteSet();
    }
});

/*
*   Metodo que permite redesenhar a Board quando e feito um rezise a janela de browser
*
*/
window.onresize=function(){
    var w = window.innerWidth;
    w=w-305;
    var h = window.innerHeight;
    this.paper.setSize(w+305,h+1000);
    this.pitch.attr({stroke: "none"});
    this.pitch = paper.rect(140,0,w-10,h+1000,10);

};

/*
*   Metodo que permite redesenhar a Board quando e feito um rezise a janela de browser
*
*/
$(window).scroll(function() {
    var scroll = $(window).scrollTop();
    ShapesSet.remove();
    loadPalette(paper,0,scroll);
});

/*
*   Metodo que faz o highlight da forma seguinte quando esta a correr no step by step
*
*/
DragFunctions.prototype.stepHighlight = function(actualId,previousId){
    this.highlight("#4DBCE9",actualId, previousId);
};

/*
*   Metodo que faz o highlight quando a um erro na forma
*
*/
DragFunctions.prototype.errorHighlight = function(id){
    this.highlight("#FF0011",id);
};

/*
*   Metodo que tira o highlight de todas formas
*
*/
DragFunctions.prototype.reverseHighlight = function(id){
    this.restore(id);
};

/*
*
*
*/
DragFunctions.prototype.reverseAll = function(){
    for(var i=0; i<this.graph.nodes.length; i++){
        this.restore(this.graph.nodes[i].uuid);
    }
};

/*
*   Metodo que tira todos os metodos drag's das formas que estao na palette e na area de desenho
*
*/
DragFunctions.prototype.undragAll = function(){
    for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].undrag();
    };
    selSet.undrag();
    ShapesSet.undrag();
    pitch.undrag();
};


/*
*   Metodo que dar todos os metodos drag's das formas que estao na palette e na area de desenho
*
*/
DragFunctions.prototype.dragAll = function(){
    for(var i=0; i<ShapesSet.length; i++){
        this.addDragAndDropCapabilityToPaletteOption(ShapesSet[i]);
    }
    for(var j=0; j<this.nodes.length; j++){
        this.addDragAndDropCapabilityToSet(this.nodes[j]);
    }
    pitch.drag(this.pitchMove,this.pitchStart,this.pitchUp);
};

/*
* 
*
*/
DragFunctions.prototype.move = function (dx, dy, x, y, e) {
    var new_x = dx - this.ox;
    var new_y = dy - this.oy;
    this.ox = dx;
    this.oy = dy;
    this.xx = x;
    this.yy = y;
    if(e.which == 1) {
        this.transform('...T' + new_x + ',' + new_y);
        for (var i = self.lines.length; i--;) {
            paper.connection(self.lines[i].shape);
        };
    }
};

/*
*
*
*/
DragFunctions.prototype.start = function (x,y,e) {
    this.ox = 0;
    this.oy = 0;
    if(e.which == 1){
        if(this[0].attrs.fill != paletteShapes[this.node.type].color){
            self.restore(this.node.uuid);
        }
        this.animate({"opacity":0.5}, 500);
        if(hasSelection){
            if(multipleSelection){
                if(!self.isInSelection(this)){
                    self.resetSelection();
                    selSet.push(this);
                    self.selectedStyle();
                    hasSelection=true;
                }else{
                    for (var i = selSet.length - 1; i >= 0; i--) {
                        selSet[i].items[0].attr({opacity:0.5}); 
                    };
                }
            }else{
                self.resetSelection();
                selSet.push(this);
                self.selectedStyle();
            }
        }else{
            self.resetSelection();
            selSet.push(this);
            self.selectedStyle();
            hasSelection=true;
        }
        ox = event.screenX;
        oy = event.screenY;
        dragging = true;
        if( openmenu==true){
            $('#contextmenu').slideUp('fast');
            openmenu=false;
        }
    }
    if (e.which == 3) {
        if(openmenu==false ){
            e.preventDefault();
            var posx = e.pageX - $('#canvas').offset().left;
            var posy = e.pageY - $('#canvas').offset().top;
            $('#contextmenu').css('position', 'absolute');
            $('#contextmenu').css('left', posx);
            $('#contextmenu').css('top', posy);
            $('#contextmenu').slideDown('fast');
            openmenu=true;
        } else{
            $('#contextmenu').slideUp('fast')
            openmenu=false;
        }     
    }
};

/*
* acção provocada quando se levanta o rato de um objecto da area de trabalho
*
*/
DragFunctions.prototype.up = function (e) {      
    if(e.which == 1) {
        if(!self.isInside(selSet,pitch)){
            selSet.animate({transform:'...T' + (-this.ox) + ',' + (-this.oy)}, 1000, "bounce", function() {
                for (var i = self.lines.length; i--;) {
                    paper.connection(self.lines[i].shape);
                };
            });
        }else{
            this.node.dx = this.getBBox().x;
            this.node.dy = this.getBBox().y;
        }
    } 
};

/*
*
*
*/
DragFunctions.prototype.shapeMove = function (dx, dy, x, y, e) {
    var new_x = dx - this.ox;
    var new_y = dy - this.oy;
    this.ox = dx;
    this.oy = dy;
    this.xx = x;
    this.yy = y;
    if(e.which == 1) {
        selSet.transform('...T' + new_x + ',' + new_y);
        for (var i = self.lines.length; i--;) {
            paper.connection(self.lines[i].shape);
        };
    }
};

/*
* Metodo que verifica se as formas estao dentro da selecao
*
*/   
DragFunctions.prototype.isInSelection = function(shape){
    for (var i=0; i < selSet.length; i++) {
        if(selSet[i]==shape){
            return true;
        }
    }
    return false;
};
  
/*
* Metodo que serve de suporte a funcao drag do raphael e que faz acção provocada quando se inicia o click do rato num objecto da palette
*
*/  
DragFunctions.prototype.pitchStart = function(x,y){
    box = paper.rect(x, y, 1, 1).attr("stroke", "#9999FF");
};

/*
* Metodo que serve de suporte a funcao drag do raphael e que faz acção provocada quando se move com o rato um objecto da palette
*
*/
DragFunctions.prototype.pitchMove = function(dx,dy,x,y){
    var xoffset = 0,
    yoffset = 0;
    if (dx < 0) {
        xoffset = dx;
        dx = -1 * dx;
    }
    if (dy < 0) {
        yoffset = dy;
        dy = -1 * dy;
    }
    box.transform("T" + xoffset + "," + yoffset);
    box.attr("width", dx);
    box.attr("height", dy);
};

/*
* Metodo que serve de suporte a funcao drag do raphael e que faz acção provocada quando se levanta o rato de um objecto da palette
*
*/
DragFunctions.prototype.pitchUp = function(){
    //limpar set da seleção anterior
    self.resetSelection(); 
    var bounds = box.getBBox();
    box.remove();
    for (var c in self.nodes) {
        var mybounds = self.nodes[c].getBBox();
        if (mybounds.x >= bounds.x && mybounds.x <= bounds.x2 || mybounds.x2 >= bounds.x && mybounds.x2 <= bounds.x2) {
        if (mybounds.y >= bounds.y && mybounds.y <= bounds.y2 || mybounds.y2 >= bounds.y && mybounds.y2 <= bounds.y2) {
                selSet.push(self.nodes[c]);
            }
        }
    }
    if(selSet.length!==0){
        if(selSet.length>1){
            multipleSelection=true;
        }
        else {
            multipleSelection=false;
        }
        self.selectedStyle();
        hasSelection=true;
    }
    else{
        hasSelection=false;
        multipleSelection=false;
    }
};

/*
*
*
*/
DragFunctions.prototype.selectedStyle = function(){
    for (var i = selSet.length - 1; i >= 0; i--) {
        selSet[i].attr({opacity:0.5});
    };
};

/*
*  
*
*/
DragFunctions.prototype.resetSelection = function(){
    console.log("reset")
    if( openmenu==true){
        $('#contextmenu').slideUp('fast');
        openmenu=false;
    }
    for (var i = selSet.length - 1; i >= 0; i--) {
        selSet[i].attr({opacity:1});
    };
    hasSelection=false;
    multipleSelection=false;
    selSet=paper.set();
};

/*
* Metodo que serve de suporte a funcao drag do raphael e que faz acção provocada quando se faz click do rato num objecto da palette
*
*/
DragFunctions.prototype.paletteStart = function () {
    self.resetSelection(); 
    this.ox = 0;
    this.oy = 0;
    var newPaletteObj = this.clone();
    newPaletteObj.data('type',this.items[0].data('type'));
    ShapesSet.exclude(this);
    ShapesSet.push(newPaletteObj);
    if(this.items[0].data('type') == 7){
        this.items[4].remove();
    }
    self.addDragAndDropCapabilityToPaletteOption(newPaletteObj);
    this.animate({"opacity":0.5}, 500);
};

/*
* Metodo que serve de suporte a funcao drag do raphael e que faz acção provocada quando se levanta o rato de um objecto da palette
*
*/
DragFunctions.prototype.paletteUp = function(){
    if(!self.isInside(this,pitch)){
        this.remove();
    }else{
        this.undrag();
        self.addDragAndDropCapabilityToSet(this);
        self.addHover(this);
        var self1=this;
        id = this[0].id;
        var type = this.items[0].data('type');
        var x = this.getBBox().x;
        var y = this.getBBox().y;
        var type = this.items[0].data('type');
        if(type != 7){
            this.node = new Node(type, this.items[1].attrs.text, id,x,y);
            this.items[1].attr({text: this.items[1].attrs.text});
            this.dblclick(function (){
                if(!running){
                    running = true;
                    console.log(self1.node.data.split('"'))
                   apprise('Introduza texto:',{
                    'confirm' : true,
                    'input' :  self1.node.data.toString(), 
                    'textOk' : 'Ok',
                    'textCancel' : 'Cancelar', 
                },function(t) {
                    if(t){
                        self1.items[1].attr({text: t});
                        self1.node.data = t;
                     }
                     running = false;
                });
                }
            });
            if(type == 6){
                this.node.nextfalse = null;
                this.node.nexttrue = null;
            }
        }else{
            this.node = new Node(type, null,id,x,y);
        }

       graph.add(this.node);
       self.nodes.push(this);
       selSet.push(this);
       self.selectedStyle();
    }
};
    
/*
*   Metodo deVerifica se o obj se encontra dentro da area de trabalho 
*
*/
DragFunctions.prototype.isInside = function(obj,obj2){
    var canvasBBox = obj2.getBBox();
    var objectBBox = obj.getBBox();
    var objectPartiallyOutside = !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x, objectBBox.y) || !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x, objectBBox.y2) || !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x2, objectBBox.y) || !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x2, objectBBox.y2);
    return !(objectPartiallyOutside);
};

/*
*   Metodo que verifica se a ligacao ja existe
*
*/
DragFunctions.prototype.checkLine = function(source,target){
    if(target == undefined || source == undefined){
        return true;
    }
    //iremos verificar o tipo do alvo da ligacao
    //caso seja 'begin' 
    if(target.node.type == 1){
        //a ligacao nao e possivel
        return true;
    }
    //caso seja 'end','write','read','process','if' verifica se os alvo ja tem linha para ele definida
    if(target.node.type < 6 || target.node.type == 8){
        //para cada linha existente
        for (var i = this.lines.length - 1; i >= 0; i--) {
            //se ja existir ligacao em que o alvo selecionado ja tem uma conecao para ele definida
            if(this.lines[i].target == target){
                //a ligacao nao e possivel
                return true;
            }
        }

    }
    if(target.node.type == 7 || target.node.type == 6){
        //para cada linha existente
        var j = 0;
        for (var i = this.lines.length - 1; i >= 0; i--) {
            //se ja existir ligacao em que o alvo selecionado ja tem uma conecao para ele definida
            if(this.lines[i].target == target){
                j++
                //a ligacao nao e possivel
                if(j == 2){
                    return true;
                }
            }
        }
    }

    //iremos verificar o tipo da origrm da ligacao
    //caso seja 'end' 
    if(source.node.type == 2){
        //a ligacao nao e possivel
        return true;
    }
    //caso seja 'begin','write','read','process','join'
    if(source.node.type >= 1  && source.node.type <= 5 || source.node.type == 7 || source.node.type == 8){
    //para cada linha existente
    for (var i = this.lines.length - 1; i >= 0; i--) {
        //se ja existir ligacao em que o alvo selecionado ja tem uma conecao para ele definida
        if(this.lines[i].source == source){
            //a ligacao nao e possivel
            return true;
        }
      }
    }
    //caso seja 'if'
    if(source.node.type == 6){
        //para cada linha existente
        for (var i = this.lines.length - 1; i >= 0; i--) {
            //se ja existir ligacao em que o alvo selecionado ja tem uma conecao para ele definida
            if(this.lines[i].source == source){
                //se ja existir ligacao tanto para a ligacao verdade como para a ligacao falsa
                if(this.lines[i].source.node.nextfalse != null && this.lines[i].source.node.nexttrue != null){
                    //a ligacao nao e possivel
                    return true;
                }
            }
        }
    }

    return false;
};

/*
* Metodo que serve para remover as conecoes dependentes das formas que sao apagar
*
*/
DragFunctions.prototype.removeLine = function(shape){
    for (var i = this.lines.length; i--;) {
        if(this.lines[i].source == shape || this.lines[i].target == shape || this.lines[i].source == shape || this.lines[i].target == shape) {
            graph.removeline(this.lines[i]);
            this.lines[i].shape.line.remove();
            this.lines.splice(i, 1);
        }
        if(this.lines[i] == shape){
            graph.removeline(this.lines[i]);
            this.lines[i].shape.line.remove();
            this.lines.splice(i, 1);
        }
    }
};

/*
* Metodo que Pesquisa um set Raphael e devolve o seu node do array nodes
*
*/
DragFunctions.prototype.getElement = function(shape){
    var element = 0;
    if(shape.type == 'text'){
        element = 1;
    }
    if(shape.type == 'rect'){
        element = 2;
    }
    for (var i = this.nodes.length - 1; i >= 0; i--) {
        if(this.nodes[i].items[element] == shape){
            return this.nodes[i];
        }
        if(this.nodes[i] == shape){
            return i;
        }
    };
    return null;
};

/*
* Metodo que devolve um determinada forma ao qual o uuid é correspondente
*
*/
DragFunctions.prototype.getShape = function(uuid){
    for (var i = this.nodes.length - 1; i >= 0; i--) {
        if(this.nodes[i].node.uuid == uuid){
            return this.nodes[i];
        }
    };
};

/*
* Metodo de adiciona Capacidades de drag and drop ao comSet(Para objectos da área de trabalho)
*
*/
DragFunctions.prototype.addDragAndDropCapabilityToSet =  function(compSet) {
    compSet.drag(this.shapeMove, this.start, this.up, compSet, compSet, compSet);
};

/* 
*  Metodo que adiciona capacidade de drag and drop ao compset(Para objectos da pallete)
*
*/
DragFunctions.prototype.addDragAndDropCapabilityToPaletteOption = function (compSet) {
    compSet.drag(this.move, this.paletteStart, this.paletteUp, compSet, compSet, compSet);
};

/*
* Metodo que adiciona uma borda a forma na qual o rato esta em cima
*
*/
DragFunctions.prototype.addHover = function(compSet){
    compSet.hover(function(){
        compSet.items[0].attr({stroke: '#000'});
    },function(){
        compSet.items[0].attr({stroke: 'none'});
    });
};

/*
* Metodo que fazer o highligth de uma forma, para o step by step ou para quando existe um erro
*
*/
DragFunctions.prototype.highlight = function(color, actualId, previousId){
    color=color||"#4DBCE9";
    var self=this;
    var node;
    var previousNode;
    var highlighting=true;
    //procura o id no array de nos
    if(previousId===undefined){
        node = this.getShape(actualId)[0];
        node.animate({ fill: color}, 300,'linear');
    }
    else{
        node = this.getShape(actualId)[0];
        previousNode = this.getShape(previousId)[0];
        node.animate({ fill: color}, 300,'linear');
        previousNode.animate({ fill: paletteShapes[previousNode.data('type')].color},300,'linear');
    }
};

/*
*
*
*/ 
DragFunctions.prototype.jsontographic = function(json){
    var aux =JSON.parse(json);
    for (var i = 0; i < aux.length ; i++) {
        this.nodetograph(aux[i].root);
    };
};

/*
*   
*
*/
DragFunctions.prototype.nodetograph = function(node,previous,callback){
    var self = this;
    //verifica se a shape ja existe
    if(this.getShape(node.uuid) == null){
        //se nao cria a nova shape
        var shape = this.addShape(node);
    }else{
        //caso exista atribui-lhe a shape existente
        var shape = this.getShape(node.uuid);
        if(node.type == 6){
            var ifshape = true;
        }
    }
    //caso seja enviada uma shape anterior
    if(previous != null){
        //cria a nova ligacao
        var line = new Connection(paper, previous, shape)   
        //adiciona a nova ligacao aos arrays correspondentes
        this.lines.push(line); 
        graph.lines.push(line);
    }
    //se for um 'if' e não tiver sido previamente criado(prevenir loops)
    if(node.type == 6 && !ifshape){
        //percorre o no falso do no
        this.nodetograph(node.nexttrue,shape, function() {
            self.nodetograph(node.nextfalse,shape);
        });    
    }else{
        //enquanto nao chegar à ultima conecao
        if(node.next != null){
            //vai para a shape seguinte
            this.nodetograph(node.next,shape);
        }else{
            //acaba
            return;
        }
    }

    if(callback != undefined){
        callback();
    }
};

/*
* Metodo que limpa a area de desenho 
* Apagando tambem todas as estruturas de dados
*
*/
DragFunctions.prototype.graphclean = function(){
    for (var i = this.lines.length; i--;) {
        graph.removeline(this.lines[i]);
        this.lines[i].shape.line.remove();
        this.lines.splice(i, 1);
    }
    //guarda o n de formas no graph
    var size = this.nodes.length;
    for (var i =  size-1; i >= 0; i--){
        graph.remove(this.nodes[i].node);
        this.nodes[i].remove(); 
        this.nodes.splice(this.getElement(this.nodes[i]), 1);
     };                 
};

/*
* Metodo que redesenha é usada para redesenhar as formas do fluxograma quando vindas da base de dados
*
*/
DragFunctions.prototype.addShape = function(node){
    //procura na pallete pelo tipo de shape e adiciona-a
    for (var i = ShapesSet.length - 1; i >= 1; i--) {
        if(ShapesSet[i][0].data('type') == node.type){
            //atribui a nova forma a shape que estava na palette 
            var newShape = ShapesSet[i];
            //coloca um clone na palette
            var cloneShape = ShapesSet[i].clone();
            //da o tipo a nova forma
            cloneShape.data('type',node.type);
            //retira do array da palette a shape escolhida
            ShapesSet.exclude(ShapesSet[i]);
            //coloca no array da palette o clone criado
            ShapesSet.push(cloneShape);
            //da capacidades de dragndrop a shape clone
            this.addDragAndDropCapabilityToPaletteOption(cloneShape);
        }
    }
    //atribui o texto a shape
    newShape.items[1].attr({'text':node.data});
    var dx = node.dx;
    var dy = node.dy;
    //coloca a shape na posicao 0,0
    dx = dx-27;
    dy = dy-paletteShapes[node.type].yoffset+8;
    //acertos na posicao grafica
    if(node.type == 7){
        dx = dx - 25;
        dy = dy -4;
    }
    //acertos na posicao grafica
    if(node.type == 2 || node.type == 1 || node.type == 8 ){
        dy = dy - 4;
    }
    if(node.type == 6){
        dy = dy+4;
    }
    //coloca a shape no seu lugar previo
    newShape.transform("...T"+dx+","+dy);
    //retira as propriedades de dragndrop
    newShape.undrag();
    //atribui o efecto hover, capacidades dragndrop
    this.addHover(newShape);
    this.addDragAndDropCapabilityToSet(newShape);
    //coloca o no no array de shapes
    this.nodes.push(newShape);
    //adiciona o a shape o seu no
    newShape.node = new Node(node.type,node.data,node.uuid,newShape.getBBox().x,newShape.getBBox().y);
    
    if(newShape.node.type == 6){
        newShape.node.nexttrue = null;
        newShape.node.nextfalse = null;
    }
    //adiciona aos array de nos do graph o no criado
    graph.nodes.push(newShape.node);
    if(node.type != 7){
        newShape.dblclick(function (){
            if(!running){
                apprise('Introduza texto:',{
                        'confirm' : true,
                        'input' :  unescape(escape(newShape.node.data)), 
                        'textOk' : 'Ok',
                        'textCancel' : 'Cancelar', 
                    },function(t) {
                        if(t){
                            newShape.items[1].attr({text: t});
                            newShape.node.data = t;
                        }
                });
            }
        });
    }else{
       newShape.items[4].remove(); 
    }
    return newShape;
};

/*
*
*
*/
DragFunctions.prototype.setToConnect = function(){
    //reseta todas as variaveis do modo seleccao 
    this.resetSelection();
    running = true;
    //para todas as shapes presentes na pallete
    for (var i = ShapesSet.length - 1; i >= 0; i--) {
        ShapesSet[i].undrag();
        ShapesSet[i].drag(
        function(){
        },
        function(x,y,e){
            if(e.which == 1){
                window.onmousemove = null;
                if(previous != null){
                    previous.line.shape.line.remove();
                }  
            }
        },
        function(){
        }
    );
    };
    //para todas as shapes presentes no set
    for (var i = this.nodes.length - 1; i >= 0; i--) {
        //retira o evento drag de 
        this.nodes[i].undrag();
        //atribui o novo evento de drag para a criação de ligações
        this.nodes[i].drag(
            function(){
            },
            function(x,y,e) {
                self1 = self.getElement(this);
                if(e.which == 1){
                    var posx = e.pageX - $('#canvas').offset().left;
                    var posy = e.pageY - $('#canvas').offset().top;
                    if(window.onmousemove){
                        window.onmousemove = null;
                        if(self != previous){
                            //caso ainda nao exista linha ja definida
                            if(!self.checkLine(previous, self1)){
                                var linha = new Connection(paper, previous, self1);
                                self.lines.push(linha);
                                graph.lines.push(linha);
                            }
                        }
                        previous.line.shape.line.remove();
                        previous = null;
                    }else{
                        var band = paper.rect(posx,posy,1,1).attr({stroke:"none", fill:"none"});
                        self1.line = new Connection(paper, self1, band);  
                        if (!window.onmousemove) {
                            window.onmousemove = function(e){
                                posx = e.pageX - $('#canvas').offset().left;
                                posy = e.pageY - $('#canvas').offset().top;
                                band.attr({x:posx,y:posy});
                                if(self1.line != undefined){
                                    paper.connection(self1.line.shape);
                                }
                                previous = self1;
                            }
                        }
                    }
                }
            },
            function(){
            });
    };
    pitch.undrag();
    //caso seja um clique na area de trabalho
    pitch.drag(
        function(){
        },
        function(x,y,e){
            if(e.which == 1){
                window.onmousemove = null;
                if(previous != null){
                    previous.line.shape.line.remove();
                }  
            }
        },
        function(){
        }
    );

};

/*
*
*
*/
DragFunctions.prototype.setToSelect = function(){
    //reseta todas as variaveis do modo seleccao anterior
    this.resetSelection(); 
    //caso se mude do modo de ligação para selecionar
    window.onmousemove = null;
    if(previous != null){
        previous.line.shape.line.remove();
    }  
    //flag para permitir a inserção de texto
    running = false;
    //para todas as shapes presentes na pallete
    for (var i = ShapesSet.length - 1; i >= 0; i--) {
       ShapesSet[i].undrag();
       this.addDragAndDropCapabilityToPaletteOption(ShapesSet[i]);
    };
    //para todas as shapes presentes no set
    for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].undrag();
        this.addDragAndDropCapabilityToSet(this.nodes[i]);
    };
    pitch.undrag();
    pitch.drag(this.pitchMove,this.pitchStart,this.pitchUp);
};

/*
*
*
*/
DragFunctions.prototype.restore = function(id){
    if(id!==undefined){
        var shape = this.getShape(id);
        if(shape!==undefined){
            shape[0].animate({ fill: paletteShapes[shape.node.type].color},300,'linear');
        }
    }
};

/*
* Metodo que apaga um forma ou um conjunto de formas
*
*/
DragFunctions.prototype.deleteSet = function(){
    if(!running){
        for(var j = 0; j<selSet.length; j++){
            this.removeLine(selSet[j]); 
            graph.remove(selSet[j].node);
            this.nodes.splice(this.getElement(selSet[j]), 1);  
            selSet[j].remove();
        }
        //apaga visualmente
        selSet.remove(); 
        selSet=paper.set();
    }
};

/*
* Metodo que Desenha e carrega a area de desenho para o fluxograma
*
*/
DragFunctions.prototype.loadPitch = function (paper, xmax, ymax) {
    var pitch = paper.rect(140,0,xmax,ymax,10); // 10 para os cantos 
    pitch.attr({stroke: "orange"});
    pitch.transform("...T140,");
    pitch.drag(this.pitchMove,this.pitchStart,this.pitchUp);
    return pitch;
};


/*
*  Metodo que Desenha e carrega a palete com todas as formas que estao no array 
*
*/
DragFunctions.prototype.loadPalette = function(paper, posx, posy){
    //inicia o set com os objectos da palette
    ShapesSet = paper.set();
    //cria um rectangulo que sera usado como border
    //var border = paper.rect (0,0,100,pitch.getBBox().height).attr({stroke:"blue"});
    var border = paper.rect(posx,posy,130,750,10).attr({stroke: "black"});
    //adiciona a border a palette
    ShapesSet.push(border);
    
    /*
       SHAPE 'BEGIN'
    */
    //criacao da shape "begin"
    var begin = paletteShapes[1];
    //cria o objecto raphael atraves do path guardado, com a cor guardada
    var beginimg = paper.path(begin.path).attr({"fill":begin.color,stroke:"none"});
    //cria a ancora para adicionar ao fundo do objecto
    var beginanch = paper.rect(beginimg.getBBox().width/2,beginimg.getBBox().height+4,2,2).attr({stroke:"none", fill:"none"});
    //adiciona o tipo ao objecto
    beginimg.data('type',1);
    //cria o texto do objecto
    var begintext = paper.text(beginimg.getBBox().width/2, (beginimg.getBBox().height/2),"Início").attr({fill:'black'});   
    //junta todos os objectos num set
    var beginset = paper.set([beginimg,begintext,beginanch]);
    //faz um scale de 1,3 e uma translacao para acertar com a palette
    beginset.transform("S1.5T40," + (begin.yoffset + posy));
    //adiciona ao set da palette o set criado em cima, que representa a shape "begin"
    ShapesSet.push(beginset);
    //da ao objecto criado a capacidade de DragnDrop
    this.addDragAndDropCapabilityToPaletteOption(beginset);

    /*
       SHAPE 'END'
    */
    //criacao da shape "end"
    var end = paletteShapes[2];
    //cria o objecto raphael atraves do path guardado, com a cor guardada
    var endimg = paper.path(end.path).attr({"fill":end.color,stroke:"none"});
    //cria a ancora para adicionar ao topo do objecto
    var endanch = paper.rect(endimg.getBBox().width/2,-(endimg.getBBox().height/2)+5,2,2).attr({stroke:"none", fill:"none"});
    //adiciona o tipo ao objecto
    endimg.data('type',2);
    //cria o texto do objecto
    var endtext = paper.text(beginimg.getBBox().width/2-13, (beginimg.getBBox().height/2-5),"Fim").attr({fill:'black'});  
    //junta todos os objectos num set
    var endset = paper.set([endimg,endtext,endanch]);
    //faz um scale de 1,3 e uma translacao para acertar com a palette
    endset.transform("S1.5T40," + (end.yoffset + posy));
    //adiciona ao set da palette o set criado em cima, que representa a shape "end"
    ShapesSet.push(endset);
    //da ao objecto criado a capacidade de DragnDrop
    this.addDragAndDropCapabilityToPaletteOption(endset);

    /*
       SHAPE 'WRITE'
    */
    //criacao da shape "write"
    var write = paletteShapes[3];
    //cria o objecto raphael atraves do path guardado, com a cor guardada
    var writeimg = paper.path(write.path).attr({"fill":write.color,stroke:"none"});
    //cria a ancora para adicionar ao topo do objecto
    var writeanch = paper.rect(writeimg.getBBox().width/2,-(writeimg.getBBox().height/2)+13,2,2).attr({stroke:"none", fill:"none"});
    //cria uma segunda ancora para adicionar ao fundo do objecto
    var writeanch1 = paper.rect(writeimg.getBBox().width/2,writeimg.getBBox().height+3,2,2).attr({stroke:"none", fill:"none"});
    //adiciona o tipo ao objecto
    writeimg.data('type',3);
    //cria o texto do objecto
    var writetext = paper.text(writeimg.getBBox().width/2,writeimg.getBBox().height/2,"Escrita").attr({fill:'black'});
    //junta todos os objectos num set
    var writeset = paper.set([writeimg,writetext,writeanch,writeanch1]);
    //faz um scale de 1,3 e uma translacao para acertar com a palette
    writeset.transform("S1.5T40," + (write.yoffset+ posy));
    //adiciona ao set da palette o set criado em cima, que representa a shape "write"
    ShapesSet.push(writeset);
    //da ao objecto criado a capacidade de DragnDrop
    this.addDragAndDropCapabilityToPaletteOption(writeset);

    /*
       SHAPE 'READ'
    */
    //criacao da shape "read"
    var read = paletteShapes[4];
    //cria o objecto raphael atraves do path guardado, com a cor guardada
    var readimg = paper.path(read.path).attr({"fill":write.color,stroke:"none"});
    //cria a ancora para adicionar ao topo do objecto
    var readanch = paper.rect(readimg.getBBox().width/2,-(readimg.getBBox().height/2)+11,2,2).attr({stroke:"none",fill:"none"});
    //cria uma segunda ancora para adicionar ao fundo do objecto
    var readanch1 = paper.rect(readimg.getBBox().width/2,readimg.getBBox().height+2,2,2).attr({stroke:"none",fill:"none"})
    //adiciona o tipo ao objecto
    readimg.data('type',4)
    //cria o texto do objecto
    var readtext = paper.text(readimg.getBBox().width/2,readimg.getBBox().height/2,"Leitura").attr({fill:"black"});
    //junta todos os objectos num set
    var readset = paper.set([readimg,readtext,readanch,readanch1]);
    //faz um scale de 1,3 e uma translacao para acertar com a palette
    readset.transform("S1.5T40," + (read.yoffset + posy));
    //read.xoffset;
    //adiciona ao set da palette o set criado em cima, que representa a shape "read"
    ShapesSet.push(readset);
    //da ao objecto criado a capacidade de DragnDrop
    this.addDragAndDropCapabilityToPaletteOption(readset);

    /*
       SHAPE 'PROCESS'
    */
    //criacao da shape "process"
    var process = paletteShapes[5];
    //cria o objecto raphael atraves do path guardado, com a cor guardada
    var processimg = paper.path(process.path).attr({"fill":process.color,stroke:"none"});
    //cria a ancora para adicionar ao topo objecto
    var processanch = paper.rect(processimg.getBBox().width/2,-(processimg.getBBox().height/2)+13,2,2).attr({stroke:"none",fill:"none"});
    //cria uma segunda ancora para adicionar fundo ao objecto
    var processanch1 =paper.rect(processimg.getBBox().width/2,processimg.getBBox().height+2,2,2).attr({stroke:"none",fill:"none"});
    //adiciona o tipo ao objecto
    processimg.data('type',5);
    //cria o texto do objecto
    var processtext = paper.text(processimg.getBBox().width/2, processimg.getBBox().height/2,"Processo").attr({fill:"black"});
    //junta todos os objectos num set
    var processset = paper.set([processimg,processtext,processanch,processanch1]);
    //faz um scale de 1,3 e uma translacao para acertar com a palette
    processset.transform("S1.5T40," + (process.yoffset + posy));
    //adiciona ao set da palette o set criado em cima, que representa a shape "process"
    ShapesSet.push(processset);
    //da ao objecto criado a capacidade de DragnDrop
    this.addDragAndDropCapabilityToPaletteOption(processset);

    /*
        SHAPE 'IF'
    */
    //criacao da shape "if"
    var ifshape = paletteShapes[6];
    //cria o objecto raphael atraves do path guardado, com a cor guardada
    var ifimg = paper.path(ifshape.path).attr({"fill":ifshape.color,stroke:"none"});
    //cria a ancora para adicionar ao topo objecto
    var ifanch = paper.rect(ifimg.getBBox().width/2-1,-(ifimg.getBBox().height/2)+17,2,2).attr({stroke:"none",fill:"none"});
    //cria uma segunda ancora para adicionar ao lado do objecto
    var ifanch1 = paper.rect(-(ifimg.getBBox().width/2)+17,(ifimg.getBBox().height/2)-1,2,2).attr({stroke:"none",fill:"none"});
    //cria uma terceira ancora para adicionar ao outro lado do objecto
    var ifanch2 = paper.rect(ifimg.getBBox().width+6,(ifimg.getBBox().height/2)-1,2,2).attr({stroke:"none",fill:"none"});
    //cria uma quarta ancora para adicionar ao fundo do objecto
    var ifanch3 = paper.rect(ifimg.getBBox().width/2-1,(ifimg.getBBox().height)+6,2,2).attr({stroke:"none",fill:"none"});
    //adiciona o tipo ao objecto
    ifimg.data('type',6);
    //cria o texto do objecto
    var iftext = paper.text(ifimg.getBBox().width/2, ifimg.getBBox().height/2,"Decisão").attr({fill:"black"});
    //junta todos os objectos num set
    var ifset = paper.set([ifimg,iftext,ifanch,ifanch1,ifanch2,ifanch3]);
    //faz um scale de 1,3 e uma translacao para acertar com a palette
    ifset.transform("S1.5T40,"+ (ifshape.yoffset + posy));
    //adiciona ao set da palette o set criado em cima, que representa a shape "if"
    ShapesSet.push(ifset);
    //da ao objecto criado a capacidade de DragnDrop
    this.addDragAndDropCapabilityToPaletteOption(ifset);
    
    /*
        SHAPE 'JOIN'
    */
    //criacao da shape 'join'
    var join = paletteShapes[7];
    //cria o objecto rapahael atraves do path guardado, com a cor guardada
    var joinimg = paper.path(join.path).attr({"fill":join.color,stroke:"none"});
    //cria uma segunda ancora para adicionar ao lado do objecto 
    var joinanch1 = paper.rect(-joinimg.getBBox().width/2+5,joinimg.getBBox().height/2,2,2).attr({stroke:"none",fill:"none"});
    //cria uma terceira ancora para adicionar ao outro lado do objecto
    var joinanch2 = paper.rect(joinimg.getBBox().width,joinimg.getBBox().height/2,2,2).attr({stroke:"none",fill:"none"});
    //cria uma quarta ancora para adicionar no fundo do objecto
    var joinanch3 = paper.rect(joinimg.getBBox().width/2-1,joinimg.getBBox().height,2,2).attr({stroke:"none",fill:"none"});
    //adiciona o tipo ao objecto
    joinimg.data('type',7);
    //cria o texto do objecto 
    var jointext = paper.text(joinimg.getBBox().width/2, joinimg.getBBox().height+8,"Junção").attr({fill:"black"});
    //junta todos os objectos num set
    var joinset = paper.set([joinimg,joinanch1,joinanch2,joinanch3,jointext]);
    //faz um scale de 1,3 e uma translacao para acertar com a palette
    joinset.transform("S1.5T57,"+(join.yoffset + posy));
    //faz um scale de 1,3 e uma translacao para acertar o texto com a palette
    jointext.transform("S1.5T57,"+(join.yoffset + posy));
    //adiciona ao set da palette o set criado em cima, que representa a shape "join"
    ShapesSet.push(joinset);
    //da ao objecto criado a capacidade de DragnDrop
    this.addDragAndDropCapabilityToPaletteOption(joinset);

    /*
        SHAPE 'RETURN'
    */
    //criacao da shape 'return'
    var returnshape = paletteShapes[8];
    //cria o objecto rapahael atraves do path guardado, com a cor guardada
    var returnimg = paper.path(returnshape.path).attr({"fill":returnshape.color,stroke:"none"});
    //cria uma segunda ancora para adicionar ao topo do objecto 
    var returnanch1 = paper.rect(returnimg.getBBox().width/2,-returnimg.getBBox().height/2+4,2,2).attr({stroke:"none",fill:"none"});
    //cria uma terceira ancora para adicionar ao fundo do objecto
    var returnanch2 = paper.rect(returnimg.getBBox().width/2,returnimg.getBBox().height+1,2,2).attr({stroke:"none",fill:"none"});
    //adiciona o tipo ao objecto
    returnimg.data('type',8);
    //cria o texto do objecto 
    var returntext = paper.text(returnimg.getBBox().width/2, returnimg.getBBox().height/2,"Retorno").attr({fill:"black"});
    //junta todos os objectos num set
    var returnset = paper.set([returnimg,returntext,returnanch1,returnanch2]);
    //faz um scale de 1,3 e uma translacao para acertar com a palette
    returnset.transform("S1.5T40,"+ (returnshape.yoffset + posy));
    //adiciona ao set da palette o set criado em cima, que representa a shape "return"
    ShapesSet.push(returnset);
    //da ao objecto criado a capacidade de DragnDrop
    this.addDragAndDropCapabilityToPaletteOption(returnset);
};


var paletteShapes = {
    1 :{color:"#EE7621", path:"M0,7 C0,7 0,0 7,0 L42,0 C42,0 50,0 50,7 C50,7 50,15 42,15 L7,15 C7,15 0,15 0,7 Z", yoffset:20},
    2 :{color:"#CD661D", path:"M0,7 C0,7 0,0 7,0 L42,0 C42,0 50,0 50,7 C50,7 50,15 42,15 L7,15 C7,15 0,15 0,7 Z", yoffset:55},
    3 :{color:"#A2CD5A", path:"M10,0 L50,0 L50,35 L0,35 L0,10 L10,0 Z", yoffset:92},
    4 :{color:"#A2CD5A", path:"M10,0 L50,0 L40,30 L0,30 L10,0 Z", yoffset:152},
    5 :{color:"orange", path:"M0,0 L50,0 L50,35 L0,35 L0,0 Z", yoffset:208},
    6 :{color:"#236B8E", path:"M25,0 L50,25 L25,50 L0,25 L25,0 Z", yoffset:272},
    7 :{color:"#8E2323", path:"M0,8 C0,8 0,0 8,0 C8,0 15,0 15,8 C15,8 15,15 8,15 C8,15 0,15 0,8  Z", yoffset:345},
    8 :{color:"brown", path:"M0,7 L7,0 L42,0 C42,0 50,0 50,7 C50,7 50,15 42,15 L7,15 L0,7 Z", yoffset:385},
};




