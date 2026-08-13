// ========================================
// CONFIGURACIÓN SUPABASE
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

const formulario =
    document.getElementById("ventaForm");


// ========================================
// VERIFICAR SESIÓN
// ========================================

async function verificarSesion() {

    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();

    if (error) {

        console.error(
            "Error verificando sesión:",
            error
        );

        window.location.href = "login.html";

        return;
    }

    if (!session) {

        window.location.href = "login.html";

        return;
    }

    // Mostrar usuario conectado
    mostrarUsuario(session.user);

}


// ========================================
// MOSTRAR USUARIO Y BOTÓN SALIR
// ========================================

function mostrarUsuario(user) {

    const header = document.querySelector("header");

    if (!header) return;

    const usuarioDiv =
        document.createElement("div");

    usuarioDiv.style.textAlign = "right";
    usuarioDiv.style.padding = "10px 20px";

    usuarioDiv.innerHTML = `

        <span style="margin-right: 15px;">
            👤 ${user.email}
        </span>

        <button
            id="btnCerrarSesion"
            type="button"
            style="
                padding: 8px 15px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
            "
        >
            Cerrar sesión
        </button>

    `;

    header.appendChild(usuarioDiv);


    document
        .getElementById("btnCerrarSesion")
        .addEventListener(
            "click",
            cerrarSesion
        );

}


// ========================================
// CERRAR SESIÓN
// ========================================

async function cerrarSesion() {

    const confirmar =
        confirm(
            "¿Quieres cerrar sesión?"
        );

    if (!confirmar) {
        return;
    }

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {

        console.error(
            "Error cerrando sesión:",
            error
        );

        alert(
            "❌ No se pudo cerrar sesión."
        );

        return;
    }

    window.location.href =
        "login.html";
}


// ========================================
// REGISTRAR VENTA
// ========================================

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


            console.log(
                "Venta que se enviará:",
                venta
            );


            // ========================================
            // INSERTAR EN SUPABASE
            // ========================================

            const {
                data,
                error
            } = await supabaseClient
                .from("ventas")
                .insert([venta])
                .select();


            if (error) {

                console.error(
                    "ERROR SUPABASE:",
                    error
                );

                alert(
                    "❌ Error al registrar la venta:\n\n" +
                    error.message
                );

                return;
            }


            console.log(
                "Venta guardada:",
                data
            );


            alert(
                "✅ Venta registrada correctamente"
            );


            formulario.reset();

            document
                .getElementById("cantidad")
                .value = 1;


            await cargarVentas();

        }
    );

}


// ========================================
// CARGAR VENTAS DESDE SUPABASE
// ========================================

async function cargarVentas() {

    const {
        data,
        error
    } = await supabaseClient
        .from("ventas")
        .select("*")
        .order(
            "fecha",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Error cargando ventas:",
            error
        );

        alert(
            "❌ No se pudieron cargar las ventas:\n\n" +
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


    const campoBusqueda =
        document.getElementById(
            "buscar"
        );


    const busqueda =
        campoBusqueda
            ? campoBusqueda.value.toLowerCase()
            : "";


    tabla.innerHTML = "";


    const ventasFiltradas =
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


    ventasFiltradas.forEach(v => {

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
                S/ ${Number(
                    v.monto || 0
                ).toFixed(2)}
            </td>

            <td>
                ${fecha}
            </td>

            <td>

                <button
                    class="btn-eliminar"
                    onclick="eliminarVenta('${v.id}')"
                >
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
            "¿Estás seguro de eliminar esta venta?"
        );


    if (!confirmar) {
        return;
    }


    const {
        error
    } = await supabaseClient
        .from("ventas")
        .delete()
        .eq("id", id);


    if (error) {

        console.error(
            "Error eliminando:",
            error
        );

        alert(
            "❌ No se pudo eliminar:\n\n" +
            error.message
        );

        return;
    }


    alert(
        "✅ Venta eliminada"
    );


    await cargarVentas();

}


// ========================================
// RESUMEN
// ========================================

function actualizarResumen() {

    document.getElementById(
        "totalVentas"
    ).textContent =
        ventas.length;


    const total =
        ventas.reduce(

            (suma, venta) =>

                suma +
                Number(
                    venta.monto || 0
                ),

            0

        );


    document.getElementById(
        "totalDinero"
    ).textContent =
        total.toFixed(2);


    const lima =
        ventas.filter(
            v =>
                v.destino_tipo ===
                "Lima"
        ).length;


    const provincia =
        ventas.filter(
            v =>
                v.destino_tipo ===
                "Provincia"
        ).length;


    document.getElementById(
        "totalLima"
    ).textContent =
        lima;


    document.getElementById(
        "totalProvincia"
    ).textContent =
        provincia;

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
// INICIAR APP
// ========================================

async function iniciarApp() {

    await verificarSesion();

    await cargarVentas();

}

iniciarApp();
