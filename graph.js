var Graph = function (r){
    this.nodes = [];
    this.lines = [];
    this.r = r;
    this.root = null;
    self = this;
};
//adiciona um node ao graph
Graph.prototype.add = function (node){
    //caso não exista root e o node seja do tipo inicio atribui a raiz ao node
    if (this.root === null && node.type == '1') {
        this.root = node;
    }
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
    //caso o node removido seja a raíz, coloca a raíz não definida
    if(node == this.root){
      this.root = null;
    }
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
    if (this.root != null) {        
        for (var i = first.length - 1; i >= 0; i--) { 
            var aux = this.Json(json,first[i],1, function (json){
                jjson += json;
            });
            json = '},{"root":';
        };
        jjson +='}]';
        return jjson;
    }else{
        return "Inicio não Presente";
    }
};
/*
* Metodo recursivo que devolve a estrutura do fluxograma em JSON
* de acordo com o root que é enviado(json)
*/
Graph.prototype.Json = function(json, node, counter, callback){
    var self = this;
    json += '{"type":' + node.type;
    json += ',"data":"' + node.data+'"';
    json += ',"uuid":' + node.uuid;
    
    if(node.processed == true){
        json+=this.fecha(counter)
        callback(json);
        return;
    }
    node.processed = true;

    if(node.type == 6){
        json += ',"nexttrue":';
        this.Json(json, node.nexttrue, 0, function(jsonn) {
            json = jsonn;
            json += '}';
            json += ',"nextfalse":';
            self.Json(json, node.nextfalse, 0, function(jsonn){
                json = jsonn;
                json+='}';
                json+=self.fecha(counter)
            }); 
        });
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
