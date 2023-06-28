window.onload = function valida_usuario(e) {
    e.preventDefault();

    var session_id = sessionStorage.getItem('id_empresa');
    // console.log(session_id)
    var user_id = 'http://10.0.51.62:3000/users/' + session_id+ '/hosts';
    Nome_empresa();
    Usuario_logado();
  
    fetch(user_id)
    // fetch(id)
    .then(response => response.json())
    .then(data => {
        data.forEach(function(host) {
            var nome = host.maquina;
            var estado = host.status;
            var ip = host.ip;
            const inventario = { nome, estado, ip };
            Criar_table(inventario);
        })
    })
    .catch(error => {
      // Trate erros aqui
      console.error(error);
    });
}

function Criar_table(host){
    var tbody = document.querySelector('tbody');
    // var qtdRows = document.getElementById("infos-pc").rows.length;
    var id = 'maquina' + host.estado
    let row = ''
  
    row = `<tr id="maquina${host.estado}" class="format">
    <td>${host.nome}</td>
    <td class="maquinas-down" id="${host.estado}"></td>
    <td>${host.ip}</td>
    <td><button class="rm" type="button" style="background-color: rgb(133, 0, 0); border: 0; border-radius: 100%; color: white; width: 30px; " onclick="Rm_maquina(${id})">
    <i class="fa fa-trash" style="color: white;"></i></button></td>
    </tr>
    </tr>`;
  
    tbody.insertAdjacentHTML('beforeend', row);
}

function Add_maquinas(){
    const form = document.querySelector('form');

    const estado = document.getElementById("estado").value;
    const nome = document.getElementById("maquina").value;
    const ip = document.getElementById("ip").value;
    
    const host = { nome, estado, ip };
        
    Criar_table(host);
    save_maquina_db(host);
    
    form.reset();
}

function save_maquina_db(host){
    var session_id = sessionStorage.getItem('id_empresa');

    let formData = {
        maquina: host.nome,
        status: host.estado,
        ip: host.ip,
        userId: session_id
    }

    let jsonData = JSON.stringify(formData);

    fetch("http://10.0.51.62:3000/hosts", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: jsonData
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

function Rm_maquina(id) {
    var deletar=prompt("Digite 'delete' para confirmar a exclusão da máquina:");
    if (deletar=="delete"){
        console.log(id)
        id.remove();
    }
    else{
        Erro = alert("A máquina não foi removida!")
    }
}

function none_block(){
    var divs = document.querySelectorAll(".add-maq");
    for (let div of divs){
        if (div.style.display == 'none'){
            div.style.display = 'block';
        }
        else{
            div.style.display = 'none';
        }
    }
}

function Rm_maquina_db(){
    const url = 'caminho/do/arquivo.json';

    fetch(url)
    .then(response => response.json())
    .then(data => {
    // Remove o elemento do array (no exemplo abaixo, o elemento de índice 2)
    data.array.splice(2, 1);
    
    // Converte o objeto JavaScript de volta em uma string JSON
    const updatedJsonData = JSON.stringify(data);
    
    // Faz uma requisição PUT para salvar a string JSON atualizada de volta no arquivo
    fetch(url, {
      method: 'PUT',
      body: updatedJsonData,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => console.log('Arquivo atualizado com sucesso!'))
    .catch(error => console.error('Erro ao atualizar o arquivo: ', error));
  })
  .catch(error => console.error('Erro ao carregar o arquivo: ', error));

}

function Nome_empresa(){
    var session_empresa = sessionStorage.getItem('id_empresa');
    var empresa = document.getElementById("nome_empresa").value = session_empresa;
}

function Ver_maq_up_down(opc){
    var divs = document.querySelectorAll("tr");
    for (let div of divs){
        if (div.id == opc){
            div.style.display = 'none';
        }
        else{
            div.style.display = '';

        }
        }
}

function Usuario_logado(){
    var session_usuario_logado = sessionStorage.getItem('nome_usuario');
    var usuario = document.getElementById("usuario_logado").value = 'Hi, ' + session_usuario_logado;

    console.log(session_usuario_logado)
    console.log(usuario)
}