var Graph = function (r){
    this.nodes = [];
    this.lines = [];
    this.r = r;
    self = this;
};
//adiciona um node ao graph
Graph.prototype.add = function (node){
    //caso não exista root e o node seja do tipo inicio atribui a raiz ao node
    if (this.root === undefined && node.type == '1') {
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
      this.root = undefined;
    }
    //para todos os nós do graph
    for(var i = 0; i < this.nodes.length; i++){
        if(node == this.nodes[i]){
            //procura todos os nodes que tenham como referência next ao node removido
            for(var j = 0; j < this.nodes.length; j++){
                if(this.nodes[j]!= undefined){
                    if(this.nodes[j].next == node){
                        //apaga o atributo next dos nodes com referência ao node removido
                        delete this.nodes[j].next ;
                    }
                }
            }

            //remove o node
            this.nodes.splice(i,1);
        }
    }
}

Graph.prototype.setData = function(node, data){
    console.log('entrou');
    /*for(var i = 0; i < this.nodes.length; i++){
        if(this.nodes[i] == node){
            console.log(this.nodes[i]);
        }
    }*/
};

/*Graph.prototype.extract = function (){
    for (var i = 0; i < this.nodes.length; i++) {
        delete this.nodes[i].shape[1];
        delete this.nodes[i].shape;
        delete this.nodes[i].r;
    };
    for(var i = 0; i < this.lines.length; i++){
        delete this.lines[i].shape;
        delete this.lines[i].r;
    };
    return this;
};*/
