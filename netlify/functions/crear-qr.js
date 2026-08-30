function crearIdempotencyKey() {

    return crypto.randomUUID();

}


export default async (request) => {

    if (request.method !== "POST") {

        return new Response(

            JSON.stringify({
                error:
                    "Método no permitido"
            }),

            {
                status: 405,

                headers: {
                    "Content-Type":
                        "application/json"
                }
            }

        );

    }


    try {

        const body =
            await request.json();


        if (
            !body.items ||
            !body.total
        ) {

            return new Response(

                JSON.stringify({

                    error:
                        "Datos de compra incompletos."

                }),

                {

                    status: 400,

                    headers: {

                        "Content-Type":
                            "application/json"

                    }

                }

            );

        }


        const total =
            Number(body.total);


        const items =
            body.items.map(item => ({

                title:
                    String(item.title),

                unit_price:
                    Number(item.unit_price),

                quantity:
                    Number(item.quantity),

                unit_measure:
                    "unit"

            }));


        const externalReference =
            `EA-${Date.now()}`;


        const payload = {

            type: "qr",

            total_amount:
                total.toFixed(2),

            description:
                "Compra Ediciones Alejandría",

            external_reference:
                externalReference,

            config: {

                qr: {

                    mode: "dynamic"

                }

            },

            transactions: {

                payments: [

                    {

                        amount:
                            total.toFixed(2)

                    }

                ]

            },

            items

        };


        const respuesta =
            await fetch(
                "https://api.mercadopago.com/v1/orders",
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
                "Mercado Pago QR:",
                data
            );


            return new Response(

                JSON.stringify({

                    error:
                        "No se pudo crear el QR.",

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

                order_id:
                    data.id,

                qr_data:
                    data.type_response?.qr_data

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

        console.error(error);


        return new Response(

            JSON.stringify({

                error:
                    "Error interno."

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