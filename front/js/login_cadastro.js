const submit = document.getElementById("submit");

submit.addEventListener("click", valida_usuario);

function valida_usuario(e) {
  e.preventDefault();

  fetch("http://10.0.51.62:3000/users")
  .then(response => response.json())
  .then(data => {
    var email = document.getElementById("email").value;
    var passwd = document.getElementById("pwd").value;
    // Procurar pelo usuário no array
    const usuario = data.find(u => u.email === email && u.senha === passwd);

    if (usuario) {
      var empresa_id = usuario.inventoryId;
      var user_nome = usuario.nome;
      sessionStorage.setItem('id_empresa', empresa_id);
      sessionStorage.setItem('nome_usuario', user_nome);
      // O usuário existe, redirecionar para a página de login
      window.location.href = 'index.html';
    } else {
      alert("Usuário ou senha está incorreto!")
    }
  })
  .catch(error => {
    // Trate erros aqui
    console.error(error);
  });
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

function Criar_user(){
  let email1= document.getElementById("email").value;

  fetch("http://10.0.51.62:3000/users/")
  .then(response => response.json())
  .then(data => {
    const usuario = data.find(u => u.email === email1);

    if (usuario){
      confirm("Usuário existe")
    }
    else{
      let formUser = {
        nome: document.getElementById("userName").value,
        email: document.getElementById("email").value,
        senha: document.getElementById("pwd").value,
        inventoryId: document.getElementById("empresa").value
      };
      Insrir_user_db(formUser);
      window.location.href="login.html";
    }
  })
};