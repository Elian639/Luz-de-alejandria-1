/* =========================================================
   EDICIONES ALEJANDRÍA
   SCRIPT.JS
   ========================================================= */


/* =========================================================
   ELEMENTOS
   ========================================================= */

const botonCarrito =
    document.getElementById("cartButton");

const cerrarCarrito =
    document.getElementById("cerrarCarrito");

const carrito =
    document.getElementById("carrito");

const overlay =
    document.getElementById("cartOverlay");

const carritoItems =
    document.getElementById("carritoItems");

const contadorCarrito =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const checkoutButton =
    document.getElementById("checkoutButton");

const qrButton =
    document.getElementById("qrButton");

const qrModal =
    document.getElementById("qrModal");

const cerrarQr =
    document.getElementById("cerrarQr");

const qrContainer =
    document.getElementById("qrContainer");

const qrTotal =
    document.getElementById("qrTotal");

const buscador =
    document.getElementById("buscador");

const filtroCategoria =
    document.getElementById("filtroCategoria");

const catalogoLibros =
    document.getElementById("catalogoLibros");



/* =========================================================
   CARRITO
   ========================================================= */

let carritoProductos =
    JSON.parse(
        localStorage.getItem("edicionesAlejandriaCarrito")
    ) || [];



/* =========================================================
   FORMATO MONEDA
   ========================================================= */

function formatearPrecio(precio) {

    return new Intl.NumberFormat(
        "es-AR",
        {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0
        }
    ).format(precio);

}



/* =========================================================
   GUARDAR CARRITO
   ========================================================= */

function guardarCarrito() {

    localStorage.setItem(
        "edicionesAlejandriaCarrito",
        JSON.stringify(carritoProductos)
    );

}



/* =========================================================
   ABRIR CARRITO
   ========================================================= */

function abrirCarrito() {

    carrito.classList.add("abierto");

    overlay.classList.add("activo");

    document.body.classList.add(
        "carrito-abierto"
    );

}



/* =========================================================
   CERRAR CARRITO
   ========================================================= */

function cerrarPanelCarrito() {

    carrito.classList.remove("abierto");

    overlay.classList.remove("activo");

    document.body.classList.remove(
        "carrito-abierto"
    );

}


if (botonCarrito) {

    botonCarrito.addEventListener(
        "click",
        abrirCarrito
    );

}


if (cerrarCarrito) {

    cerrarCarrito.addEventListener(
        "click",
        cerrarPanelCarrito
    );

}


if (overlay) {

    overlay.addEventListener(
        "click",
        cerrarPanelCarrito
    );

}



/* =========================================================
   AGREGAR PRODUCTO
   ========================================================= */

function agregarAlCarrito(id) {

    const libro =
        libros.find(
            producto => producto.id === id
        );

    if (!libro) return;


    const existente =
        carritoProductos.find(
            item => item.id === id
        );


    if (existente) {

        existente.cantidad++;

    } else {

        carritoProductos.push({

            ...libro,

            cantidad: 1

        });

    }


    guardarCarrito();

    renderizarCarrito();

    abrirCarrito();

}



/* =========================================================
   CAMBIAR CANTIDAD
   ========================================================= */

function cambiarCantidad(id, cambio) {

    const item =
        carritoProductos.find(
            producto => producto.id === id
        );

    if (!item) return;


    item.cantidad += cambio;


    if (item.cantidad <= 0) {

        carritoProductos =
            carritoProductos.filter(
                producto => producto.id !== id
            );

    }


    guardarCarrito();

    renderizarCarrito();

}



/* =========================================================
   ELIMINAR
   ========================================================= */

function eliminarDelCarrito(id) {

    carritoProductos =
        carritoProductos.filter(
            producto => producto.id !== id
        );


    guardarCarrito();

    renderizarCarrito();

}



/* =========================================================
   TOTAL
   ========================================================= */

function calcularTotal() {

    return carritoProductos.reduce(
        (total, item) =>
            total +
            (item.precio * item.cantidad),
        0
    );

}



/* =========================================================
   CANTIDAD TOTAL
   ========================================================= */

function calcularCantidad() {

    return carritoProductos.reduce(
        (total, item) =>
            total + item.cantidad,
        0
    );

}



/* =========================================================
   RENDERIZAR CARRITO
   ========================================================= */

