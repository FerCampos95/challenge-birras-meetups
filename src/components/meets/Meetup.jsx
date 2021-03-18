import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Invitados from '../modal-invitados/Invitados.jsx'
import { calculadoraDeBirras, calcularMeetIniciada } from '../../utils/utilitarias';
import { actualizarMeet } from '../../database/meetups';
import { notificarAsistenciaMeet } from '../../database/notifications';
import MenuMeetAdmin from './MenuMeetAdmin.jsx';


const useStyles = makeStyles((theme) => ({
    root: {
        //backgroundColor:"#FF00FF"
        //minWidth: 275,
    },
    title: {
        fontSize: 14,
    },
    telefono: {
        [theme.breakpoints.up('sm')]: {
            display: "none"
        },
    },
    pc: {
        [theme.breakpoints.down('sm')]: {
            display: "none"
        },
    }
}));


export default function Meetup({ meet, clima, usuario, usuarios }) {
    const classes = useStyles();

    const [pronostico, setPronostico] = useState();
    const [asistencia, setAsistencia] = useState(false); //PARA EL BOTON DE UNIRME
    const [birras, setBirras] = useState();
    const [presenciada, setPresenciada] = useState(false); //PARA EL BOTON DE UNIRME
    const [meetIniciada, setMeetIniciada] = useState(false); //PARA EL BOTON DE UNIRME

    useEffect(() => {
        let dia = meet.fecha.getDate();

        clima.forEach(elem => {
            if (elem.dia == dia) {
                setPronostico({
                    min: elem.temp.min,
                    max: elem.temp.max,
                    ambiente: elem.weather[0].description, //nublado, soleado, etc
                })

                setBirras(calculadoraDeBirras(elem.temp.max, meet.invitados.length))
            }
        })

    }, [clima, meet])

    useEffect(() => {
        console.log(meet);

        meet.invitados.forEach(invitado => {
            if (usuario && invitado.email == usuario.email) {
                setAsistencia(true)
            }
        })

        meet.participantes.forEach(participante => {
            if (usuario && participante.email == usuario.email) {
                setPresenciada(true)
            }
        })

        let iniciada = calcularMeetIniciada(meet);

        setMeetIniciada(iniciada);

    }, [meet, usuario])



    const cambiarAsistencia = async () => {

        if (!asistencia) {
            meet.invitados.push(usuario);
        } else {
            meet.invitados.forEach((invitado, index) => {
                if (invitado.email == usuario.email) {
                    meet.invitados.splice(index, 1);
                }
            })
        }

        await actualizarMeet(meet);
        await notificarAsistenciaMeet(meet, usuario, !asistencia);
        setAsistencia(!asistencia)
    }

    const cambiarPresentismo = async () => {
        if (!presenciada) {
            meet.participantes.push(usuario);
        } else {
            meet.participantes.forEach((participante, index) => {
                if (participante.email == usuario.email) {
                    meet.participantes.splice(index, 1);
                }
            })
        }

        await actualizarMeet(meet);
        //await notificarAsistenciaMeet(meet, usuario, !asistencia);
        setPresenciada(!presenciada)
    }

    return (
        <Card className={classes.root}>
            <Grid container justify="space-between" alignItems="center" direction="row">
                <Grid item xs={12} sm={8}>
                    <CardContent>
                        <Grid item container direction="row" justify="space-between">
                            <Grid>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Fecha: {meet.fechaString}
                                </Typography>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Horario: {meet.horaInicio} a {meet.horaFin} hs.
                            </Typography>
                            </Grid>
                            {
                                usuario && usuario.admin == true ?
                                    <Grid className={classes.telefono}>
                                        <MenuMeetAdmin
                                            nombreBoton="Editar"
                                            usuario={usuario}
                                            usuarios={usuarios}
                                            meetup={meet}
                                        />
                                    </Grid>
                                    :
                                    <></>
                            }

                        </Grid>

                        <Typography variant="h5" component="h2">
                            {meet.titulo}
                        </Typography>

                        {
                            meet.descripcion ?
                                <Typography variant="body2" component="p">
                                    {meet.descripcion}
                                </Typography>
                                :
                                <></>
                        }

                        {
                            pronostico ?
                                <>
                                    <Typography variant="body2" component="p">
                                        Temperatura: Min: {pronostico.min}ºC - Max: {pronostico.max}ºC
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        Ambiente: {pronostico.ambiente}
                                    </Typography>
                                </>
                                :
                                <></>
                        }
                    </CardContent>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Grid container direction="row" justify="center">
                        <Grid item container xs={6} sm={12} justify="center">
                            <CardActions>
                                <Button
                                    size="medium"
                                    variant="contained"
                                    color="primary"
                                    onClick={meetIniciada ? cambiarPresentismo : cambiarAsistencia}
                                >
                                    {
                                        meetIniciada ?
                                            presenciada == true ?
                                                "No Presenciada"
                                                :
                                                "Presenciada"
                                            :
                                            asistencia == true ?
                                                "Quitarme" :
                                                "Unirme"
                                    }
                                </Button>

                                {
                                    usuario && usuario.admin == true ?
                                        <Grid className={classes.pc}>
                                            <MenuMeetAdmin
                                                nombreBoton="Editar"
                                                usuario={usuario}
                                                usuarios={usuarios}
                                                meetup={meet}
                                            />
                                        </Grid>
                                        :
                                        <></>
                                }

                            </CardActions>
                        </Grid>

                        <Grid item container xs={6} sm={12} direction="row" justify="center">
                            <Invitados
                                tituloBtn={meetIniciada ? "Presentes" : "Invitados"}
                                titulo={meet.titulo}
                                personas={meetIniciada ? meet.participantes : meet.invitados}
                            />
                        </Grid>

                        {
                            birras && usuario && usuario.admin ?
                                <Grid item container xs={6} sm={12} direction="row" justify="center">
                                    <Typography variant="body2" component="p">
                                        Birras: {birras.unidades} u. - {birras.cajas} {birras.cajas == 1 ? "Caja" : "Cajas"}
                                    </Typography>
                                </Grid>
                                :
                                <></>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
}