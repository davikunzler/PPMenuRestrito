document.getElementById('formCadastro1').addEventListener('submit', (e) =>{
e.preventDefault();
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const cidade = document.getElementById('cidade').value;
    const filtros = document.getElementById('filtros').value;
    const descricao = document.getElementById('descricao').value;

    const estabelecimento = {
        nome: nome,
        email: email,
        senha: senha,
        cidade: cidade,
        filtros: filtros,
        descricao: descricao
    };

    if (!nome || !email || !senha || !cidade || !filtros || !descricao){
        alert('Todos campos são origatórios');
        return;
    }

        

    fetch('http://localhost:3001/cadastrarEstabele', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(estabelecimento)

    })
    .then(response => response.json())
    .then(data => {
        if (data.message){
            alert(data.message);

        }
    })
    .catch(error =>{
        console.error('Erro ao cadastrar estabelecimento', error);
    });
});


