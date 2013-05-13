// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ node.js - CODEBY                                                   │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ 																    │ \\
// │ Copyright © 2013 - ESTT - ESCOLA SUPERIOR DE TECNOLOGIA DE TOMAR   │ \\
// │ 																    │ \\
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
*node.js
*This class represent the node in the flowchart is the Data Structure for Portugol
*
*Node recives as paramenters
*type: type of the node
*data: data of the node
*
*/
var Node = function (type, data){
	this.type = type;
	if(data !== undefined || data !== null){
		this.data = data;
	}
};