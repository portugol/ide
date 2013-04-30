$(window).on('ready', function(){
	//Iniciar o canvas
	var r = Raphael("paper",500,500);

	var graph = new Graph(r);

	$('#btninicio').on('click', function (){
		console.log(r);
		console.log(graph);
		graph.add(new NodeV(r,1));
	});

	$('#btnEscrever').on('click', function (){
		graph.add(new NodeV(r,4,'Click me'));
	});

	$('#btnif').on('click', function (){
		graph.add(new NodeV(r,10,'Click me'));
	});

	$('#btnLer').on('click', function (){
		graph.add(new NodeV(r,3,'Click me'));
	});

	$('#btnprocess').on('click', function (){
		graph.add(new NodeV(r,6,'Click me'));
	});

	$('#btnfim').on('click', function (){
		graph.add(new NodeV(r,2));
	});

	$('#btnenviar').on('click', function (){
		var socket = io.connect('http://localhost:8080');
		socket.on('connect', function (){
			console.log('CONNECTED');
			var aux = graph.extract();
			var aux1 = {};
			aux1.root = aux.root;
			console.log(aux1);
			
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
			var aux = graph.extract();
			var aux1 = {};
			aux1.root = aux;
			console.log(aux1);
			
			socket.emit('execute', JSON.stringify(aux1));

           	socket.on('execute', function (data){
           		console.log(data);
           	});
           	socket.on('done', function (data){
           		console.log('OUTPUT:' + data);
           		var aux2 = document.getElementById('console');
           		aux2.innerHTML = aux2.innerHTML + data;
			});
		});
	});
});

