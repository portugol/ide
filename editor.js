// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ editor.js - CODEBY                                                 │ \\
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

$(window).on('ready', function(){

	//Cria Raphael paper
	//temos que por a dimensao do paper dinamico
	paper = Raphael('canvas', 700, 700);

	//Cria a espaco de trablho para a criacao do fluxograma
	var flowspace = new FlowSpace(paper);

	//Cria a Palette DragnDrop
	var palette = new Palette(paper, flowspace.getWorkSpace());

	//var Drag = new DragFunctions();

	$('#btnvalidar').on('click', function (){
		var socket = io.connect('http://localhost:8080');
		socket.on('connect', function (){
			console.log('CONNECTED');
			//var aux = Drag.graph.extract();
			var aux = flowspace.graph.extract();
			console.log('teste' + flowspace.graph.extract());
			var aux1 = {};
			aux1.root = aux;
			
			socket.emit('flowchart', JSON.stringify(aux1));

			socket.on('validate', function (data){
				console.log(data);
			});
		});
	});

	$('#btnexecute').on('click', function (){
		var socket = io.connect('http://localhost:8080');
		socket.on('connect', function (){
			console.log('CONNECTED');
			//var aux = Drag.graph.extract();
			var aux = flowspace.graph.extract();
			var aux1 = {};
			aux1.root = aux;
			console.log(aux1);
			
			socket.emit('execute', JSON.stringify(aux1));

	       	socket.on('execute', function (data){
	       		console.log(data);
	       	});
	       	socket.on('done', function (data){
	       		console.log('OUTPUT:' + data);
	       		//var aux2 = document.getElementById('console');
	       		//aux2.innerHTML = aux2.innerHTML + data;
			});
		});
	});

	$('#btnTESTE').on('click', function() {
		console.log('ENVIAR PARA BASE DE DADOS');
		console.log(flowspace);
	});

});