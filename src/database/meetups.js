import { db } from './firebase'

export const insertarMeet = async (meet) => {
    try {
        await db.collection("meetups").add(meet)

        return true
    } catch (error) {
        console.log(error);
        return false
    }
}

export const actualizarMeet = async (meet) => {
    try {
        await db.collection("meetups").doc(meet.id).update(meet);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const eliminarMeet = async (meet) => {
    try {
        await db.collection("meetups").doc(meet.id).delete();
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}