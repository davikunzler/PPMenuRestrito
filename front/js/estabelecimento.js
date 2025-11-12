document.addEventListener("DOMContentLoaded", () => {
  const id = localStorage.getItem("estabelecimentoSelecionado");

  if (!id) {
    document.querySelector("main").innerHTML =
      "<p>Estabelecimento não selecionado.</p>";
    return;
  }

  fetch(`http://localhost:3001/estabelecimentos/${id}`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("nomeEstabelecimento").textContent =
        data.nome_estabelecimento;
      document.getElementById("descricaoEstabelecimento").textContent =
        data.descricao;
      document.getElementById("cidadeEstabelecimento").textContent =
        data.cidade_estabelecimento;
      document.getElementById("filtrosEstabelecimento").textContent =
        data.filtros_estabelecimento;
      document.getElementById(
        "imagemEstabelecimento"
      ).src = `http://localhost:3001/${
        data.img_estabelecimento || "imgs/default.jpg"
      }`;
    })
    .catch((err) => {
      console.error("Erro ao carregar estabelecimento:", err);
    });

  fetch(`http://localhost:3001/produtosPorEstabelecimento/${id}`)
    .then((res) => res.json())
    .then((produtos) => {
      const lista = document.getElementById("listaProdutos");
      if (produtos.length === 0) {
        lista.innerHTML = "<p>Nenhum produto cadastrado.</p>";
        return;
      }

      produtos.forEach((produto) => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-3";

        col.innerHTML = `
              <div class="card h-100 produto-card" data-id="${
                produto.id_produto
              }">
                <img src="http://localhost:3001/${
                  produto.img_produto || "imgs/default.jpg"
                }" class="card-img-top" alt="${produto.nome_produto}">
                <div class="card-body">
                  <h5 class="card-title">${produto.nome_produto}</h5>
                  <p class="card-text">${produto.descricao_produto}</p>
                  <p><strong>Preço:</strong> R$ ${produto.preco_produto}</p>
                </div>
              </div>
            `;

        lista.appendChild(col);
      });

      document.querySelectorAll(".produto-card").forEach((card) => {
        card.addEventListener("click", () => {
          const idProduto = card.dataset.id;
          localStorage.setItem("produtoSelecionado", idProduto);
          window.location.href = "produto.html";
        });
      });
    })
    .catch((err) => {
      console.error("Erro ao carregar produtos:", err);
    });
});
