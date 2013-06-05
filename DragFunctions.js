var paper;
var graph;
var pitch;
var bin;

var DragFunctions = function(){
    var w = window.innerWidth;
    w=w-305;
    var h = window.innerHeight;
    paper = Raphael('canvas', '100%','100%');
    graph = new Graph(paper); 
    pitch = loadPitch(paper, w, h).attr({fill: "url('./img/panel.png')" , stroke: "black"});

    bin = paper.rect(w-70,40,100,100).attr({"fill": "none", stroke: "none"});

    rec = paper.path("M20.826,5.75l0.396,1.188c1.54,0.575,2.589,1.44,2.589,2.626c0,2.405-4.308,3.498-8.312,3.498c-4.003,0-8.311-1.093-8.311-3.498c0-1.272,1.21-2.174,2.938-2.746l0.388-1.165c-2.443,0.648-4.327,1.876-4.327,3.91v2.264c0,1.224,0.685,2.155,1.759,2.845l0.396,9.265c0,1.381,3.274,2.5,7.312,2.5c4.038,0,7.313-1.119,7.313-2.5l0.405-9.493c0.885-0.664,1.438-1.521,1.438-2.617V9.562C24.812,7.625,23.101,6.42,20.826,5.75zM11.093,24.127c-0.476-0.286-1.022-0.846-1.166-1.237c-1.007-2.76-0.73-4.921-0.529-7.509c0.747,0.28,1.58,0.491,2.45,0.642c-0.216,2.658-0.43,4.923,0.003,7.828C11.916,24.278,11.567,24.411,11.093,24.127zM17.219,24.329c-0.019,0.445-0.691,0.856-1.517,0.856c-0.828,0-1.498-0.413-1.517-0.858c-0.126-2.996-0.032-5.322,0.068-8.039c0.418,0.022,0.835,0.037,1.246,0.037c0.543,0,1.097-0.02,1.651-0.059C17.251,18.994,17.346,21.325,17.219,24.329zM21.476,22.892c-0.143,0.392-0.69,0.95-1.165,1.235c-0.474,0.284-0.817,0.151-0.754-0.276c0.437-2.93,0.214-5.209-0.005-7.897c0.881-0.174,1.708-0.417,2.44-0.731C22.194,17.883,22.503,20.076,21.476,22.892zM11.338,9.512c0.525,0.173,1.092-0.109,1.268-0.633h-0.002l0.771-2.316h4.56l0.771,2.316c0.14,0.419,0.53,0.685,0.949,0.685c0.104,0,0.211-0.017,0.316-0.052c0.524-0.175,0.808-0.742,0.633-1.265l-1.002-3.001c-0.136-0.407-0.518-0.683-0.945-0.683h-6.002c-0.428,0-0.812,0.275-0.948,0.683l-1,2.999C10.532,8.77,10.815,9.337,11.338,9.512z");
    rec.attr({fill: "#236B8E", stroke: "none"});
    rec.translate(w-85,30);
    rec.scale(4,4,0,0);

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
            if(!dragndrop.isInside(this,pitch)){
                this.animate({transform:'...T' + (-this.ox) + ',' + (-this.oy)}, 1000, "bounce", function() {
                    for (var i = dragndrop.lines.length; i--;) {
                        paper.connection(dragndrop.lines[i].shape);
                    };
                });
            }else{
                this.node.dx = this.getBBox().x;
                this.node.dy = this.getBBox().y;
            }
            this.animate({"opacity": 1}, 500);
            if(dragndrop.isInside(this,bin)){
                 for (var i = dragndrop.lines.length; i--;) {
                    if(dragndrop.lines[i].source == this || dragndrop.lines[i].target == this || dragndrop.lines[i].source == this || dragndrop.lines[i].target == this) {
                        graph.removeline(dragndrop.lines[i]);
                        dragndrop.lines[i].shape.line.remove();
                        dragndrop.lines.splice(i, 1);
                    }
                } 
                graph.remove(this.node);
                dragndrop.nodes.splice(dragndrop.getElement(this), 1);  
                this.remove(); 
            }
        } else{
            if(e.which == 3 && paper.getElementByPoint(this.xx,this.yy) != null) {
            //procura o elemento pelas coordenadas do rato
            var nn = paper.getElementByPoint(this.xx,this.yy);
            //se nn estiver definido e não for ele mesmo
            if(nn != undefined && this != dragndrop.getElement(nn)){
                //caso ainda nao exista linha ja definida
                if(!dragndrop.checkLine(this, dragndrop.getElement(nn))){
                        var linha = new Connection(paper, this, dragndrop.getElement(nn));
                        dragndrop.lines.push(linha);
                        graph.lines.push(linha);
                    }
                }
            }
        }
       //console.log(this[0].id)
       //dragndrop.highlight(this[0].id);
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
        if(!dragndrop.isInside(this,pitch)){
            this.remove();
        }else{
            this.undrag();

            dragndrop.addDragAndDropCapabilityToSet(this);
            dragndrop.addHover(this);
            this.animate({"opacity":1}, 500);
            var self=this;

            id = this[0].id;
            var type = this.items[0].data('type');
            var x = this.getBBox().x;
            var y = this.getBBox().y;
            var type = this.items[0].data('type');
            if(type != 7){
                this.node = new Node(type, 'Click me', id,x,y);
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
            }else{
                this.node = new Node(type, null,id,x,y);
            }

           graph.add(this.node);
           dragndrop.nodes.push(this);
           
           var json ='[{"root":{"type":1,"data":"Click me","uuid":4,"dx":295.5,"dy":62.25,"next":{"type":3,"data":"Click me","uuid":10,"dx":298.5,"dy":144.24999999999997,"next":{"type":2,"data":"Click me","uuid":45,"dx":351.5,"dy":293.25}}}},{"root":{"type":1,"data":"Click me","uuid":41,"dx":469.5,"dy":65.25,"next":{"type":3,"data":"Click me","uuid":37,"dx":453.5,"dy":125.25,"next":{"type":2,"data":"Click me","uuid":48,"dx":469.5,"dy":260.25}}}}]'
      
           dragndrop.jsontographic(json);
        }
    },
    
    //Verifica se o obj se encontra dentro da area de trabalho
    isInside: function(obj,obj2){
        var canvasBBox = obj2.getBBox();
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
        if(target.node.type < 6 || target.node.type == 8){
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
        if(source.node.type >= 1  && source.node.type <= 5 || source.node.type == 7 || source.node.type == 8){
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
        if(shape.type == 'rect'){
            element = 2;
        }
        for (var i = dragndrop.nodes.length - 1; i >= 0; i--) {
            if(dragndrop.nodes[i].items[element] == shape){
                return dragndrop.nodes[i];
            }
            if(dragndrop.nodes[i] == shape){
                return i;
            }
            if(dragndrop.nodes[i].items[0].id == shape){
                return dragndrop.nodes[i];
            }
        };
        return null;
    },
    //Adiciona Capacidades de drag and drop ao comSet(Para objectos da área de trabalho)
    addDragAndDropCapabilityToSet: function(compSet) {
        compSet.drag(this.move, this.start, this.up, compSet, compSet, compSet);
    },
    //Adiciona capacidade de drag and drop ao compset(Para objectos da pallete)
    addDragAndDropCapabilityToPaletteOption:function (compSet) {
        compSet.drag(this.move, this.paletteStart, this.paletteUp, compSet, compSet, compSet);
    },

    addHover: function(compSet){
        compSet.hover(function(){
            compSet.items[0].attr({stroke: '#000'});
        },function(){
            compSet.items[0].attr({stroke: 'none'});
        });
    },

    highlight: function(id){
        var node;
        //procura o id no array de nos
        for (var i = this.nodes.length - 1; i >= 0; i--) {
            if(id === this.nodes[i][0].id){
                node = this.nodes[i][0];
            }
        };
        //anima o objecto para mudar de cor com atrasso causando a sensacao de este estar a piscar
        node.animate({ fill: "red" }, 300,'bounce',function(){ node.animate({fill: paletteShapes[node.data('type')].color},300,function(){node.animate({ fill: "red" }, 300,'bounce',function(){ node.animate({"fill":paletteShapes[node.data('type')].color},300,function(){ node.animate({"fill":"red"},300)})})})});
        //repor cor original
        //node.attr({"fill":paletteShapes[node.data('type')].color}); 
    },
    
    jsontographic : function(json){
        var aux =JSON.parse(json);
        for (var i = 0; i < aux.length ; i++) {
            dragndrop.nodetograph(aux[i].root);
        };
    },

    nodetograph : function(node,previous){
    //verifica se a shape ja existe
    if(dragndrop.getElement(node.uuid) == null){
        //se nao cria a nova shape
        var shape = this.addShape(node);
    }else{
        //caso exista atribui-lhe a shape existente
        var shape = dragndrop.getElement(node.uuid);
    }
    //caso seja enviada uma shape anterior
     if(previous != null){
        //cria a nova ligacao
        var line = new Connection(paper, previous, shape)   
        //adiciona a nova ligacao aos arrays correspondentes
        dragndrop.lines.push(line); 
        graph.lines.push(line);
     }
     //se for um 'if'
     if(node.type == 6){
            //percorre o no falso do no
            this.nodetograph(node.nextfalse,shape);
            //percorre o no verdadeiro do no
            this.nodetograph(node.nexttrue,shape);
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
    },
    
    addShape: function(node){
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
                dragndrop.addDragAndDropCapabilityToPaletteOption(cloneShape);
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
        //adiciona aos array de nos do graph o no criado
        graph.nodes.push(newShape.node)
        if(node.type != 7){
            newShape.dblclick(function (){
                var t = prompt('Inserir dados:','');
                if(t === undefined || t.length === 0){
                    t = 'Click me';
                }
                newShape.items[1].attr({text: t});
                newShape.node.data = t;
            });
        }
        return newShape
    },

    graphclean : function(){
        for (var i = dragndrop.lines.length; i--;) {
            graph.removeline(dragndrop.lines[i]);
            dragndrop.lines[i].shape.line.remove();
            dragndrop.lines.splice(i, 1);
        }
        //guarda o n de formas no graph
        var size = dragndrop.nodes.length;
        for (var i =  size-1; i >= 0; i--){
            console.log(i)
            console.log(dragndrop.nodes[i])
            graph.remove(dragndrop.nodes[i].node);
            dragndrop.nodes[i].remove(); 
            dragndrop.nodes.splice(dragndrop.getElement(dragndrop.nodes[i]), 1);
            console.log(i);  
         };                 
    }

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
var loadPitch = function (paper, xmax, ymax) {
    var pitch = paper.rect(140,0,xmax,ymax,10); // 10 para os cantos 
    pitch.attr({stroke: "orange"});
    pitch.transform("...T140,");
    return pitch;
};


/*
    Carrega a palete
*/
var loadPalette = function(paper){

    //inicia o set com os objectos da palette
    ShapesSet = paper.set();
    //cria um rectangulo que sera usado como border
    //var border = paper.rect (0,0,100,pitch.getBBox().height).attr({stroke:"blue"});
    var border = paper.rect(0,0,130,pitch.getBBox().height,10).attr({stroke: "black"});
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
    var beginanch = paper.rect(beginimg.getBBox().width/2,beginimg.getBBox().height,2,2).attr({stroke:"none", fill:"none"});
    //adiciona o tipo ao objecto
    beginimg.data('type',1);
    //cria o texto do objecto
    var begintext = paper.text(beginimg.getBBox().width/2, (beginimg.getBBox().height/2),"Início").attr({fill:'black'});   
    //junta todos os objectos num set
    var beginset = paper.set([beginimg,begintext,beginanch]);
    //faz um scale de 1,3 e uma translacao para acertar com a palette
    beginset.transform("S1.5T40," + begin.yoffset);
    //adiciona ao set da palette o set criado em cima, que representa a shape "begin"
    ShapesSet.push(beginset);
    //da ao objecto criado a capacidade de DragnDrop
    dragndrop.addDragAndDropCapabilityToPaletteOption(beginset);

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
    endset.transform("S1.5T40," + end.yoffset);
    //adiciona ao set da palette o set criado em cima, que representa a shape "end"
    ShapesSet.push(endset);
    //da ao objecto criado a capacidade de DragnDrop
    dragndrop.addDragAndDropCapabilityToPaletteOption(endset);

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
    writeset.transform("S1.5T40," + write.yoffset);
    //adiciona ao set da palette o set criado em cima, que representa a shape "write"
    ShapesSet.push(writeset);
    //da ao objecto criado a capacidade de DragnDrop
    dragndrop.addDragAndDropCapabilityToPaletteOption(writeset);

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
    readset.transform("S1.5T40," + read.yoffset);
    //adiciona ao set da palette o set criado em cima, que representa a shape "read"
    ShapesSet.push(readset);
    //da ao objecto criado a capacidade de DragnDrop
    dragndrop.addDragAndDropCapabilityToPaletteOption(readset);

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
    processset.transform("S1.5T40," + process.yoffset);
    //adiciona ao set da palette o set criado em cima, que representa a shape "process"
    ShapesSet.push(processset);
    //da ao objecto criado a capacidade de DragnDrop
    dragndrop.addDragAndDropCapabilityToPaletteOption(processset);

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
    ifset.transform("S1.5T40,"+ifshape.yoffset);
    //adiciona ao set da palette o set criado em cima, que representa a shape "if"
    ShapesSet.push(ifset);
    //da ao objecto criado a capacidade de DragnDrop
    dragndrop.addDragAndDropCapabilityToPaletteOption(ifset);
    
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
    var joinset = paper.set([joinimg,joinanch1,joinanch2,joinanch3]);
    //faz um scale de 1,3 e uma translacao para acertar com a palette
    joinset.transform("S1.5T57,"+join.yoffset);
    //faz um scale de 1,3 e uma translacao para acertar o texto com a palette
    jointext.transform("S1.5T57,"+join.yoffset);
    //adiciona ao set da palette o set criado em cima, que representa a shape "join"
    ShapesSet.push(joinset);
    //da ao objecto criado a capacidade de DragnDrop
    dragndrop.addDragAndDropCapabilityToPaletteOption(joinset);

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
    returnset.transform("S1.5T40,"+returnshape.yoffset);
    //adiciona ao set da palette o set criado em cima, que representa a shape "return"
    ShapesSet.push(returnset);
    //da ao objecto criado a capacidade de DragnDrop
    dragndrop.addDragAndDropCapabilityToPaletteOption(returnset);
  };

