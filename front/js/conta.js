const usuarioRaw = localStorage.getItem("usuarioLogado");
let usuario = null;

try {
  usuario = JSON.parse(usuarioRaw);
} catch (e) {
  console.error("Erro ao ler dados do usuário:", usuarioRaw);
}

if (!usuario) {
  window.location.href = "loginUser.html";
} else {
  document.getElementById("nome-usuario").textContent =
    usuario.nome || "Usuário";
  document.getElementById("email-usuario").textContent = usuario.email || "-";
  document.getElementById("cidade-usuario").textContent = usuario.cidade || "-";
  document.getElementById("filtros-usuario").textContent =
    usuario.filtros || "Nenhum filtro";

  if (usuario.tipo === "estabelecimento") {
    const avaliacoes = document.getElementById("avaliacoes");
    avaliacoes.style.display = "block";

    if (usuario.descricao) {
      const descricaoElem = document.getElementById(
        "descricao-estabelecimento"
      );
      descricaoElem.style.display = "block";
      descricaoElem.querySelector("span").textContent = usuario.descricao;
    }

    const btnCadastro = document.getElementById("btn-cadastrar-produto");
    btnCadastro.style.display = "block";
    btnCadastro.addEventListener("click", () => {
      window.location.href = "cadastroProduto.html";
    });

    fetch(`http://localhost:3001/produtosPorEstabelecimento/${usuario.id}`)
      .then((res) => res.json())
      .then((produtos) => {
        const container = document.querySelector(".avaliacoes");
        container.innerHTML = "<h2>Produtos cadastrados</h2>";

        if (produtos.length === 0) {
          container.innerHTML += "<p>Nenhum produto cadastrado ainda.</p>";
          return;
        }

        produtos.forEach((produto) => {
          const item = document.createElement("div");
          item.classList.add("avaliacao-item");

          const imagemUrl = produto.img_produto
            ? `http://localhost:3001/${produto.img_produto.replace(/\\/g, "/")}`
            : "imgs/default.jpg";

          item.innerHTML = `
            <div class="produto-card" style="cursor: pointer;">
              <img src="${imagemUrl}" alt="${produto.nome_produto}" />
              <div class="produto-info">
                <p><strong>${produto.nome_produto}</strong></p>
                <p>R$ ${parseFloat(produto.preco_produto).toFixed(2)}</p>
                <p>${produto.descricao_produto}</p>
              </div>
              <div class="produto-actions">
                <button class="editar-produto">Editar</button>
                <button class="excluir-produto">Excluir</button>
              </div>
            </div>
          `;

          const produtoCard = item.querySelector(".produto-card");
          const btnEditar = item.querySelector(".editar-produto");
          const btnExcluir = item.querySelector(".excluir-produto");

          produtoCard.addEventListener("click", (e) => {
            if (e.target === btnEditar || e.target === btnExcluir) return;
            localStorage.setItem("produtoSelecionado", JSON.stringify(produto));
            window.location.href = "produto.html";
          });

          btnEditar.addEventListener("click", (e) => {
            e.stopPropagation();
            abrirModalEditarProduto(produto);
          });

          btnExcluir.addEventListener("click", async (e) => {
            e.stopPropagation();
            const confirmar = confirm(
              `Excluir o produto "${produto.nome_produto}"?`
            );
            if (!confirmar) return;

            try {
              const res = await fetch(
                `http://localhost:3001/deleteProduto/${produto.id_produto}`,
                {
                  method: "DELETE",
                }
              );
              const data = await res.json();
              if (data.success) {
                alert("Produto excluído com sucesso!");
                item.remove();
              } else {
                alert(data.message || "Erro ao excluir produto.");
              }
            } catch (err) {
              console.error("Erro ao excluir:", err);
              alert("Erro ao excluir produto.");
            }
          });

          container.appendChild(item);
        });
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
      });
  }

  document.getElementById("senha-usuario").textContent = "********";
}

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "loginUser.html";
});

