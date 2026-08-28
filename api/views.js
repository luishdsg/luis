export default async function handler(req, res) {

    // Permitir somente POST
    if (req.method !== "POST") {
        return res.status(405).json({
            erro: "Método não permitido"
        });
    }

    try {

        const resposta = await fetch(
            "https://api.counterapi.dev/v2/luishdsgs-team-5280/first-counter-5280/up",
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${process.env.COUNTER_API_KEY}`
                }
            }
        );

        const dados = await resposta.json();

        console.log("CounterAPI:", dados);

        if (!resposta.ok) {

            return res.status(resposta.status).json({
                erro: dados.message || "Erro na CounterAPI",
                detalhes: dados
            });

        }

        /*
         * A V2 retorna o valor dentro da resposta.
         * Mantemos algumas possibilidades para facilitar
         * caso a estrutura da resposta varie.
         */

        const total =
            dados.data?.up_count ??
            dados.data?.value ??
            dados.up_count ??
            dados.value ??
            0;

        return res.status(200).json({
            total: total
        });

    } catch (erro) {

        console.error("Erro:", erro);

        return res.status(500).json({
            erro: "Erro interno ao registrar visita"
        });

    }
}