function renderizarCarrito() {

    if (!carritoItems) return;


    const cantidad =
        calcularCantidad();


    contadorCarrito.textContent =
        cantidad;


    cartTotal.textContent =
        formatearPrecio(
            calcularTotal()
        );


    if (carritoProductos.length === 0) {

        carritoItems.innerHTML = `

            <div class="carrito-vacio">

                <div>📚</div>

                <h3>
                    Tu carrito está vacío
                </h3>

                <p>
                    Agregá un libro para comenzar
                    tu compra.
                </p>

            </div>

        `;

        return;

    }


    carritoItems.innerHTML = "";


    carritoProductos.forEach(item => {

        const elemento =
            document.createElement("div");


        elemento.className =
            "carrito-item";


        elemento.innerHTML = `

            <img
                src="${item.imagen}"
                alt="${item.titulo}"
            >


            <div>

                <h4>
                    ${item.titulo}
                </h4>

                <div class="carrito-item-price">

                    ${formatearPrecio(item.precio)}

                </div>


                <div class="cantidad">

                    <button
                        onclick="cambiarCantidad(${item.id}, -1)">

                        −

                    </button>


                    <strong>
                        ${item.cantidad}
                    </strong>


                    <button
                        onclick="cambiarCantidad(${item.id}, 1)">

                        +

                    </button>

                </div>


                <button
                    class="eliminar-item"
                    onclick="eliminarDelCarrito(${item.id})">

                    Eliminar

                </button>

            </div>


            <strong>

                ${formatearPrecio(
                    item.precio * item.cantidad
                )}

            </strong>

        `;


        carritoItems.appendChild(elemento);

    });

}



/* =========================================================
   MOSTRAR LIBROS
   ========================================================= */

function mostrarLibros(lista) {

    if (!catalogoLibros) return;


    catalogoLibros.innerHTML = "";


    if (lista.length === 0) {

        catalogoLibros.innerHTML = `

            <div class="sin-resultados">

                <h3>
                    No encontramos libros
                </h3>

                <p>
                    Probá con otra búsqueda
                    o categoría.
                </p>

            </div>

        `;

        return;

    }


    lista.forEach(libro => {

        const tarjeta =
            document.createElement("article");


        tarjeta.className =
            "libro-card";


        tarjeta.innerHTML = `

            <div class="libro-imagen">

                <img
                    src="${libro.imagen}"
                    alt="${libro.titulo}"
                    loading="lazy"
                    onerror="
                        this.style.display='none';
                    "
                >


                <span>
                    ${libro.categoriaNombre}
                </span>

            </div>


            <div class="libro-info">

                <h3>
                    ${libro.titulo}
                </h3>


                <p>
                    ${libro.descripcion}
                </p>


                <div class="libro-footer">

                    <strong>
                        ${formatearPrecio(libro.precio)}
                    </strong>


                    <button
                        class="btn-comprar"
                        data-id="${libro.id}">

                        🛒 Agregar

                    </button>

                </div>

            </div>

        `;


        const boton =
            tarjeta.querySelector(
                ".btn-comprar"
            );


        boton.addEventListener(
            "click",
            () => agregarAlCarrito(libro.id)
        );


        catalogoLibros.appendChild(
            tarjeta
        );

    });

}



/* =========================================================
   FILTRAR
   ========================================================= */

function filtrarLibros() {

    const texto =
        buscador.value
            .toLowerCase()
            .trim();


    const categoria =
        filtroCategoria.value;


    const resultado =
        libros.filter(libro => {

            const textoCompleto =
                `
                ${libro.titulo}
                ${libro.descripcion}
                ${libro.categoriaNombre}
                `
                .toLowerCase();


            const coincideTexto =
                textoCompleto.includes(texto);


            const coincideCategoria =
                categoria === "todos" ||
                libro.categoria === categoria;


            return (
                coincideTexto &&
                coincideCategoria
            );

        });


    mostrarLibros(resultado);

}


buscador.addEventListener(
    "input",
    filtrarLibros
);


filtroCategoria.addEventListener(
    "change",
    filtrarLibros
);



/* =========================================================
   CATEGORÍAS
   ========================================================= */

document
    .querySelectorAll(".category-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const categoria =
                    card.dataset.categoria;


                filtroCategoria.value =
                    categoria;


                filtrarLibros();


                document
                    .getElementById("catalogo")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    });



/* =========================================================
   SONIDO DE INICIO
   ========================================================= */

const sonidoInicio =
    document.getElementById(
        "sonidoInicio"
    );


let sonidoReproducido = false;


