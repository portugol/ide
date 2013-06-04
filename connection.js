var Connection = function (r, source, target){
    //atribuicao das shapes source e target referentes a linha a criar 
    this.source = source;
    this.target = target;

    //valor auxiliar para determinar a ancora no caso de ser um no do tipo 'join'
    var aux=0
    //se o alvo for do tipo 'join'
    if(target.node.type == 7){
        aux = 1;
        //para todas as linhas existentes
        for (var i = graph.lines.length - 1; i >= 0; i--) {
            //se existir uma linha com o alvo este no
            if(graph.lines[i].target == this.target){
                if(graph.lines[i].shape.to == graph.lines[i].target.items[1]){
                    console.log(graph.lines[i].shape.to)
                    aux = 2;
                }
            }
        };
    }
    //se o alvo for do tipo 'if'
    if(target.node.type == 6){
        aux = 2;
        //para todas as linhas existentes
        for (var i = graph.lines.length - 1; i >= 0; i--) {
            if(graph.lines[i].target == this.target){
                if(graph.lines[i].shape.to == graph.lines[i].target.items[2]){
                    console.log(graph.lines[i].shape.to)
                    aux = 5;
                }
            }
        };
    }
    //se a shape de origem nao for do tipo 'if' ou join'
    if(source.node.type != 6 && source.node.type != 7){
        //atribui ao no de origem o seu proximo no(next) o no de destino da ligacao
        this.source.node.next = target.node;
        //caso seja do tipo 'fim' ou 'inicio'
        if(this.source.items[3] != null){
            //se o alvo for do tipo 'join'
            if(target.node.type == 7 || target.node.type == 6){
                //usa a ligacao recorrendo ao valor auxiliar calculado em cima
                this.shape = r.connection(this.source.items[3], this.target.items[aux],"#005555");   
            }else{
                //caso contrario une com a ancora de baixo com a ancora de cima do alvo
                this.shape = r.connection(this.source.items[3], this.target.items[2],"#005555");   
            }
        }else{
            //se o alvo for do tipo 'join'
            if(target.node.type == 7 || target.node.type == 6){
                //usa a ligacao recorrendo ao valor auxiliar calculado em cima
                this.shape = r.connection(this.source.items[2], this.target.items[aux],"#005555");   
            }else{
                //caso contrario une com a ancora de baixo com a ancora de cima do alvo
                this.shape = r.connection(this.source.items[2], this.target.items[2],"#005555");   
            }
        }
    }else{
        //se a origem for do tipo 'if'
        if(this.source.node.type == 6){
            //verifica se este ja tem o ligacao com o no falso
            if(this.source.node.nextfalse == null){
                //atribui ao no de origem o seu proximo no falso(nextfalse)
                this.source.node.nextfalse = target.node;
                //se o alvo for do tipo 'join'
                if(target.node.type == 7 || target.node.type == 6){
                    //usa a ligacao recorrendo ao valor auxiliar calculado em cima
                    this.shape = r.connection(this.source.items[3], this.target.items[aux],"#FF0000");   
                 }else{
                    //caso contrario une com a ancora de baixo com a ancora de cima do alvo
                    this.shape = r.connection(this.source.items[3],this.target.items[2],"#FF0000"); 
                }
            }else{
                if(this.source.node.nexttrue == null){
                    //atribui ao no de origem o seu proximo no verdade(nexttrue)
                    this.source.node.nexttrue = target.node;
                    //se o alvo for do tipo 'join'
                    if(target.node.type == 7 || target.node.type == 6){           
                        //usa a ligacao recorrendo ao valor auxiliar calculado em cima
                        this.shape = r.connection(this.source.items[4], this.target.items[aux],"#00FF00");   
                    }else{                 
                        //caso contrario une com a ancora de baixo com a ancora de cima do alvo
                        this.shape = r.connection(this.source.items[4],this.target.items[2],"#00FF00"); 
                    }
                }
            }
        }
        if(this.source.node.type == 7){
            //atribui ao no de origem o seu proximo no(next) o no de destino da ligacao
            this.source.node.next = target.node;
            this.shape = r.connection(this.source.items[3],this.target.items[2],"#005555");
        }
    }

    var self = this;

    //COLOCAR A REMOVER DO ARRAY GRAPH E LINES DO DRAGFUNCTIONS
   /* this.shape.line.dblclick(function (){
        self.shape.line.remove();
    });*/
};
Raphael.fn.connection = function (obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
     
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
        {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
        {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}
        ],
        d = {}, dis = [];
    for (var i = 0; i < 2; i++) {
        for (var j = 4; j < 6; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");

    if (line && line.line) {
        line.bg && line.bg.attr({path: path, "arrow-end": "classic"});
        line.line.attr({path: path, "arrow-end": "classic"});
        /*
        line.bg && line.bg.attr({path: path, "arrow-end": "classic",stroke:"#005555"});
        line.line.attr({path: path, "arrow-end": "classic",stroke:"#005555", "stroke-width":3});*/
    } else {
        var color = typeof line == "string" ? line : "#005555";
        return {
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3, "arrow-end": "classic"}),
            line: this.path(path).attr({stroke: color, fill: "none", "arrow-end": "classic", "stroke-width": 3}),
            from: obj1,
            to: obj2
        };
    }
};
 /*bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3, "arrow-end": "block-wide-long"}),
            line: this.path(path).attr({stroke: color, fill: "none", "arrow-end": "block-wide-long"}),
            from: obj1,
            to: obj2*/