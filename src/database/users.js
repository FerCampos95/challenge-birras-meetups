import { db } from './firebase'

export const registrarUsuario = async (usuario) => {
    try {
        await db.collection("usuarios").add(usuario)
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const actualizarUsuario = async (usuario) => {
    try {
        await db.collection('usuarios').doc(usuario.id).update(usuario);
        return true
    } catch (error) {
        console.log(error);
        return false;
    }
}