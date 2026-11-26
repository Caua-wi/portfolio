const equipe = ["Ana", "Bruno", "Clara"];
// Os protocolos estão em ordem de chegada.
const exemplos = [
  ["Ajuste de período", "Ana"],
  ["Inclusão de disciplina", "Clara"],
  ["Reopção de curso", null],
  ["Aproveitamento de estudos", null],
  ["Reingresso", null],
  ["Transferência de polo", null]
];
const carga = document.querySelector("#carga");
const fila = document.querySelector("#fila");
const distribuir = document.querySelector("#distribuir");
const aviso = document.querySelector("#aviso");
let chamados;

function iniciar() {
  chamados = exemplos.map(([assunto, tecnico], indice) => ({
    protocolo: "AC-" + (101 + indice), assunto, tecnico, concluido: false
  }));
  atualizar();
}

function abertos(tecnico) {
  return chamados.filter(chamado => chamado.tecnico === tecnico && !chamado.concluido).length;
}

function atualizar() {
  carga.replaceChildren();
  for (const tecnico of equipe) {
    const item = document.createElement("li");
    const quantidade = document.createElement("strong");
    quantidade.textContent = abertos(tecnico);
    item.append(tecnico, quantidade);
    carga.append(item);
  }

  fila.replaceChildren();
  for (const chamado of chamados) {
    const item = document.createElement("li");
    const detalhes = document.createElement("div");
    detalhes.textContent = chamado.assunto;
    const meta = document.createElement("small");
    let situacao = "Em espera";
    if (chamado.tecnico) {
      situacao = (chamado.concluido ? "Concluído" : "Em atendimento") + " · " + chamado.tecnico;
    }
    meta.textContent = chamado.protocolo + " · " + situacao;
    detalhes.append(meta);
    item.append(detalhes);
    if (chamado.tecnico && !chamado.concluido) {
      const botao = document.createElement("button");
      botao.className = "secundario";
      botao.textContent = "Concluir";
      botao.setAttribute("aria-label", "Concluir chamado " + chamado.protocolo);
      botao.onclick = () => {
        chamado.concluido = true;
        atualizar();
        const proximoBotao = fila.querySelector("button") || document.querySelector("#reiniciar");
        proximoBotao.focus();
        aviso.textContent = "Atendimento " + chamado.protocolo + " concluído.";
      };
      item.append(botao);
    }
    fila.append(item);
  }
  distribuir.disabled = chamados.every(chamado => chamado.tecnico);
}

distribuir.onclick = () => {
  const proximo = chamados.find(chamado => !chamado.tecnico);
  if (!proximo) return;
  proximo.tecnico = equipe.reduce((melhor, tecnico) => abertos(tecnico) < abertos(melhor) ? tecnico : melhor);
  atualizar();
  aviso.textContent = proximo.protocolo + " atribuído a " + proximo.tecnico + "." +
    (distribuir.disabled ? " Todos os chamados foram distribuídos." : "");
  if (distribuir.disabled) document.querySelector("#reiniciar").focus();
};

document.querySelector("#reiniciar").onclick = () => {
  iniciar();
  aviso.textContent = "Fila inicial restaurada.";
};
iniciar();
