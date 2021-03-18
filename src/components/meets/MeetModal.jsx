import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import MenuItem from '@material-ui/core/MenuItem';

import TransferList from './TransferList';

import { insertarMeet, actualizarMeet } from '../../database/meetups'
import { notificarInvitados } from '../../database/notifications'
import { horasCorrectas, fechaAceptada } from '../../utils/utilitarias'

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "center"
    },
    form: {
        paddingRight: theme.spacing(3),
    },
    marginBottom: {
        marginBottom: theme.spacing(2),
    },
    fecha: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(2),
        width: 150,
    },
    hora: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 100,
    },
}))

export default function MeetModal({ nombreBoton, usuario, usuarios, meetup }) {
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    const [meet, setMeet] = useState({
        titulo: "",
        descripcion: "",
        fecha: "",
        horaInicio: "09:00",
        horaFin: "18:00",
        invitados: [],
        participantes: [],
    })

    useEffect(() => {
        if (meetup) {
            let { fechaString } = meetup;
            let fecha = fechaString.split("/");
            fechaString = fecha[2] + "-" + fecha[1] + "-" + fecha[0]; //para el textfield de fecha

            setMeet({
                titulo: meetup.titulo,
                descripcion: meetup.descripcion,
                horaInicio: meetup.horaInicio,
                horaFin: meetup.horaFin,
                invitados: meetup.invitados,
                participantes: meetup.participantes,

                fecha: fechaString
            })

            console.log('meetup', meetup)
        }
    }, [meetup])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = async () => {
        setOpen(false);
    };

    const guardarMeet = async () => {

        if (!meet.titulo || !meet.fecha) {
            enqueueSnackbar("Rellene los campos son obligatorios.", { "variant": "error" });
            return
        }

        if (!meet.horaInicio || !meet.horaFin) {
            enqueueSnackbar("Debe rellenar las horas.", { "variant": "error" });
            return
        }

        if (!horasCorrectas(meet.horaInicio, meet.horaFin)) {
            enqueueSnackbar("La reunión no puede finalizar antes de comenzar.", { "variant": "error" });
            return
        }

        meet.admin = usuario.email;

        if (meetup) {//quiere decir que es edicion
            //vuelvo a acomodar la fecha si no la edito
            if (typeof (meet.fecha) == "string") { //si la cambio es object (date)
                let arrayFecha = meet.fecha.split('-')
                let fecha = new Date(arrayFecha[0], arrayFecha[1], arrayFecha[2])

                if (!fechaAceptada(fecha)) {
                    enqueueSnackbar("La reunión no puede tener una fecha anterior a hoy.", { "variant": "error" });
                    return
                }

                meet.fecha = fecha;
            }

            await notificarInvitados(meet, "editada");
            let res = await actualizarMeet(meet);
            if (res) {
                enqueueSnackbar("Meet actualizada con éxito.", { "variant": "success" });
                setOpen(false);
            } else {
                enqueueSnackbar("Error editando la Meet.", { "variant": "error" });
            }

        } else { //es nueva meet
            if (!fechaAceptada(meet.fecha)) {
                enqueueSnackbar("La reunión no puede tener una fecha anterior a hoy.", { "variant": "error" });
                return;
            }

            await notificarInvitados(meet, "creada");
            let res = await insertarMeet(meet);
            //console.log("Alert:" + res);
            if (res) {
                enqueueSnackbar("Meet creada con éxito.", { "variant": "success" });
                setOpen(false);

                setMeet({ //para limpiar el form
                    titulo: "",
                    descripcion: "",
                    fecha: "",
                    horaInicio: "09:00",
                    horaFin: "18:00",
                    invitados: [],
                    participantes: [],
                })
            } else {
                enqueueSnackbar("Error guardando la Meet.", { "variant": "error" });
            }

        }
    };

    const handleChange = (e) => {
        if (e.target.name == "fecha") {
            let arrayFecha = e.target.value.split("-");

            let fecha = new Date(arrayFecha[0], arrayFecha[1] - 1, arrayFecha[2])

            setMeet({
                ...meet,
                [e.target.name]: fecha
            });
        } else {
            setMeet({
                ...meet,
                [e.target.name]: e.target.value
            });
        }
    }

    return (
        <React.Fragment>
            {
                meetup ?
                    <MenuItem
                        onClick={handleClickOpen}
                    >
                        <IconButton
                            aria-label="editar"
                            color="inherit"
                        >
                            <EditIcon />
                        </IconButton>
                        <p>{nombreBoton ? nombreBoton : "sin nombre"}</p>
                    </MenuItem>
                    :
                    <Button onClick={handleClickOpen} color="primary" variant="contained">
                        {nombreBoton}
                    </Button>
            }

            <div className={classes.root}>
                <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} scroll={"body"}>
                    <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                        {meetup ? "Editar Meet" : "Nueva Meet"}
                    </DialogTitle>

                    <DialogContent dividers>
                        <Grid container direction="column" justify="center" alignItems="center" className={classes.form}>
                            <TextField
                                label="Nombre de la Meet."
                                id="titulo-meet"
                                defaultValue={meet.titulo}
                                variant="outlined"
                                size="small"
                                onChange={(e) => handleChange(e)}
                                name="titulo"
                                className={classes.marginBottom}
                                fullWidth
                            />

                            <TextField
                                label="Descripción."
                                id="desc-meet"
                                defaultValue={meet.descripcion}
                                variant="outlined"
                                size="small"
                                multiline
                                rows={2}
                                onChange={(e) => handleChange(e)}
                                name="descripcion"
                                className={classes.marginBottom}
                                fullWidth
                            />

                            <Grid item container justify="center">
                                <Grid item>
                                    <TextField
                                        id="fecha"
                                        label="Fecha"
                                        name="fecha"
                                        type="date"
                                        defaultValue={meet.fecha}
                                        className={classes.fecha}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={(e) => { handleChange(e) }}
                                    />
                                </Grid>

                                <TextField
                                    id="hora-inicio"
                                    label="Hora Inicio"
                                    name="horaInicio"
                                    type="time"
                                    defaultValue={meet.horaInicio}
                                    className={classes.hora}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        step: 300, // 5 min
                                    }}
                                    onChange={(e) => { handleChange(e) }}
                                />
                                <TextField
                                    id="hora-fin"
                                    label="Hora Fin"
                                    name="horaFin"
                                    type="time"
                                    defaultValue={meet.horaFin}
                                    className={classes.hora}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        step: 300,
                                    }}
                                    onChange={(e) => { handleChange(e) }}
                                />
                            </Grid>

                            <TransferList
                                usuarios={usuarios}
                                meet={meetup ? meetup : meet}
                                setMeet={setMeet}
                            />

                        </Grid>
                    </DialogContent>

                    <DialogActions>
                        <Button autoFocus onClick={guardarMeet} color="primary" variant="contained" fullWidth>
                            {meetup ? "Guardar Cambios" : "Crear Meet"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </React.Fragment>
    );
}