document.getElementById("excluir").addEventListener("click", async () => {
  if (!usuario) return;

  const confirmDelete = confirm("Tem certeza que deseja excluir sua conta?");
  if (!confirmDelete) return;

  const senha = prompt("Digite sua senha para confirmar:");
  if (!senha) {
    alert("Você precisa informar a senha para excluir sua conta.");
    return;
  }

  const rota =
    usuario.tipo === "estabelecimento"
      ? `http://localhost:3001/deleteEstabelecimento/${usuario.email}`
      : `http://localhost:3001/deleteCliente/${usuario.email}`;

  try {
    const resposta = await fetch(rota, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha }),
    });

    const data = await resposta.json();

    if (data.success) {
      alert("Conta excluída com sucesso!");
      localStorage.removeItem("usuarioLogado");
      window.location.href = "loginUser.html";
    } else {
      alert(data.message || "Erro ao excluir conta.");
    }
  } catch (erro) {
    console.error("Erro ao deletar conta:", erro);
    alert("Erro ao deletar conta. Tente novamente mais tarde.");
  }
});

document.getElementById("editar").addEventListener("click", () => {
  if (document.getElementById("edit-modal")) return;

  const modal = document.createElement("div");
  modal.id = "edit-modal";

  const imagemUrl =
    usuario.tipo === "estabelecimento" && usuario.img_estabelecimento
      ? `http://localhost:3001/${usuario.img_estabelecimento.replace(
          /\\/g,
          "/"
        )}`
      : "imgs/default.jpg";

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      <h2>Editar Conta</h2>
      <form id="edit-form" enctype="multipart/form-data">

        ${
          usuario.tipo === "estabelecimento"
            ? `
          <label>Imagem atual</label>
          <img id="preview-img-estab" src="${imagemUrl}" alt="Imagem do estabelecimento"
               style="width: 120px; height: 120px; object-fit: cover; border-radius: 10px; display:block; margin-bottom:10px;">

          <label>Nova imagem (opcional)</label>
          <input type="file" id="edit-estab-img" accept="image/*">
        `
            : ""
        }

        <label>Nome</label>
        <input type="text" id="edit-nome" value="${
          usuario.nome || ""
        }" required>

        <label>Email (não pode ser alterado)</label>
        <input type="email" id="edit-email" value="${
          usuario.email || ""
        }" disabled>

        <label>Cidade</label>
        <input type="text" id="edit-cidade" value="${
          usuario.cidade || ""
        }" required>

        <label>Filtros</label>
        <input type="text" id="edit-filtros" value="${
          usuario.filtros || ""
        }" required>

        <hr style="margin: 15px 0;">
        <p><strong>Se quiser alterar a senha, preencha abaixo:</strong></p>

        <label>Senha atual</label>
        <input type="password" id="senha-atual" placeholder="Opcional">

        <label>Nova senha</label>
        <input type="password" id="nova-senha" placeholder="Opcional">

        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  const inputImgEstab = modal.querySelector("#edit-estab-img");
  const previewImgEstab = modal.querySelector("#preview-img-estab");
  if (inputImgEstab) {
    inputImgEstab.addEventListener("change", () => {
      const file = inputImgEstab.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => (previewImgEstab.src = e.target.result);
        reader.readAsDataURL(file);
      }
    });
  }

  modal
    .querySelector(".close-btn")
    .addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  modal.querySelector("#edit-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const senhaAtual = document.getElementById("senha-atual").value.trim();
    const novaSenha = document.getElementById("nova-senha").value.trim();

    if (novaSenha && novaSenha.length < 8) {
      alert("A nova senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    const rota =
      usuario.tipo === "estabelecimento"
        ? `http://localhost:3001/editarEstabele/${usuario.id}`
        : `http://localhost:3001/editarCliente/${usuario.id}`;

    let resposta;

    if (usuario.tipo === "estabelecimento") {
      const formData = new FormData();
      formData.append("nome", document.getElementById("edit-nome").value);
      formData.append("cidade", document.getElementById("edit-cidade").value);
      formData.append("filtros", document.getElementById("edit-filtros").value);
      formData.append("senhaAtual", senhaAtual || "");
      formData.append("novaSenha", novaSenha || "");
      if (inputImgEstab && inputImgEstab.files[0]) {
        formData.append("imagem", inputImgEstab.files[0]);
      }

      resposta = await fetch(rota, { method: "PUT", body: formData });
    } else {
      const updatedUser = {
        nome: document.getElementById("edit-nome").value,
        cidade: document.getElementById("edit-cidade").value,
        filtros: document.getElementById("edit-filtros").value,
        senhaAtual: senhaAtual || null,
        novaSenha: novaSenha || null,
      };

      resposta = await fetch(rota, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
    }

    const data = await resposta.json();

    if (data.success) {
      alert("Dados atualizados com sucesso!");
      modal.remove();
      location.reload();
    } else {
      alert(data.message || "Erro ao editar conta.");
    }
  });
});

