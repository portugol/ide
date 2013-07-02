$(document).on('ready', function() {
    $('#menu').tabify();

	var Drag = new DragFunctions();
    var socket = io.connect('http://130.185.82.181:8080');
    running=false;
    var stepping=false;
    var selectTool=true;
    var desliga = false;
    var consoleup = false;

    enableBtnExecute(true);
    enableBtnStart(true);
    enableBtnNext(false);
    enableBtnStop(false);

    socket.on('validated', function (){
        clearMemory(); //limpar memória
        clearConsole(); //limpar consola
        Drag.reverseAll(); //restaurar cores originais
        Drag.undragAll();  //não permitir arrastar elementos
        if(stepping){
            enableBtnStart(false);
            enableBtnExecute(false);
            enableBtnStart(false);
            enableBtnStop(true);
            enableBtnNext(true);
        }
        else{
            enableBtnExecute(false);
            enableBtnStart(false);
            enableBtnStop(true);
            enableBtnNext(false);
        }
        writeConsoleInfo("--- Execution started ---");
    });

    socket.on('highlight', function (payload){          
        Drag.stepHighlight(payload.actual, payload.previous); 
        enableBtnNext();
        var vars=JSON.parse(payload.memory);
        clearMemory();
        fillMemory(vars);
    });

    socket.on('restore', function (uuid){
        Drag.reverseHighlight(uuid); 
    });

    socket.on('requestInput', function(varname){
        apprise("Introduza o valor de <b><i>"+varname+"</b></i> :",{
            'confirm' : true, 
            'input' : true, 
            'animate' : true, 
            'textOk' : 'Ok',
            'textCancel' : 'Cancelar', 
        },function(input) {
            if(input){
                 socket.emit('inputFromIDE',input);
            }else{
                socket.emit('inputFromIDE',"");
                apprise("Não foi inserido um valor!")
            }

        });
    });

    socket.on('errors', function(errors){
        clearConsole();
        Drag.reverseAll();
        for(var i=0; i<errors.length; i++){
            writeConsoleError(errors[i].message);
            if(errors[i].uuid!==undefined){
                Drag.errorHighlight(errors[i].uuid); 
            }
        } 
    });

    socket.on('errorAbort', function (error){
        writeConsoleError(error.message);
        Drag.reverseHighlight(error.previous);
        Drag.errorHighlight(error.uuid);
        running=false;
        stepping=false;
        enableBtnStart(true);
        enableBtnExecute(true);
        enableBtnStop(false);
        enableBtnNext(false);
        Drag.dragAll();
    });

    socket.on('finished', function (payload){
        running=false;
        stepping=false;
        enableBtnStart(true);
        enableBtnExecute(true);
        enableBtnStop(false);
        enableBtnNext(false);
        Drag.stepHighlight(payload.actual, payload.previous);
        fillMemory(payload.memory);
        writeConsoleInfo("--- Execution finished ---");
        Drag.dragAll();
        Drag.reverseAll(); 
    });

    socket.on('executionAborted',function (uuid){
        if(stepping){
            Drag.reverseHighlight(uuid);
        }
        running=false;
        stepping=false;
        enableBtnStart(true);
        enableBtnExecute(true);
        enableBtnStop(false);
        enableBtnNext(false);
        clearMemory();
        writeConsoleInfo("--- Execution aborted ---");
        Drag.dragAll();
    });

    socket.on('consoleUpdate', function (data){
      writeConsoleMessage(data);
    });
    $('#btnValidar').on('click', function (){
      var json = Drag.graph.extract();
      socket.emit('flowchart', json);
    });
    
    $('#btnExecutar').on('click', function (){
      Drag.resetSelection();
      Drag.reverseAll(); 
      var json = Drag.graph.extract();
      running = true;
      console.log(json)
      socket.emit('execute', json);
    });

    $('#btnStart').on('click', function(){
        if($(this).is(":disabled")==false){
            var json = Drag.graph.extract();
            socket.emit('start', json);
            stepping=true;
            running = true;
        }
    });

    $('#btnStop').on('click', function(){
        if($(this).is(":disabled")==false){
            socket.emit('stopExecution');
        }
    });

    $('#btnNext').on('click', function(){
        if($(this).is(":disabled")==false){
            enableBtnNext(false);
            if(stepping){
                socket.emit('next');
            }
        }
    });

    $('#btnAbrir').on('click', function (){
        Drag.resetSelection();
        var nomegrafo; 
        apprise('Insera o fluxograma que deseja abrir:',{
            'confirm' : true,
            'input' : true, 
            'animate' : true, 
            'textOk' : 'Ok',
            'textCancel' : 'Cancelar', 
        },function(input) {
            if(input){
                nomegrafo = input;
                $.ajax({
                    async:false,
                    cache: false,
                    type: 'GET',
                    url: 'http://130.185.82.181/couchget/' + nomegrafo,
                    data: {},
                    dataType: 'json',
                    success: function(json) {
                        if(json.result !== undefined || json.result == 'nok') {
                            if(json.message == 'missing'){
                                apprise("Fluxograma não encontrado!")
                            }else{
                                apprise(json.message);    
                            }
                        } else {
                            Drag.graphclean();
                            Drag.jsontographic(JSON.stringify(json.grafo));                              
                        }
                    },
                    error:function (xhr, ajaxOptions, thrownError){
                    if(xhr.readyState == 0 || xhr.status == 0) {
                        return;
                    } else {
                        apprise("Ocorreu um erro inesperado!");
                    }
                }
            });
            }
        });
    });

    $('#btnApagar').on('click', function() {
        Drag.deleteSet();
    });

    $('#btnGuardar').on('click', function (){
        Drag.resetSelection();
        apprise('Insera o nome com que deseja guardar:',{
            'confirm' : true,
            'input' : true, 
            'animate' : true, 
            'textOk' : 'Ok', 
            'textCancel' : 'Cancelar',
        },function(input) {
            if(input){
                nomegrafo = input;
                json = Drag.graph.extract();
                json = JSON.parse(json);
                $.ajax({
                    async:false,
                    cache: false,
                    type: 'POST',
                    url: 'http://130.185.82.181/couchset',
                    data: {
                        _id: nomegrafo,
                        grafo: json
                    },
                    dataType: 'json',
                    success: function(json) {
                        if(json.result == 'ok') {
                            apprise("Guardado com sucesso!");
                        } else {
                            if(json.message == "Document update conflict."){
                                apprise("O fluxograma " + nomegrafo + " ja existe . Por favor introduza outro nome. ");   
                            }else{
                                apprise(json.message);
                            }
                        }
                    },
                    error:function (xhr, ajaxOptions, thrownError){
                        if(xhr.readyState == 0 || xhr.status == 0) {
                            return;
                        } else {
                            apprise("Ocorreu um erro inesperado!");
                        }
                    }
                });
            }   
        });                 
    });
    $('#btnConect').on('click',function(){
        Drag.setToConnect();
        $("*").css('cursor', 'url(connect.cur),default');
    });
    $('#btnSelect').on('click',function(){
        Drag.setToSelect();
        $("*").css('cursor','url(cursor.cur),default');
    });
    $('#mostra').on('click', function() {
        if (desliga == true){

        }else{
            classie.toggle( menuBottom, 'cbp-spmenu-open' );
        }
    });
});

