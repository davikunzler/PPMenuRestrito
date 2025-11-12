document
  .getElementById("formCadastro1")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const cidade = document.getElementById("cidade").value;
    const filtros = document.getElementById("filtros").value;
    const descricao = document.getElementById("descricao").value;
    const imagemFile = document.getElementById("imagem").files[0];

    if (!nome || !email || !senha || !cidade || !filtros || !descricao) {
      alert("Todos os campos são obrigatórios");
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("email", email);
    formData.append("senha", senha);
    formData.append("cidade", cidade);
    formData.append("filtros", filtros);
    formData.append("descricao", descricao);

    if (imagemFile) {
      formData.append("imagem", imagemFile);
    }

    try {
      const response = await fetch("http://localhost:3001/cadastrarEstabele", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Cadastro realizado com sucesso!");
        window.location.href = "http://127.0.0.1:5500/front/html/loginUser.html";
      } else {
        alert(data.message || "Erro ao cadastrar estabelecimento.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar estabelecimento", error);
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
  const primeiroCampo = document.querySelector("input, textarea, select");
  if (primeiroCampo) primeiroCampo.focus();
};