function abrirModalEditarProduto(produto) {
  if (document.getElementById("modal-editar-produto")) return;

  const modal = document.createElement("div");
  modal.id = "modal-editar-produto";

  const imagemUrl = produto.img_produto
    ? `http://localhost:3001/${produto.img_produto.replace(/\\/g, "/")}`
    : "imgs/default.jpg";

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      <h2>Editar Produto</h2>
      <form id="form-editar-produto" enctype="multipart/form-data">
        <label>Imagem atual</label>
        <img id="preview-img" src="${imagemUrl}" alt="Imagem do produto"
             style="width: 120px; height: 120px; object-fit: cover; border-radius: 10px; display:block; margin-bottom:10px;">

        <label>Nova imagem (opcional)</label>
        <input type="file" id="edit-prod-img" accept="image/*">

        <label>Nome do produto</label>
        <input type="text" id="edit-prod-nome" value="${
          produto.nome_produto
        }" required>

        <label>Preço (R$)</label>
        <input type="number" id="edit-prod-preco" step="0.01" min="0" value="${
          produto.preco_produto
        }" required>

        <label>Descrição</label>
        <textarea id="edit-prod-desc" required>${
          produto.descricao_produto
        }</textarea>

        <label>Contém glúten?</label>
        <select id="edit-prod-gluten">
          <option value="1" ${
            produto.contem_gluten ? "selected" : ""
          }>Sim</option>
          <option value="0" ${
            !produto.contem_gluten ? "selected" : ""
          }>Não</option>
        </select>

        <label>Contém lactose?</label>
        <select id="edit-prod-lactose">
          <option value="1" ${
            produto.contem_lactose ? "selected" : ""
          }>Sim</option>
          <option value="0" ${
            !produto.contem_lactose ? "selected" : ""
          }>Não</option>
        </select>

        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  const inputImg = modal.querySelector("#edit-prod-img");
  const preview = modal.querySelector("#preview-img");

  inputImg.addEventListener("change", () => {
    const file = inputImg.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => (preview.src = e.target.result);
      reader.readAsDataURL(file);
    }
  });

  modal
    .querySelector(".close-btn")
    .addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  modal
    .querySelector("#form-editar-produto")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append("nome", document.getElementById("edit-prod-nome").value);
      formData.append(
        "preco",
        parseFloat(document.getElementById("edit-prod-preco").value)
      );
      formData.append(
        "descricao",
        document.getElementById("edit-prod-desc").value
      );
      formData.append(
        "contem_gluten",
        document.getElementById("edit-prod-gluten").value
      );
      formData.append(
        "contem_lactose",
        document.getElementById("edit-prod-lactose").value
      );
      formData.append("id_estabelecimento", usuario.id);

      if (inputImg.files[0]) {
        formData.append("imagem", inputImg.files[0]);
      }

      try {
        const res = await fetch(
          `http://localhost:3001/editarProduto/${produto.id_produto}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        const data = await res.json();
        if (data.success) {
          alert("Produto atualizado com sucesso!");
          modal.remove();
          location.reload();
        } else {
          alert(data.message || "Erro ao editar produto.");
        }
      } catch (err) {
        console.error("Erro ao editar produto:", err);
        alert("Erro ao editar produto.");
      }
    });
}
