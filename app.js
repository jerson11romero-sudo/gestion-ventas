// ========================================
// SUPABASE
// ========================================

const SUPABASE_URL =
    "https://labgklmijzytxzjsrwxe.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_4XzzjrO_JNsDjIiD0ttSBg_QcmkbiuN";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ========================================
// VARIABLES
// ========================================

let ventas = [];


// ========================================
// COMPROBAR SESIÓN
// ========================================

async function comprobarSesion() {

    const {
        data: {
            session
        }
    } = await supabaseClient
        .auth
        .getSession();


    if (!session) {

        window.location.href =
            "login.html";

        return;
    }


    cargarVentas();

}


// ========================================
// REGISTRAR VENTA
// ========================================

const formulario =
    document.getElementById("ventaForm");


if (formulario) {

    formulario.addEventListener(
        "submit",
        async function(e) {

            e.preventDefault();


            const venta = {

                numero_cliente:
                    document
                        .getElementById("numeroCliente")
                        .value
                        .trim(),

                nombre_cliente:
                    document
                        .getElementById("nombreCliente")
                        .value
                        .trim(),

                celular:
                    document
                        .getElementById("celular")
                        .value
                        .trim(),

                destino_tipo:
                    document
                        .getElementById("destinoTipo")
                        .value,

                destino:
                    document
                        .getElementById("destino")
                        .value
                        .trim(),

                producto:
                    document
                        .getElementById("producto")
                        .value
                        .trim(),

                cantidad:
                    Number(
                        document
                            .getElementById("cantidad")
                            .value
                    ),

                monto:
                    Number(
                        document
                            .getElementById("monto")
                            .value
                    ),

                metodo_pago:
                    document
                        .getElementById("metodoPago")
                        .value,

                nombre_yape:
                    document
                        .getElementById("nombreYape")
                        .value
                        .trim(),

                observaciones:
                    document
                        .getElementById("observaciones")
                        .value
                        .trim()

            };


            const {
                error
            } =
                await supabaseClient
                    .from("ventas")
                    .insert([venta]);


            if (error) {

                console.error(error);

                alert(
                    "❌ Error:\n\n" +
                    error.message
                );

                return;
            }


            alert(
                "✅ Venta registrada correctamente"
            );


            formulario.reset();


            document
                .getElementById("cantidad")
                .value = 1;


            cargarVentas();

        }
    );

}


// ========================================
// CARGAR VENTAS
// ========================================

async function cargarVentas() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("ventas")
            .select("*")
            .order(
                "fecha",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(error);

        alert(
            "❌ Error cargando ventas:\n\n" +
            error.message
        );

        return;
    }


    ventas = data || [];


    mostrarVentas();

}


// ========================================
// MOSTRAR VENTAS
// ========================================

function mostrarVentas() {

    const tabla =
        document.getElementById(
            "tablaVentas"
        );


    if (!tabla) return;


    const buscar =
        document.getElementById(
            "buscar"
        );


    const busqueda =
        buscar
            ? buscar.value.toLowerCase()
            : "";


    tabla.innerHTML = "";


    const filtradas =
        ventas.filter(v =>

            (v.nombre_cliente || "")
                .toLowerCase()
                .includes(busqueda)

            ||

            (v.numero_cliente || "")
                .toLowerCase()
                .includes(busqueda)

            ||

            (v.producto || "")
                .toLowerCase()
                .includes(busqueda)

            ||

            (v.destino || "")
                .toLowerCase()
                .includes(busqueda)

        );


    filtradas.forEach(v => {

        const fila =
            document.createElement("tr");


        const fecha =
            v.fecha
                ? new Date(v.fecha)
                    .toLocaleString("es-PE")
                : "-";


        fila.innerHTML = `

            <td>
                ${v.numero_cliente || "-"}
            </td>

            <td>
                ${v.nombre_cliente || "-"}
            </td>

            <td>
                ${v.destino_tipo || "-"}
                <br>
                ${v.destino || "-"}
            </td>

            <td>
                ${v.producto || "-"}
                <br>
                x${v.cantidad || 0}
            </td>

            <td>
                ${v.metodo_pago || "-"}
            </td>

            <td>
                ${v.nombre_yape || "-"}
            </td>

            <td>
                S/
                ${Number(v.monto || 0).toFixed(2)}
            </td>

            <td>
                ${fecha}
            </td>

            <td>

                <button
                    class="btn-eliminar"
                    onclick="eliminarVenta('${v.id}')">

                    Eliminar

                </button>

            </td>

        `;


        tabla.appendChild(fila);

    });


    actualizarResumen();

}


// ========================================
// ELIMINAR VENTA
// ========================================

async function eliminarVenta(id) {

    const confirmar =
        confirm(
            "¿Eliminar esta venta?"
        );


    if (!confirmar) return;


    const {
        error
    } =
        await supabaseClient
            .from("ventas")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "❌ Error eliminando:\n\n" +
            error.message
        );

        return;
    }


    cargarVentas();

}


// ========================================
// RESUMEN
// ========================================

function actualizarResumen() {

    const totalVentas =
        document.getElementById(
            "totalVentas"
        );

    const totalDinero =
        document.getElementById(
            "totalDinero"
        );

    const totalLima =
        document.getElementById(
            "totalLima"
        );

    const totalProvincia =
        document.getElementById(
            "totalProvincia"
        );


    if (totalVentas) {

        totalVentas.textContent =
            ventas.length;

    }


    const total =
        ventas.reduce(
            (suma, venta) =>
                suma +
                Number(
                    venta.monto || 0
                ),
            0
        );


    if (totalDinero) {

        totalDinero.textContent =
            total.toFixed(2);

    }


    if (totalLima) {

        totalLima.textContent =
            ventas.filter(
                v =>
                    v.destino_tipo ===
                    "Lima"
            ).length;

    }


    if (totalProvincia) {

        totalProvincia.textContent =
            ventas.filter(
                v =>
                    v.destino_tipo ===
                    "Provincia"
            ).length;

    }

}


// ========================================
// BUSCADOR
// ========================================

const buscador =
    document.getElementById(
        "buscar"
    );


if (buscador) {

    buscador.addEventListener(
        "input",
        mostrarVentas
    );

}


// ========================================
// CERRAR SESIÓN
// ========================================

const btnCerrarSesion =
    document.getElementById(
        "btnCerrarSesion"
    );


if (btnCerrarSesion) {

    btnCerrarSesion.addEventListener(
        "click",
        async function() {

            await supabaseClient
                .auth
                .signOut();


            window.location.href =
                "login.html";

        }
    );

}


// ========================================
// INICIAR
// ========================================

comprobarSesion();
