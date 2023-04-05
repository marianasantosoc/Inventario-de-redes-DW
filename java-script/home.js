function Add(){
    var estado = document.getElementById("estado").value;
    var nome = document.getElementById("maquina").value;
    var ip = document.getElementById("ip").value;


    var qtdRows = document.getElementById("infos-pc").rows.length;
    var table = document.getElementById("infos-pc");
    var newRow = table.insertRow(qtdRows);
    var chave =  qtdRows 
    newRow.id = 'linha' + chave

    // add cells to the row
    newRow.insertCell(0).innerHTML = '<button class="opc" style="background-color:#d3d2d2; border: 0;border-radius: 20px; width: 50%;">'+nome+'</button>';
    if (estado == "up"){
        newRow.insertCell(1).innerHTML = '<img class="up" src="./images/up.png" width="10px" style="margin-left: 10%;">';
    }
    if (estado == "down"){
        newRow.insertCell(1).innerHTML = '<img class="down" src="./images/down.png" width="10px" style="margin-left: 10%;">';
    }
    newRow.insertCell(2).innerHTML = '<a style="margin-left: 10%;justify-content: center;">'+ip+'</a>';
    newRow.insertCell(3).innerHTML = '<button class="rm" type="button" style="background-color: rgb(133, 0, 0); border: 0; border-radius: 100%; color: white; width: 30px; " onclick="Rm(linha'+chave+')"><i class="fa fa-trash" style="color: white;"></i></button>';
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


function none_block(){
    var divs = document.querySelectorAll(".itens");
    for (let div of divs){
        if (div.style.display == 'none'){
            div.style.display = 'block';
        }
        else{
            div.style.display = 'none';
        }
    }
}
