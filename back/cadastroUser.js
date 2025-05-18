
document.getElementById('formCadastro').addEventListener('submit', function (event){
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const cidade = document.getElementById('cidade').value;
    const filtros = document.getElementById('filtros').value;

    const user = {  
        nome: nome,
        email: email,
        senha: senha,
        cidade : cidade,
        filtros: filtros
    };

    if (!nome || !email || !senha || !cidade || !filtros){
        alert('Todos campos são origatórios');
        return;
    }

    fetch('http://localhost:3001/cadastrarCliente', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)

    })
    .then(response => response.json())
    .then(data => {
        if (data.message){
            alert(data.message);

        }
    })
    .catch(error =>{
        console.error('Erro ao cadastrar usuário', error);
    });
});