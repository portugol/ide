var Graph = function (){
    this.nodes = [];
    this.lines = [];
    self = this;
};
//adiciona um node ao graph
Graph.prototype.add = function (node){
    //adiciona ao array de nodes
    this.nodes.push(node);
};

Graph.prototype.removeline = function(line){
    //para todas as linhas
    for(var i = 0; i < this.lines.length;i++){
        //procura todas as linhas que sejam iguais a linha a remover
        if(line == this.lines[i]){
            this.lines.splice(i,1);
        }
    }
}
Graph.prototype.remove = function(node){
    //para todos os nós do graph
    for(var i = 0; i < this.nodes.length; i++){
        //se for a remover
        if(node == this.nodes[i]){
            //procura todos os nodes que tenham como referência next ao node removido
            for(var j = 0; j < this.nodes.length; j++){
                //se o no estiver definido
                if(this.nodes[j]!= undefined){
                    if(this.nodes[j].next == node){
                        //apaga o atributo next dos nodes com referência ao node removido
                        this.nodes[j].next = null;
                    }
                    //se for do tipo if verifica para ambas as referências
                    if(this.nodes[j].type == 6){
                        //verifica para o caso verdade
                        if(this.nodes[j].nexttrue == node){
                            this.nodes[j].nexttrue = null;
                        }
                        //verifica para o caso falso
                        if(this.nodes[j].nextfalse == node){
                            this.nodes[j].nextfalse = null;
                        }
                    }
                }
            }

            //remove o node
            this.nodes.splice(i,1);
        }
    }
}

/*
*   Metodo que retorna a estrutura do fluxograma em JSON
*   para ser enviado para o Core
*/
Graph.prototype.extract = function (){
    var first = [];
    for (var i = this.nodes.length - 1; i >= 0; i--) {
        this.nodes[i].processed = false;
        if(this.nodes[i].type == 1){
            first.push(this.nodes[i]);
        }
    };
    var jjson = '[{"root":';
    var json="";      
    for (var i = first.length - 1; i >= 0; i--) { 
        var aux = this.Json(json,first[i],1, function (json){
            jjson += json;
        });
        json = '},{"root":';
    };
    if(this.nodes.length == 0){
        jjson += null;
    }
    jjson +='}]';
    return jjson;
};
/*
* Metodo recursivo que devolve a estrutura do fluxograma em JSON
* de acordo com o root que é enviado(json)
*/
Graph.prototype.Json = function(json, node, counter, callback){
    var self = this;
    json += '{"type":' + node.type;
    json += ',"data":'+ JSON.stringify(node.data);
    json += ',"uuid":' + node.uuid;
    json += ',"dx":'   + node.dx;
    json += ',"dy":'   + node.dy;
    
    if(node.processed == true){
        json+=this.fecha(counter)
        callback(json);
        return;
    }
    node.processed = true;

    if(node.type == 6){
        if(node.nexttrue != null){
            json += ',"nexttrue":';
            this.Json(json, node.nexttrue, 0, function(jsonn) {
                json = jsonn;
                json += '}';
                json += ',"nextfalse":';
                if(node.nextfalse != null){
                    self.Json(json, node.nextfalse, 0, function(jsonn){
                        json = jsonn;
                        json+='}';
                        json+=self.fecha(counter)
                    }); 
                }else{
                    this.fecha(counter)
                    apprise("Fluxograma mal construido!");
                    return;
                }
            });
        }else{
            this.fecha(counter)
            apprise("Fluxograma mal construido!");
            return;
        }
    }else{
        if(node.next == null){
            json+=this.fecha(counter)
        }else{
            json += ',"next":';
            this.Json(json,node.next,counter+1, function(jsonn){
                json = jsonn;
            });
        }
    }

    callback(json);

};
Graph.prototype.fecha = function(counter){
    var aux = "";
    for (var i = 0; i < counter; i++) {
        aux += '}';
    };
    return aux;
}
