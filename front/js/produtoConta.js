const produtoRaw = localStorage.getItem("produtoSelecionado");
let produto = null;

try {
  produto = JSON.parse(produtoRaw);
} catch (e) {
  console.error("Erro ao ler produto:", produtoRaw);
}

if (!produto) {
  alert("Nenhum produto selecionado.");
  window.location.href = "home.html";
} else {
  document.querySelector(".titulo-item").textContent =
    produto.nome_produto || "Produto sem nome";

  document.querySelector(".valor").textContent = `R$ ${
    parseFloat(produto.preco_produto).toFixed(2) || "0,00"
  }`;

  document.querySelector(".descricao").textContent =
    produto.descricao_produto || "Sem descrição";

  let filtros = [];
  filtros.push(produto.contem_gluten ? "Contém Glúten" : "Sem Glúten");
  filtros.push(produto.contem_lactose ? "Contém Lactose" : "Sem Lactose");
  document.querySelector(".filtro-texto").textContent = filtros.join(" | ");

  const imgElem = document.querySelector(".imagem-produto");
  if (produto.img_produto) {
    imgElem.src = produto.img_produto.startsWith("http")
      ? produto.img_produto
      : `http://localhost:3001/${produto.img_produto.replace(/\\/g, "/")}`;
  } else {
    imgElem.src = "imgs/default.jpg";
  }
}
