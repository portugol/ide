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
    return this.root;
};
