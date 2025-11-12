document.getElementById("formProduto").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const preco = document.getElementById("preco").value;
  const descricao = document.getElementById("descricao").value;
  const contem_gluten = document.getElementById("contem_gluten").value;
  const contem_lactose = document.getElementById("contem_lactose").value;
  const id_estabelecimento = localStorage.getItem("id");
  const imagemFile = document.getElementById("imagem").files[0];

  if (
    !nome ||
    !preco ||
    !descricao ||
    !contem_gluten ||
    !contem_lactose ||
    !id_estabelecimento
  ) {
    alert("Todos os campos são obrigatórios");
    return;
  }

  const formData = new FormData();
  formData.append("nome", nome);
  formData.append("preco", preco);
  formData.append("descricao", descricao);
  formData.append("contem_gluten", contem_gluten);
  formData.append("contem_lactose", contem_lactose);
  formData.append("id_estabelecimento", id_estabelecimento);

  if (imagemFile) {
    formData.append("imagem", imagemFile);
  }

  try {
    const response = await fetch("http://localhost:3001/cadastrarProduto", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.message) {
      alert(data.message);
    }

    if (response.ok) {
      document.getElementById("formProduto").reset();
    }
  } catch (error) {
    console.error("Erro ao cadastrar produto", error);
    alert("Erro ao conectar com o servidor.");
  }
});

const inputImagem = document.getElementById("imagem");
const preview = document.getElementById("preview");

inputImagem.addEventListener("change", () => {
  const file = inputImagem.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    preview.style.display = "none";
  }
});
window.onload = () => {
  document.querySelector("input, textarea, select").focus();
};