function reproducirSonidoInicio() {

    if (
        !sonidoInicio ||
        sonidoReproducido
    ) return;


    sonidoInicio.volume = 0.35;


    sonidoInicio
        .play()
        .then(() => {

            sonidoReproducido = true;

        })
        .catch(() => {

            /*
             Los navegadores pueden bloquear
             el autoplay.

             Se intenta nuevamente con
             la primera interacción.
            */

        });

}


window.addEventListener(
    "load",
    reproducirSonidoInicio
);


[
    "click",
    "touchstart",
    "keydown"
].forEach(evento => {

    document.addEventListener(
        evento,
        reproducirSonidoInicio,
        {
            once: true,
            passive: true
        }
    );

});



/* =========================================================
   MERCADO PAGO - CHECKOUT PRO
   ========================================================= */

async function pagarConMercadoPago() {

    if (
        carritoProductos.length === 0
    ) {

        alert(
            "Tu carrito está vacío."
        );

        return;

    }


    checkoutButton.disabled = true;

    checkoutButton.textContent =
        "Preparando pago...";


    try {

        const respuesta =
            await fetch(
                "/.netlify/functions/crear-preferencia",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        items:
                            carritoProductos.map(
                                item => ({

                                    id: item.id,

                                    title:
                                        item.titulo,

                                    quantity:
                                        item.cantidad,

                                    unit_price:
                                        item.precio

                                })
                            )

                    })

                }
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo crear el pago."
            );

        }


        const data =
            await respuesta.json();


        if (!data.init_point) {

            throw new Error(
                "Mercado Pago no devolvió el enlace de pago."
            );

        }


        window.location.href =
            data.init_point;


    } catch (error) {

        console.error(error);


        alert(
            "No pudimos iniciar el pago. " +
            "Revisá la configuración de Mercado Pago."
        );


    } finally {

        checkoutButton.disabled = false;

        checkoutButton.textContent =
            "💳 Pagar con Mercado Pago";

    }

}


checkoutButton.addEventListener(
    "click",
    pagarConMercadoPago
);



/* =========================================================
   QR MERCADO PAGO
   ========================================================= */

async function generarQR() {

    if (
        carritoProductos.length === 0
    ) {

        alert(
            "Tu carrito está vacío."
        );

        return;

    }


    qrModal.classList.add("activo");


    qrContainer.innerHTML = `

        <div class="qr-loading">

            Generando QR...

        </div>

    `;


    qrTotal.textContent =
        formatearPrecio(
            calcularTotal()
        );


    try {

        const respuesta =
            await fetch(
                "/.netlify/functions/crear-qr",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        items:
                            carritoProductos.map(
                                item => ({

                                    id: item.id,

                                    title:
                                        item.titulo,

                                    quantity:
                                        item.cantidad,

                                    unit_price:
                                        item.precio

                                })
                            ),

                        total:
                            calcularTotal()

                    })

                }
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo generar el QR."
            );

        }


        const data =
            await respuesta.json();


        if (!data.qr_data) {

            throw new Error(
                "Mercado Pago no devolvió el QR."
            );

        }


        /*
         * Usamos una API de generación
         * de imagen QR solamente para
         * convertir la trama devuelta
         * por Mercado Pago en una imagen.
         */

        const qrUrl =
            "https://api.qrserver.com/v1/create-qr-code/?" +
            "size=225x225&data=" +
            encodeURIComponent(
                data.qr_data
            );


        qrContainer.innerHTML = `

            <img
                src="${qrUrl}"
                alt="Código QR de Mercado Pago"
            >

        `;


    } catch (error) {

        console.error(error);


        qrContainer.innerHTML = `

            <div class="qr-loading">

                No se pudo generar el QR.

                <br><br>

                Revisá la configuración
                de Mercado Pago.

            </div>

        `;

    }

}


qrButton.addEventListener(
    "click",
    generarQR
);



/* =========================================================
   CERRAR QR
   ========================================================= */

function cerrarModalQR() {

    qrModal.classList.remove(
        "activo"
    );

}


cerrarQr.addEventListener(
    "click",
    cerrarModalQR
);


qrModal.addEventListener(
    "click",
    event => {

        if (
            event.target === qrModal
        ) {

            cerrarModalQR();

        }

    }
);



/* =========================================================
   ESCAPE
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            cerrarPanelCarrito();

            cerrarModalQR();

        }

    }
);



/* =========================================================
   INICIAR
   ========================================================= */

mostrarLibros(libros);

renderizarCarrito();