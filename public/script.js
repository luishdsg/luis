async function registrarVisita() {

    try {

        const resposta = await fetch(
            "/api/views",
            {
                method: "POST"
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                dados.erro || "Erro ao registrar visita"
            );

        }

        document.getElementById("contador").textContent =
            Number(dados.total).toLocaleString("pt-BR");

        console.log(
            "Visita registrada:",
            dados.total
        );

    } catch (erro) {

        console.error(
            "Erro ao registrar visita:",
            erro
        );

        document.getElementById("contador").textContent =
            "Indisponível";
    }
}


registrarVisita();