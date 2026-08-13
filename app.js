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
// ELEMENTOS
// ========================================

const loginScreen =
    document.getElementById("loginScreen");

const appScreen =
    document.getElementById("appScreen");

const loginForm =
    document.getElementById("loginForm");

const loginError =
    document.getElementById("loginError");

const btnCerrarSesion =
    document.getElementById("btnCerrarSesion");

const formulario =
    document.getElementById("ventaForm");


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


    if (session) {

        mostrarAplicacion();

    } else {

        mostrarLogin();

    }

}


// ========================================
// MOSTRAR LOGIN
// ========================================

function mostrarLogin() {

    loginScreen.style.display =
        "flex";

    appScreen.style.display =
        "none";

}


// ========================================
// MOSTRAR APLICACIÓN
// ========================================

function mostrarAplicacion() {

    loginScreen.style.display =
        "none";

    appScreen.style.display =
        "block";

    cargarVentas();

}


// ========================================
// LOGIN
// ========================================

loginForm.addEventListener(
    "submit",
    async function(e) {

        e.preventDefault();


        loginError.textContent =
            "Iniciando sesión...";


        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim();


        const password =
            document
                .getElementById("loginPassword")
                .value;


        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signInWithPassword({

                    email: email,

                    password: password

                });


        if (error) {

            console.error(error);

            loginError.textContent =
                "❌ " + error.message;

            return;

        }


        loginError.textContent = "";


        mostrarAplicacion();

    }
);


// ========================================
// CERRAR SESIÓN
// ========================================

btnCerrarSesion.addEventListener(
    "click",
    async function() {

        await supabaseClient
            .auth
            .signOut();

        mostrarLogin();

    }
);


// ========================================
// REGISTRAR VENTA
// ========================================

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


// ========================================
// CARGAR VENTAS
// ========================================

let ventas = [];


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


    ventas =
        data || [];


    mostrarVentas();

}


// ========================================
// MOSTRAR VENTAS
// ========================================

function mostrarVentas() {

    const tabla =
        document
            .getElementById("tablaVentas");


    const busqueda =
        document
            .getElementById("buscar")
            .value
            .toLowerCase();


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
// ELIMINAR
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


    document
        .getElementById("totalVentas")
        .textContent =
        ventas.length;


    const total =
        ventas.reduce(
            (suma, venta) =>
                suma +
                Number(venta.monto || 0),
            0
        );


    document
        .getElementById("totalDinero")
        .textContent =
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


    document
        .getElementById("totalLima")
        .textContent =
        lima;


    document
        .getElementById("totalProvincia")
        .textContent =
        provincia;

}


// ========================================
// BUSCADOR
// ========================================

document
    .getElementById("buscar")
    .addEventListener(
        "input",
        mostrarVentas
    );

document
    .getElementById("btnCerrarSesion")
    .addEventListener(
        "click",
        async function() {

            await supabaseClient
                .auth
                .signOut();

            window.location.href =
                "login.html";

        }
    );

// ========================================
// INICIAR
// ========================================

comprobarSesion();
