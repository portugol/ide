var paper;
var graph;
var pitch;

var DragFunctions = function(){
    paper = Raphael('canvas', '100%','100%');
    graph = new Graph(paper); 
    pitch = loadPitch(paper);
    loadPalette(paper); 
    this.graph = graph;
};
var dragndrop = {
    nodes:[],
    lines:[],

    move: function (dx, dy, x, y, e) {
        var new_x = dx - this.ox;
        var new_y = dy - this.oy;
        this.ox = dx;
        this.oy = dy;
        this.xx = x;
        this.yy = y;
        if(e.which == 1) {
            this.transform('...T' + new_x + ',' + new_y);
            for (var i = dragndrop.lines.length; i--;) {
                paper.connection(dragndrop.lines[i].shape);
            };
        }
    },

    start:function (x,y,e) {
        this.ox = 0;
        this.oy = 0;
        if(e.which == 1) {
            this.animate({"opacity":0.5}, 500);
        }
    },
    //acção provocada quando se levanta o rato de um objecto da area de trabalho
    up: function (e) {
        if(e.which == 1) {
            if(!dragndrop.isInsideCanvas(this)){
                this.animate({transform:'...T' + (-this.ox) + ',' + (-this.oy)}, 1000, "bounce", function() {
                    for (var i = dragndrop.lines.length; i--;) {
                        paper.connection(dragndrop.lines[i].shape);
                    };
                });
            }
            this.animate({"opacity": 1}, 500);
        } else if(e.which == 3 && paper.getElementByPoint(this.xx,this.yy) != null) {
            //procura o elemento pelas coordenadas do rato
            var nn = paper.getElementByPoint(this.xx,this.yy);
            //se nn estiver definido e não for ele mesmo
            if(nn != undefined && this != dragndrop.getElement(nn)){
                //caso ainda nao exista linha ja definida
                console.log(dragndrop.checkLine(this, dragndrop.getElement(nn)))
                if(!dragndrop.checkLine(this, dragndrop.getElement(nn))){
                    var linha = new Connection(paper, this, dragndrop.getElement(nn));
                    dragndrop.lines.push(linha);
                    graph.lines.push(linha);
                }
            }
        }
    },

    paletteStart:function () {
        this.ox = 0;
        this.oy = 0;

        var newPaletteObj = this.clone();
        newPaletteObj.data('type',this.items[0].data('type'));
        ShapesSet.exclude(this);
        ShapesSet.push(newPaletteObj);
        dragndrop.addDragAndDropCapabilityToPaletteOption(newPaletteObj);
        this.animate({"opacity":0.5}, 500);
    },

    paletteUp: function(){
        if(!dragndrop.isInsideCanvas(this)){
            this.remove();
        }else{
            this.undrag();

            dragndrop.addDragAndDropCapabilityToSet(this);
            this.animate({"opacity":1}, 500);
            var self=this;
            var type = this.items[0].data('type');
            if(type === 3 || type === 4 || type === 5 || type === 6){
                this.node = new Node(type, 'Click me');
                this.items[1].attr({text: 'Click me'});
                this.dblclick(function (){
                    var t = prompt('Inserir dados:','');
                    if(t === undefined || t.length === 0){
                            t = 'Click me';
                    }
                    self.attr({text: t});
                    self.node.data = t;
                });
                if(type == 6){
                    this.node.nextfalse = null;
                    this.node.nexttrue = null;
                }
            }else if(type === 1 || type === 2 || type === 7){
                this.node = new Node(type, null);
            }
              //funçaõ para remocao do no selecionado
           this.dblclick(function (){
                for (var i = dragndrop.lines.length; i--;) {
                    if(dragndrop.lines[i].source.items[0] == this || dragndrop.lines[i].target.items[0] == this || dragndrop.lines[i].source.items[1] == this || dragndrop.lines[i].target.items[1] == this) {
                        graph.removeline(dragndrop.lines[i]);
                        dragndrop.lines[i].shape.line.remove();
                        dragndrop.lines.splice(i, 1);
                    }
                } 
                graph.remove(self.node);
                dragndrop.nodes.splice(dragndrop.getElement(self), 1);  
                self.remove();
            });
           graph.add(this.node);
           dragndrop.nodes.push(this);
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
        if(target.node.type < 6){
            //para cada linha existente
            for (var i = dragndrop.lines.length - 1; i >= 0; i--) {
                //se ja existir ligacao em que o alvo selecionado ja tem uma conecao para ele definida
                if(dragndrop.lines[i].target == target){
                    //a ligacao nao e possivel
                    return true;
                }
            }

        }
        if(target.node.type == 7 || target.node.type == 6){
            //para cada linha existente
            var j = 0;
            for (var i = dragndrop.lines.length - 1; i >= 0; i--) {
                //se ja existir ligacao em que o alvo selecionado ja tem uma conecao para ele definida
                if(dragndrop.lines[i].target == target){
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
        if(source.node.type >= 1  && source.node.type <= 5 || source.node.type == 7){
        //para cada linha existente
        for (var i = dragndrop.lines.length - 1; i >= 0; i--) {
            //se ja existir ligacao em que o alvo selecionado ja tem uma conecao para ele definida
            if(dragndrop.lines[i].source == source){
                //a ligacao nao e possivel
                return true;
            }
          }
        }
        //caso seja 'if'
        if(source.node.type == 6){
            //para cada linha existente
            for (var i = dragndrop.lines.length - 1; i >= 0; i--) {
                //se ja existir ligacao em que o alvo selecionado ja tem uma conecao para ele definida
                if(dragndrop.lines[i].source == source){
                    //se ja existir ligacao tanto para a ligacao verdade como para a ligacao falsa
                    if(dragndrop.lines[i].source.node.nextfalse != null && dragndrop.lines[i].source.node.nexttrue != null){
                        //a ligacao nao e possivel
                        return true;
                    }
                }
            }
          
        }
        

        return false;
    },
    //Pesquisa um set Raphael e devolve o seu node do array nodes
    getElement: function(shape){
        var element = 0;
        if(shape.type == 'text'){
            element = 1;
        }
        for (var i = dragndrop.nodes.length - 1; i >= 0; i--) {
            if(dragndrop.nodes[i].items[element] == shape){
                return dragndrop.nodes[i];
            }
            if(dragndrop.nodes[i] == shape){
                return i;
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
    },
  };

var paletteShapes = {
    "begin"  :{type:1, color:"#ffcc00", path:"M0,7 C0,7 0,0 7,0 L42,0 C42,0 50,0 50,7 C50,7 50,15 42,15 L7,15 C7,15 0,15 0,7 Z"},
    "end"    :{type:2, color:"#999999", path:"M0,7 C0,7 0,0 7,0 L42,0 C42,0 50,0 50,7 C50,7 50,15 42,15 L7,15 C7,15 0,15 0,7 Z"},
    "write"  :{type:3, color:"yellow", path:"M10,0 L50,0 L50,35 L0,35 L0,10 L10,0 Z"},
    "read"   :{type:4, color:"yellow", path:"M10,0 L50,0 L40,30 L0,30 L10,0 Z"},
    "process":{type:5, color:"yellow", path:"M0,0 L50,0 L50,35 L0,35 L0,0 Z"},
    "if"     :{type:6, color:"yellow", path:"M25,0 L50,25 L25,50 L0,25 L25,0 Z"},
    "join"   :{type:7, color:"yellow", path:"M0,8 C0,8 0,0 8,0 C8,0 15,0 15,8 C15,8 15,15 8,15 C8,15 0,15 0,8  Z"},
    "return" :{type:8, color:"yellow", path:"M0,15 L15,0 L85,0 C85,0 100,0 100,15 C100,15 100,30 85,30 L15,30 L0,15 Z"},
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

    //inicia o set com os objectos da palette
    ShapesSet = paper.set();
    //cria um rectangulo que sera usado como border
    var border = paper.rect (0,0,100,pitch.getBBox().height).attr({stroke:"blue"});
    //adiciona a border a palette
    ShapesSet.push(border);
    
    /*
       SHAPE 'BEGIN'
    */
    //criacao da shape "begin"
    var begin = paletteShapes['begin'];
    //cria o objecto raphael atraves do path guardado, com a cor guardada
    var beginimg = paper.path(begin.path).attr({"fill":begin.color});
    //cria a ancora para adicionar ao fundo do objecto
    var beginanch = paper.rect(beginimg.getBBox().width/2,beginimg.getBBox().height,2,2).attr({stroke:"none", fill:"none"});
    //adiciona o tipo ao objecto
    beginimg.data('type',begin.type);
    //cria o texto do objecto
    var begintext = paper.text(beginimg.getBBox().width/2, (beginimg.getBBox().height/2),"Inicio").attr({fill:'black'});   
    //junta todos os objectos num set
    var beginset = paper.set([beginimg,begintext,beginanch]);
    //faz um scale de 1,3 e uma translacao para acertar com a palette
    beginset.transform("S1.3T20," + 20);
    //adiciona ao set da palette o set criado em cima, que representa a shape "begin"
    ShapesSet.push(beginset);
    //da ao objecto criado a capacidade de DragnDrop
    dragndrop.addDragAndDropCapabilityToPaletteOption(beginset);

    /*
       SHAPE 'END'
    */
    //criacao da shape "end"
    var end = paletteShapes['end'];
    //cria o objecto raphael atraves do path guardado, com a cor guardada
    var endimg = paper.path(end.path).attr({"fill":end.color});
    //cria a ancora para adicionar ao topo do objecto
    var endanch = paper.rect(endimg.getBBox().width/2,-(endimg.getBBox().height/2)+5,2,2).attr({stroke:"none", fill:"none"});
    //adiciona o tipo ao objecto
    endimg.data('type',end.type);
    //cria o texto do objecto
    var endtext = paper.text(beginimg.getBBox().width/2-6, (beginimg.getBBox().height/2),"Fim").attr({fill:'black'});  
    //junta todos os objectos num set
    var endset = paper.set([endimg,endtext,endanch]);
    //faz um scale de 1,3 e uma translacao para acertar com a palette
    endset.transform("S1.3T20," + 55);
    //adiciona ao set da palette o set criado em cima, que representa a shape "end"
    ShapesSet.push(endset);
    //da ao objecto criado a capacidade de DragnDrop
    dragndrop.addDragAndDropCapabilityToPaletteOption(endset);

    /*
       SHAPE 'WRITE'
    */
    //criacao da shape "write"
    var write = paletteShapes['write'];
    //cria o objecto raphael atraves do path guardado, com a cor guardada
    var writeimg = paper.path(write.path).attr({"fill":write.color});
    //cria a ancora para adicionar ao topo do objecto
    var writeanch = paper.rect(writeimg.getBBox().width/2,-(writeimg.getBBox().height/2)+13,2,2).attr({stroke:"none", fill:"none"});
    //cria uma segunda ancora para adicionar ao fundo do objecto
    var writeanch1 = paper.rect(writeimg.getBBox().width/2,writeimg.getBBox().height+3,2,2).attr({stroke:"none", fill:"none"});
    //adiciona o tipo ao objecto
    writeimg.data('type',write.type);
    //cria o texto do objecto
    var writetext = paper.text(writeimg.getBBox().width/2,writeimg.getBBox().height/2,"Escrita").attr({fill:'black'});
    //junta todos os objectos num set
    var writeset = paper.set([writeimg,writetext,writeanch,writeanch1]);
    //faz um scale de 1,3 e uma translacao para acertar com a palette
    writeset.transform("S1.3T20," + 92);
    //adiciona ao set da palette o set criado em cima, que representa a shape "write"
    ShapesSet.push(writeset);
    //da ao objecto criado a capacidade de DragnDrop
    dragndrop.addDragAndDropCapabilityToPaletteOption(writeset);

    /*
       SHAPE 'READ'
    */
    //criacao da shape "read"
    var read = paletteShapes['read'];
    //cria o objecto raphael atraves do path guardado, com a cor guardada
    var readimg = paper.path(read.path).attr({"fill":write.color});
    //cria a ancora para adicionar ao topo do objecto
    var readanch = paper.rect(readimg.getBBox().width/2,-(readimg.getBBox().height/2)+11,2,2).attr({stroke:"none",fill:"none"});
    //cria uma segunda ancora para adicionar ao fundo do objecto
    var readanch1 = paper.rect(readimg.getBBox().width/2,readimg.getBBox().height+2,2,2).attr({stroke:"none",fill:"none"})
    //adiciona o tipo ao objecto
    readimg.data('type',read.type)
    //cria o texto do objecto
    var readtext = paper.text(readimg.getBBox().width/2,readimg.getBBox().height/2,"Leitura").attr({fill:"black"});
    //junta todos os objectos num set
    var readset = paper.set([readimg,readtext,readanch,readanch1]);
    //faz um scale de 1,3 e uma translacao para acertar com a palette
    readset.transform("S1.3T20," + 152);
    //adiciona ao set da palette o set criado em cima, que representa a shape "read"
    ShapesSet.push(readset);
    //da ao objecto criado a capacidade de DragnDrop
    dragndrop.addDragAndDropCapabilityToPaletteOption(readset);

    /*
       SHAPE 'PROCESS'
    */
    //criacao da shape "process"
    var process = paletteShapes['process'];
    //cria o objecto raphael atraves do path guardado, com a cor guardada
    var processimg = paper.path(process.path).attr({"fill":process.color});
    //cria a ancora para adicionar ao topo objecto
    var processanch = paper.rect(processimg.getBBox().width/2,-(processimg.getBBox().height/2)+13,2,2).attr({stroke:"none",fill:"none"});
    //cria uma segunda ancora para adicionar fundo ao objecto
    var processanch1 =paper.rect(processimg.getBBox().width/2,processimg.getBBox().height+2,2,2).attr({stroke:"none",fill:"none"});
    //adiciona o tipo ao objecto
    processimg.data('type',process.type);
    //cria o texto do objecto
    var processtext = paper.text(processimg.getBBox().width/2, processimg.getBBox().height/2,"Processo").attr({fill:"black"});
    //junta todos os objectos num set
    var processset = paper.set([processimg,processtext,processanch,processanch1]);
    //faz um scale de 1,3 e uma translacao para acertar com a palette
    processset.transform("S1.3T20," + 208);
    //adiciona ao set da palette o set criado em cima, que representa a shape "process"
    ShapesSet.push(processset);
    //da ao objecto criado a capacidade de DragnDrop
    dragndrop.addDragAndDropCapabilityToPaletteOption(processset);

    /*
        SHAPE 'IF'
    */
    //criacao da shape "if"
    var ifshape = paletteShapes['if'];
    //cria o objecto raphael atraves do path guardado, com a cor guardada
    var ifimg = paper.path(ifshape.path).attr({"fill":ifshape.color});
    //cria a ancora para adicionar ao topo objecto
    var ifanch = paper.rect(ifimg.getBBox().width/2-1,-(ifimg.getBBox().height/2)+17,2,2).attr({stroke:"none",fill:"blue"});
    //cria uma segunda ancora para adicionar ao lado do objecto
    var ifanch1 = paper.rect(-(ifimg.getBBox().width/2)+17,(ifimg.getBBox().height/2)-1,2,2).attr({stroke:"none",fill:"blue"});
    //cria uma terceira ancora para adicionar ao outro lado do objecto
    var ifanch2 = paper.rect(ifimg.getBBox().width+6,(ifimg.getBBox().height/2)-1,2,2).attr({stroke:"none",fill:"blue"});
    //cria uma quarta ancora para adicionar ao fundo do objecto
    var ifanch3 = paper.rect(ifimg.getBBox().width/2-1,(ifimg.getBBox().height)+6,2,2).attr({stroke:"none",fill:"blue"});
    //adiciona o tipo ao objecto
    ifimg.data('type',ifshape.type);
    //cria o texto do objecto
    var iftext = paper.text(ifimg.getBBox().width/2, ifimg.getBBox().height/2,"Se").attr({fill:"black"});
    //junta todos os objectos num set
    var ifset = paper.set([ifimg,iftext,ifanch,ifanch1,ifanch2,ifanch3]);
    //faz um scale de 1,3 e uma translacao para acertar com a palette
    ifset.transform("S1.3T20,"+272);
    //adiciona ao set da palette o set criado em cima, que representa a shape "if"
    ShapesSet.push(ifset);
    //da ao objecto criado a capacidade de DragnDrop
    dragndrop.addDragAndDropCapabilityToPaletteOption(ifset);
    console.log(ifset)

    /*
        SHAPE 'JOIN'
    */
    //criacao da shape 'join'
    var join = paletteShapes['join'];
    //cria o objecto rapahael atraves do path guardado, com a cor guardada
    var joinimg = paper.path(join.path).attr({"fill":join.color});
    //cria uma segunda ancora para adicionar ao lado do objecto 
    var joinanch1 = paper.rect(-joinimg.getBBox().width/2+5,joinimg.getBBox().height/2,2,2).attr({stroke:"none",fill:"red"});
    //cria uma terceira ancora para adicionar ao outro lado do objecto
    var joinanch2 = paper.rect(joinimg.getBBox().width,joinimg.getBBox().height/2,2,2).attr({stroke:"none",fill:"red"});
    //cria uma quarta ancora para adicionar no fundo do objecto
    var joinanch3 = paper.rect(joinimg.getBBox().width/2-1,joinimg.getBBox().height,2,2).attr({stroke:"none",fill:"red"});
    //adiciona o tipo ao objecto
    joinimg.data('type',join.type);
    //cria o texto do objecto 
    var jointext = paper.text(joinimg.getBBox().width/2, joinimg.getBBox().height+8,"Juncao").attr({fill:"black"});
    //junta todos os objectos num set
    var joinset = paper.set([joinimg,joinanch1,joinanch2,joinanch3]);
    //faz um scale de 1,3 e uma translacao para acertar com a palette
    joinset.transform("S1.3T40,"+342);
    //faz um scale de 1,3 e uma translacao para acertar o texto com a palette
    jointext.transform("S1.3T40,"+342);
    //adiciona ao set da palette o set criado em cima, que representa a shape "join"
    ShapesSet.push(joinset);
    //da ao objecto criado a capacidade de DragnDrop
    dragndrop.addDragAndDropCapabilityToPaletteOption(joinset);

  };