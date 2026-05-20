import './styles/globals.css';
import { alertaExitosa, alertaEliminar } from './utils/alerts';

const endpoint = "http://localhost:3000/productos"

// ================================
// VARIABLES
// ================================

const formulario = document.getElementById("product-form")

const nombreProducto = document.getElementById("nombre")

const precioUnidad = document.getElementById("precio")

const stock = document.getElementById("stock")

const descripcionProducto = document.getElementById("descripcion")

const buscador = document.getElementById("buscador")

let idProductoEditando = null

let todosLosProductos = []


// ================================
// FORMULARIO
// ================================

formulario.addEventListener("submit", async (event) => {

    event.preventDefault()

    const productoNuevo = {

        nombre: nombreProducto.value.toLowerCase().trim(),

        precioUnidad: Number(precioUnidad.value),

        stock: Number(stock.value),

        descripcion: descripcionProducto.value.toLowerCase().trim()
    }

    // EDITAR
    if (idProductoEditando) {

        await actualizarProducto(idProductoEditando, productoNuevo)

        idProductoEditando = null

    } else {

        // CREAR
        await agregarProducto(productoNuevo)
    }

    formulario.reset()
})


// ================================
// BUSCADOR
// ================================

buscador.addEventListener("input", () => {

    const texto = buscador.value.toLowerCase().trim()

    const productosFiltrados = todosLosProductos.filter(producto => {

        return (
            producto.nombre.toLowerCase().includes(texto) ||
            producto.descripcion.toLowerCase().includes(texto)
        )
    })

    pintarLosDatos(productosFiltrados)
})


// ================================
// TRAER DATOS
// ================================

async function traeDatos() {

    const response = await fetch(endpoint)

    const productos = await response.json()

    todosLosProductos = productos

    pintarLosDatos(productos)

    pintarEstadisticas(productos)
}


// ================================
// AGREGAR PRODUCTO
// ================================

async function agregarProducto(producto) {

    const response = await fetch(endpoint, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify(producto)
    })

    if (response.ok) {

        traeDatos()

        alertaExitosa("Producto agregado exitosamente")
    }
}


// ================================
// ACTUALIZAR PRODUCTO
// ================================

async function actualizarProducto(id, producto) {

    const response = await fetch(`${endpoint}/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(producto)
    })

    if (response.ok) {

        traeDatos()

        alertaExitosa("Producto actualizado correctamente")
    }
}


// ================================
// PINTAR TABLA
// ================================

function pintarLosDatos(productos) {

    const lugarDeImpresion = document.getElementById("inventory-list")

    lugarDeImpresion.innerHTML = ``

    for (const producto of productos) {

        lugarDeImpresion.innerHTML += `

        <tr class="hover:bg-slate-50 transition-all">

            <td class="px-8 py-6">

                <div class="flex flex-col">

                    <span class="font-bold text-slate-900">
                        ${producto.nombre}
                    </span>

                    <span class="text-xs text-slate-400 mt-1">
                        ${producto.descripcion}
                    </span>

                </div>

            </td>

            <td class="px-8 py-6 text-center">

                <span class="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase border border-emerald-100">

                    ${producto.stock} unidades

                </span>

            </td>

            <td class="px-8 py-6 text-center font-bold text-slate-900">

                COP ${producto.precioUnidad.toLocaleString()}

            </td>

            <td class="px-8 py-6 text-right">

                <div class="flex justify-end gap-3">

                    <!-- EDITAR -->
                    <button 
                        data-id="${producto.id}" 
                        class="btn-editar flex items-center justify-center w-11 h-11 rounded-2xl bg-indigo-50 hover:bg-indigo-600 border border-indigo-100 hover:border-indigo-600 transition-all duration-300"
                    >

                        ✏️

                    </button>

                    <!-- ELIMINAR -->
                    <button 
                        data-id="${producto.id}" 
                        class="btn-eliminar flex items-center justify-center w-11 h-11 rounded-2xl bg-rose-50 hover:bg-rose-500 border border-rose-100 hover:border-rose-500 transition-all duration-300"
                    >

                        🗑️

                    </button>

                </div>

            </td>

        </tr>
        `
    }
}


// ================================
// ELIMINAR
// ================================

document.addEventListener("click", async (event) => {

    const botonEliminar = event.target.closest(".btn-eliminar")

    if (!botonEliminar) return

    const id = botonEliminar.dataset.id

    const confirmar = confirm("¿Deseas eliminar este producto?")

    if (!confirmar) return

    const response = await fetch(`${endpoint}/${id}`, {

        method: "DELETE"
    })

    if (response.ok) {

        alertaEliminar()

        traeDatos()
    }
})


// ================================
// EDITAR
// ================================

document.addEventListener("click", async (event) => {

    const botonEditar = event.target.closest(".btn-editar")

    if (!botonEditar) return

    const id = botonEditar.dataset.id

    const response = await fetch(`${endpoint}/${id}`)

    const producto = await response.json()

    nombreProducto.value = producto.nombre

    precioUnidad.value = producto.precioUnidad

    stock.value = producto.stock

    descripcionProducto.value = producto.descripcion

    idProductoEditando = id
})


// ================================
// ESTADISTICAS
// ================================

function pintarEstadisticas(productos) {

    // TOTAL UNIDADES
    const totalProductos = productos.reduce((acumulador, producto) => {

        return acumulador + producto.stock

    }, 0)

    // VALOR INVENTARIO
    const valorInventario = productos.reduce((acumulador, producto) => {

        return acumulador + (producto.precioUnidad * producto.stock)

    }, 0)

    // STOCK CRITICO
    const stockCritico = productos.filter(producto => producto.stock < 10).length

    document.getElementById("stat-total").textContent = totalProductos

    document.getElementById("stat-value").textContent =
        `COP ${valorInventario.toLocaleString()}`

    document.getElementById("stat-low").textContent = stockCritico
}


// ================================
// INICIAR APP
// ================================

traeDatos()