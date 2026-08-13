const SUPABASE_URL = "https://labgklmijzytxzjsrwxe.supabase.co/rest/v1/";

const SUPABASE_KEY = "sb_publishable_4XzzjrO_JNsDjIiD0ttSBg_QcmkbiuN";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let ventas =  [];

const formulario = document.getElementById("ventaForm");

formulario.addEventListener("submit", function(e) {

    e.preventDefault();

    const venta = {

        id: Date.now(),

        numeroCliente:
            document.getElementById("numeroCliente").value,

        nombreCliente:
            document.getElementById("nombreCliente").value,

        celular:
            document.getElementById("celular").value,

        destinoTipo:
            document.getElementById("destinoTipo").value,

        destino:
            document.getElementById("destino").value,

        producto:
            document.getElementById("producto").value,

        cantidad:
            Number(document.getElementById("cantidad").value),

        monto:
            Number(document.getElementById("monto").value),

        metodoPago:
            document.getElementById("metodoPago").value,

        nombreYape:
            document.getElementById("nombreYape").value,

        observaciones:
            document.getElementById("observaciones").value,

        fecha:
            new Date().toLocaleString("es-PE")

    };

    ventas.push(venta);

    guardarVentas();

    formulario.reset();

    document.getElementById("cantidad").value = 1;

    mostrarVentas();

    alert("Venta registrada correctamente.");

});


function guardarVentas() {



}


function mostrarVentas() {

    const tabla =
        document.getElementById("tablaVentas");

    const busqueda =
        document.getElementById("buscar").value.toLowerCase();

    tabla.innerHTML = "";

    const ventasFiltradas = ventas.filter(v =>

        v.nombreCliente.toLowerCase().includes(busqueda) ||

        v.numeroCliente.toLowerCase().includes(busqueda) ||

        v.producto.toLowerCase().includes(busqueda) ||

        v.destino.toLowerCase().includes(busqueda)

    );


    ventasFiltradas.forEach(v => {

        const fila = document.createElement("tr");

        fila.innerHTML = `

            <td>${v.numeroCliente}</td>

            <td>${v.nombreCliente}</td>

            <td>
                ${v.destinoTipo}<br>
                ${v.destino}
            </td>

            <td>
                ${v.producto}
                <br>
                x${v.cantidad}
            </td>

            <td>${v.metodoPago}</td>

            <td>${v.nombreYape || "-"}</td>

            <td>S/ ${v.monto.toFixed(2)}</td>

            <td>${v.fecha}</td>

            <td>

                <button
                    class="btn-eliminar"
                    onclick="eliminarVenta(${v.id})"
                >
                    Eliminar
                </button>

            </td>

        `;

        tabla.appendChild(fila);

    });


    actualizarResumen();

}


function eliminarVenta(id) {

    const confirmar =
        confirm("¿Eliminar esta venta?");

    if (!confirmar) return;

    ventas =
        ventas.filter(v => v.id !== id);

    guardarVentas();

    mostrarVentas();

}


function actualizarResumen() {

    document.getElementById("totalVentas").textContent =
        ventas.length;


    const total =
        ventas.reduce(
            (suma, venta) => suma + venta.monto,
            0
        );

    document.getElementById("totalDinero").textContent =
        total.toFixed(2);


    const lima =
        ventas.filter(
            v => v.destinoTipo === "Lima"
        ).length;

    const provincia =
        ventas.filter(
            v => v.destinoTipo === "Provincia"
        ).length;


    document.getElementById("totalLima").textContent =
        lima;

    document.getElementById("totalProvincia").textContent =
        provincia;

}


document
    .getElementById("buscar")
    .addEventListener(
        "input",
        mostrarVentas
    );


mostrarVentas();
