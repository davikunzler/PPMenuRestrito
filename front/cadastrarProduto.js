const form = document.getElementById('formProduto');
const mensagem = document.getElementById('mensagem');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
        nome: form.nome.value,
        descricao: form.descricao.value,
        contem_gluten: form.contem_gluten.value === "true",
        contem_lactose: form.contem_lactose.value === "true",
        id_estabelecimento: parseInt(form.id_estabelecimento.value)
    };

    try {
        const response = await fetch('http://localhost:3001/cadastrarProduto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const result = await response.json();
        mensagem.textContent = result.message;
        mensagem.style.color = response.ok ? 'green' : 'red';

        if (response.ok) {
            form.reset();
        }
    } catch (error) {
        mensagem.textContent = 'Erro ao conectar com o servidor.';
        mensagem.style.color = 'red';
    }
});
