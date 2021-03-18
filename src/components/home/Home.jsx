import React, { useEffect, useState } from 'react';
import { Grid } from "@material-ui/core";
import { useSnackbar } from 'notistack';

import AppBar from '../navigation/AppBar'
import Loader from '../Loader';
import Lista from '../meets/ListMeets';
import NuevaMeetupModal from '../meets/MeetModal';

import { auth, db } from '../../database/firebase';
import { actualizarUsuario } from '../../database/users';
import { separarMeetups, redirigirA } from '../../utils/utilitarias';
import { consultarClimaSemanal, consultarClimaSemanalMock } from '../../utils/clima';


const Home = () => {
    const [cargando, setCargando] = useState(true);
    const [cargandoMeetups, setCargandoMeetups] = useState(true);
    const [textoCarga, setTextoCarga] = useState("Cargando, Por favor espere.");
    const [usuarios, setUsuarios] = useState();
    const [usuario, setUsuario] = useState();
    const [admin, setAdmin] = useState();
    const { enqueueSnackbar } = useSnackbar();
    const [climaSemanal, setClimaSemanal] = useState([]);
    const [meetups, setMeetups] = useState({
        hoy: [],
        proximas: [],
        historico: [],
        semana: [],
    });


    const [autenticado, setAutenticado] = useState()

    useEffect(() => {
        auth.onAuthStateChanged(user => { //chequeo q tenga la sesion iniciada
            if (user) {
                setAutenticado(true);
                //setCargando(false);
            } else {
                setAutenticado(false);
                setTextoCarga("Redirigiendo a Login");
                redirigirA('/login');
            }
            setCargando(false)
        })

    }, [])

    useEffect(() => {
        if (usuarios) {
            usuarios.forEach(async (esteUsuario) => { //lo busco entre los usuarios
                if (auth.currentUser && auth.currentUser.email === esteUsuario.email) {
                    if (usuarios.length === 1) { //si solo hay 1 usuario lo transformo en admin
                        esteUsuario.admin = true;
                        esteUsuario.foto = "/images/admin.png"
                        await actualizarUsuario(esteUsuario);
                    }

                    setAdmin(esteUsuario.admin);
                    setUsuario(esteUsuario);
                }

            })
        } 
    }, [autenticado, usuarios])


    useEffect(() => {
        const traerClima = async () => {
            //const res = await consultarClimaSemanalMock();
            const res = await consultarClimaSemanal();
            setClimaSemanal(res);
        }
        traerClima();
    }, [])

    //cargando los usuarios
    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                const unsubscribe = db
                    .collection("usuarios")
                    .onSnapshot((querySnapshot) => {

                        const data = querySnapshot.docs.map(doc => ({
                            ...doc.data(),
                            id: doc.id,
                        }))

                        setUsuarios(data);
                    })

                return unsubscribe;

            } catch (error) {
                console.log('error', error);
            }
        }
        cargarUsuarios();
    }, [])

    //cargando las meetups
    useEffect(() => {
        const cargarMeetups = () => {
            try {
                let meets;

                const unsubscribe = db.collection("meetups").orderBy('fecha').onSnapshot((querySnapshot) => {
                    meets = [];

                    let datos;
                    querySnapshot.forEach(doc => {
                        datos = doc.data();
                        datos.id = doc.id;

                        datos.fecha = new Date(datos.fecha.seconds * 1000);//recupero la fecha
                        let dia = datos.fecha.getDate().toString().padStart(2, 0);//completo con 0 adelante
                        let mes = Number((datos.fecha.getMonth() + 1)).toString().padStart(2, 0);
                        let anio = datos.fecha.getFullYear();
                        datos.fechaString = dia + "/" + mes + "/" + anio; //armo el stringfecha

                        meets.push(datos);
                    })

                    let meetupsSeparadas = separarMeetups(meets);
                    setMeetups(meetupsSeparadas);
                    setCargandoMeetups(false);
                })

                return unsubscribe;

            } catch (error) {
                console.log('error', error);
            }
        }

        cargarMeetups();
    }, [])

    return (
        cargando || !autenticado ?
            <Loader texto={textoCarga}></Loader>
            :
            <React.Fragment>
                <AppBar
                    usuario={usuario}
                />

                <Grid container spacing={2}>

                    {
                        admin === true ?
                            <Grid item container xs={12} sm={12} justify="flex-end" alignItems="center" style={{ marginTop: "10px" }} >
                                <NuevaMeetupModal
                                    nombreBoton="Nueva Meet"
                                    usuario={usuario}
                                    usuarios={usuarios}
                                />
                            </Grid>
                            :
                            <></>
                    }

                    <Grid item xs={12} sm={12}>
                        <Lista
                            cargando={cargandoMeetups}
                            usuario={usuario}
                            usuarios={usuarios}
                            titulo="Hoy"
                            meetups={meetups.hoy}
                            clima={climaSemanal}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <Lista
                            cargando={cargandoMeetups}
                            usuario={usuario}
                            usuarios={usuarios}
                            titulo="Dentro de 7 Días"
                            meetups={meetups.semana}
                            clima={climaSemanal}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <Lista
                            cargando={cargandoMeetups}
                            usuario={usuario}
                            usuarios={usuarios}
                            titulo="Próximas"
                            meetups={meetups.proximas}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <Lista
                            cargando={cargandoMeetups}
                            usuario={usuario}
                            usuarios={usuarios}
                            titulo="Historial Meetups"
                            meetups={meetups.historico}
                        />
                    </Grid>

                </Grid>
            </React.Fragment>
    )
}

export default Home;