// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ graph.js - CODEBY                                                  │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │                                                                    │ \\
// │ Copyright © 2013 - ESTT - ESCOLA SUPERIOR DE TECNOLOGIA DE TOMAR   │ \\
// │                                                                    │ \\
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
*graph.js
*This class represent the flowchart and is the Data Structure for Portugol 
*
*
*/
var Graph = function (){
    this.nodes = [];
    this.lines = [];
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
                        this.nodes[j].next = null;
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
    //console.log("EXTRACT");
    //console.log(this.root);
    return this.root;
};
