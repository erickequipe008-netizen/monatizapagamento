document
.getElementById("btnPagamento")
.addEventListener("click", async () => {

    const resposta = await fetch("/criar-pagamento");

    const dados = await resposta.json();

    document.getElementById("resultado").innerText =
        JSON.stringify(dados, null, 2);

});