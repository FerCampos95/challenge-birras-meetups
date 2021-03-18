import React from 'react';
import { useSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { eliminarMeet } from '../../database/meetups'
import { notificarInvitados } from '../../database/notifications.js';

export default function AlertDialog({ meetup }) {
    const { enqueueSnackbar } = useSnackbar();

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const eliminar = async () => {
        let meet = JSON.parse(JSON.stringify(meetup));//copio la meet antes de borrarla

        if (await eliminarMeet(meetup)) {

            enqueueSnackbar("Reunión eliminada correctamente.", { "variant": "success" });
            if (await notificarInvitados(meet,"eliminada")) {
                enqueueSnackbar("Usuarios notificados.", { "variant": "success" });
            } else {
                enqueueSnackbar("Hubo un error eliminando la reunión.", { "variant": "error" });
            }

        } else {
            enqueueSnackbar("Los usuarios no fueron notificados.", { "variant": "error" });
        }

    }
    return (
        <div>
            <MenuItem
                onClick={handleClickOpen}
            >
                <IconButton
                    aria-label="show 11 new notifications"
                    color="inherit"
                >
                    <DeleteIcon />
                </IconButton>
                <p>Eliminar</p>
            </MenuItem>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    ¿Está seguro que desea eliminar esta Reunión?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Esta opción no se podra deshacer.
                        Todos los usuarios invitados serán notificados.
                        ¿Continuar de todos modos?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={eliminar} color="primary" variant="contained" autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}