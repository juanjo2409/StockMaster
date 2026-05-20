import Swal from "sweetalert2"


// ALERTA GUARDAR
export function alertaExitosa(mensaje) {

    Swal.fire({

        icon: "success",

        title: "Guardado correctamente",

        text: mensaje,

        toast: true,

        position: "top-end",

        showConfirmButton: false,

        timer: 2500,

        timerProgressBar: true,

        background: "#ffffff",

        color: "#0f172a",

        iconColor: "#4f46e5"

    })
}


// ALERTA ELIMINAR
export function alertaEliminar() {

    Swal.fire({

        icon: "success",

        title: "Eliminado correctamente",

        text: "El producto fue eliminado del inventario",

        toast: true,

        position: "top-end",

        showConfirmButton: false,

        timer: 2500,

        timerProgressBar: true,

        background: "#ffffff",

        color: "#0f172a",

        iconColor: "#e11d48"

    })
}