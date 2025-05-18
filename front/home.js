const botaoPesquisar = document.getElementById('botaoPesquisar');
const barraDePesquisa = document.getElementById('barraDePesquisa');
const resultados = document.getElementById('resultadosPesquisa');

botaoPesquisar.addEventListener('click', () => {
    const termo = barraDePesquisa.value.trim();
    if (!termo) {
        resultados.innerHTML = "<li class='list-group-item'>Digite algo para buscar.</li>";
        return;
    }

    fetch(`http://localhost:3001/pesquisarEstabelecimentos?q=${encodeURIComponent(termo)}`)
        .then(res => res.json())
        .then(data => {
            resultados.innerHTML = '';
            if (data.length === 0) {
                resultados.innerHTML = "<li class='list-group-item'>Nenhum estabelecimento encontrado.</li>";
            } else {
                data.forEach(estabelecimento => {
                    const li = document.createElement('li');
                    li.classList.add('list-group-item');
                    li.textContent = estabelecimento.nome_estabelecimento;
                    resultados.appendChild(li);
                });
            }
        })
        .catch(error => {
            console.error("Erro ao buscar estabelecimentos:", error);
            resultados.innerHTML = "<li class='list-group-item'>Erro ao buscar dados.</li>";
        });
});