import { db } from './firebase'

export const notificarInvitados = async (meet, accion) => {
    let mensaje;
    switch (accion) {
        case "creada":
            mensaje = `Te invitaron a la reunión: "${meet.titulo}", el día ${meet.fecha.getDate()}/${meet.fecha.getMonth() + 1} de ${meet.horaInicio} a ${meet.horaFin} hs.`
            break;
        case "editada":
            mensaje = `La reunión: "${meet.titulo}" ha sido editada.`
            break;
        case "eliminada":
            mensaje = `La reunión: "${meet.titulo}" ha sido eliminada.`
            break;
        default:
            mensaje = `La reunión: "${meet.titulo}" ha recibido un cambio.`
            break;
    }

    let notificacion = {
        email: "",
        timeStamp: new Date(),
        invitacion: mensaje,
        vista: false,
    }

    try {
        meet.invitados.forEach(async (invitado) => {
            notificacion.email = invitado.email;
            if (meet.admin != invitado.email) {//para que no le llegue al q creo q editor
                await db.collection("notificaciones").add(notificacion)
            }
        })

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

// export const notificarInvitadosEdicion = async (meet) => {

//     let notificacion = {
//         email: "",
//         timeStamp: new Date(),
//         invitacion: `La reunión: "${meet.titulo}" ha sido editada.`,
//         vista: false,
//     }

//     try {
//         meet.invitados.forEach(async (invitado) => {
//             notificacion.email = invitado.email;
//             if (meet.admin != invitado.email) {//para que no le llegue al q creo q editor
//                 await db.collection("notificaciones").add(notificacion)
//             }
//         })

//         return true;
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// }

// export const notificarInvitadosEliminacion = async (meet) => {

//     let notificacion = {
//         email: "",
//         timeStamp: new Date(),
//         invitacion: `La reunión: "${meet.titulo}" ha sido eliminada.`,
//         vista: false,
//     }

//     try {
//         meet.invitados.forEach(async (invitado) => {
//             notificacion.email = invitado.email;
//             if (meet.admin != invitado.email) {//para que no le llegue al q creo q editor
//                 await db.collection("notificaciones").add(notificacion)
//             }
//         })

//         return true;
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// }

export const notificarAsistenciaMeet = async (meet, usuario, asistencia) => {

    let notificacion = {
        email: meet.admin,
        timeStamp: new Date(),
        invitacion: `${usuario.nombre} ${asistencia ? "asistirá a la reunión" : "no asistirá a la reunión"} "${meet.titulo}"`,
        vista: false,
    }

    try {
        if (meet.admin != usuario.email) {
            await db.collection("notificaciones").add(notificacion)
        }

    } catch (error) {
        console.log(error);
    }
}

export const notificacionesVistas = async (notificaciones) => {

    try {
        notificaciones.forEach(async (noti) => {
            noti.vista = true;
            await db.collection("notificaciones").doc(noti.id).update(noti);
        })


    } catch (error) {
        console.log(error);
    }
}