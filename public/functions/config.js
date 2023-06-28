function exibi(id){
    var divs = document.querySelectorAll(".container");
    divs.forEach((div) => {
        div.style.display = 'none';
    });

    var display = document.getElementById(id).style.display;
    console.log(display)
    if (display == 'none') {
        document.getElementById(id).style.display = 'block';
    } 
}

function Mudar_nome_empresa(){
    
}

function Insrir_user_db(formUser){
    let jsonData = JSON.stringify(formUser);
  
    fetch("http://10.0.51.62:3000/users", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: jsonData
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
};

function  Add_user_inventory(){
  let email1= document.getElementById("email").value;
  var session_id = sessionStorage.getItem('id_empresa');

  fetch("http://10.0.51.62:3000/users/")
  .then(response => response.json())
  .then(data => {
    const usuario = data.find(u => u.email === email1);

    if (usuario){
      confirm("Usuário exise")
    }
    else{
      let formUser = {
        nome: document.getElementById("user2").value,
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value,
        inventoryId: session_id
      };
      Insrir_user_db(formUser);
    }
  })
};