$(window).on('ready', function(){
	//Iniciar o canvas
	var r = Raphael("paper",500,500);

	var graph = new Graph(r);

	$('#btninicio').on('click', function (){
		graph.add(new Node(r,1));
	});

	$('#btnescrever').on('click', function (){
		graph.add(new Node(r,3));
	});

	$('#btnfim').on('click', function (){
		graph.add(new Node(r,2));
	});

	$('#btnenviar').on('click', function (){
		var socket = io.connect('http://localhost:8080');
		socket.on('connect', function (){
			console.log('CONNECTED');
			var aux = graph.extract();
			var aux1 = {};
			aux1.root = aux.root;
			console.log(aux);
			console.log(aux1);
			
			socket.emit('flowchart', JSON.stringify(aux1));

			socket.on('validate', function (data){
				console.log(data);
			});
		});
	});
});

