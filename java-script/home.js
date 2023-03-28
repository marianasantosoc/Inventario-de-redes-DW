function Add(){
    

    var estado = document.getElementById("estado").value;

    var qtdRows = document.getElementById("infos-pc").rows.length;
    var table = document.getElementById("infos-pc");
    var newRow = table.insertRow(qtdRows);
    var chave =  qtdRows 
    newRow.id = 'linha' + chave

    // add cells to the row
    newRow.insertCell(0).innerHTML = '<p style="font-weight: bold;" id="'+chave+'">'+chave+'</p>';
    if (estado == "up"){
        newRow.insertCell(1).innerHTML = '<img src="./images/up.png" width="10px" style="z-index: 999;">';
    }
    if (estado == "down"){
        newRow.insertCell(1).innerHTML = '<img src="./images/down.png" width="10px">';
    }
    newRow.insertCell(2).innerHTML = '<p>'+ chave +'</p>';
    newRow.insertCell(3).innerHTML = '<button type="button" style="background-color: rgb(133, 0, 0); border: 0; border-radius: 100%; color: white; width: 30px; " onclick="Rm(linha'+chave+')"><i class="fa fa-trash" style="color: white;"></i></button>';
}

function Rm(id) {
    var deletar=prompt("Digite 'delete' para confirmar a exclusão da máquina:");

    if (deletar=="delete"){
        id.remove();
    }
    else{
        Erro = alert("A máquina não foi removida!")
    }
}