function enableBtnNext(flag){
    var status=flag;
    if(flag===undefined){
        status=true;
    }
    if(status){
        $('#btnNext').css("background-color", "#f00");
    }
    else{
        $('#btnNext').css("background-color", "#AAB3AB");
    }
    $('#btnNext').prop('disabled', !status);
}

function enableBtnExecute(flag){
    var status=flag;
    if(flag===undefined){
        status=true;
    }
    if(status){
        $('#btnExecutar').css("background-color", "#f00");
    }
    else{
        $('#btnExecutar').css("background-color", "#AAB3AB");
    }
    $('#btnExecutar').prop('disabled', !status);
}

function enableBtnStart(flag){
    var status=flag;
    if(flag===undefined){
        status=true;
    }
    if(status){
        $('#btnStart').css("background-color", "#f00");
    }
    else{
        $('#btnStart').css("background-color", "#AAB3AB");
    }
    $('#btnStart').prop('disabled', !status);
}

function enableBtnStop(flag){
    var status=flag;
    if(flag===undefined){
        status=true;
    }
    if(status){
        $('#btnStop').css("background-color", "#f00");
    }
    else{
        $('#btnStop').css("background-color", "#AAB3AB");
    }
    $('#btnStop').prop('disabled', !status);
}

function clearMemory(){
    var parent=document.getElementById('memoria');
    //o cabecalho nao e apagado
    for(var i = parent.rows.length-1; i > 0;i--){
      parent.deleteRow(i);
    }
}

function clearConsole(){
    $('#consola').empty();
}

function writeConsole(data,color){
    color=color||"#000000";
    $("#consola").append('<span style="color:'+color+'">'+data+'<br></span>');
    $("#consola").scrollTop($("#consola")[0].scrollHeight); //scroll automatico
}

function writeConsoleError(data){
    writeConsole(data,"#FF0011");
}

function writeConsoleMessage(data){
    writeConsole(data,"#000000");
}

function writeConsoleInfo(data){
    writeConsole(data,"#107ECC");
}

function fillMemory(vars){
    for(var i=0; i<vars.length; i++){
      addRowMemory(vars[i]);
    }
}

function addRowMemory(variable){
    var parent=document.getElementById("memoria");
    var newRow = parent.insertRow(parent.rows.length);
    var name = newRow.insertCell(0);
    var type = newRow.insertCell(1);
    var value = newRow.insertCell(2);
    var level = newRow.insertCell(3);
    name.innerHTML = variable.name_;
    type.innerHTML = variable.typeName_;
    value.innerHTML = variable.value_;
    level.innerHTML = variable.level_;
}