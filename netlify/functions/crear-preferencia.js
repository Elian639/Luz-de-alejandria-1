function crearIdempotencyKey() {
    return crypto.randomUUID();
}

export default async (request) => {

    if (request.method !== "POST") {

        return new Response(
            JSON.stringify({
                error: "Método no permitido"
            }),
            {
                status: 405,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    }

    try {

        const body = await request.json();

        if (
            !body.items ||
            !Array.isArray(body.items) ||
            body.items.length === 0
        ) {

            return new Response(
                JSON.stringify({
                    error: "No hay productos en el carrito."
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

        }

        const items = body.items.map(item => ({

            id: String(item.id),

            title: String(item.title),

            quantity: Number(item.quantity),

            unit_price: Number(item.unit_price),

            currency_id: "ARS"

        }));


        const payload = {

            items: items,

            external_reference:
                `EA-${Date.now()}`,

            statement_descriptor:
                "EDICIONES ALEJANDRIA"

        };


        const respuesta = await fetch(
            "https://api.mercadopago.com/checkout/preferences",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${process.env.MP_ACCESS_TOKEN}`,

                    "X-Idempotency-Key":
                        crearIdempotencyKey()

                },

                body:
                    JSON.stringify(payload)

            }
        );


        const data =
            await respuesta.json();


        if (!respuesta.ok) {

            console.error(
                "Mercado Pago Checkout:",
                data
            );


            return new Response(

                JSON.stringify({

                    error:
                        "Mercado Pago rechazó la creación del pago.",

                    details:
                        data

                }),

                {

                    status:
                        respuesta.status,

                    headers: {

                        "Content-Type":
                            "application/json"

                    }

                }

            );

        }


        return new Response(

            JSON.stringify({

                id:
                    data.id,

                init_point:
                    data.init_point

            }),

            {

                status: 200,

                headers: {

                    "Content-Type":
                        "application/json"

                }

            }

        );

    } catch (error) {

        console.error(
            "Error crear-preferencia:",
            error
        );


        return new Response(

            JSON.stringify({

                error:
                    "Error interno al crear el pago."

            }),

            {

                status: 500,

                headers: {

                    "Content-Type":
                        "application/json"

                }

            }

        );

    }

};