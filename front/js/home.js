const botaoPesquisar = document.getElementById("botaoPesquisar");
const barraDePesquisa = document.getElementById("barraDePesquisa");

document.addEventListener("DOMContentLoaded", () => {
  carregarEstabelecimentos();
});

botaoPesquisar.addEventListener("click", () => {
  const termo = barraDePesquisa.value.trim();
  carregarEstabelecimentos(termo); 
});

document.getElementById("aplicarFiltros").addEventListener("click", () => {
  carregarEstabelecimentos();
});

function carregarEstabelecimentos(termo = "") {
  const gluten = document.getElementById("filtroGluten")?.checked;
  const lactose = document.getElementById("filtroLactose")?.checked;

  let url = "http://localhost:3001/estabelecimentos";
  const params = [];

  if (gluten) params.push("gluten=true");
  if (lactose) params.push("lactose=true");
  if (termo) params.push(`q=${encodeURIComponent(termo)}`);

  if (params.length > 0) url += "?" + params.join("&");

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const lista = document.getElementById("listaProximos");
      lista.innerHTML = "";

      if (data.length === 0) {
        lista.innerHTML = "<p>Nenhum estabelecimento encontrado.</p>";
        return;
      }

      data.forEach((estab) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
          <img src="http://localhost:3001/${
            estab.img_estabelecimento || "imgs/default.jpg"
          }" alt="${estab.nome_estabelecimento}">
          <h3 class="nomeest">${estab.nome_estabelecimento}</h3>
          <p class="cidadeest">${estab.cidade_estabelecimento || ""}</p>
          <button class="ver-mais">Ver Mais</button>
        `;

        card.querySelector(".ver-mais").addEventListener("click", () => {
          localStorage.setItem(
            "estabelecimentoSelecionado",
            estab.id_estabelecimento
          );
          window.location.href = "estabelecimento.html";
        });

        lista.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("Erro ao carregar estabelecimentos:", err);
    });
}
