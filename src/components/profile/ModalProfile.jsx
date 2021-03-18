import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import { actualizarUsuario } from '../../database/users';

const useStyles = makeStyles((theme) => ({
    avatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

export default function FormDialog({ usuario }) {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const [open, setOpen] = React.useState(false);
    // const [aceptarWhatsapp, setAceptarWhatsapp] = React.useState(false);//todavia sin uso
    const [user, setUser] = React.useState();


    useEffect(() => {
        setUser(usuario);
        console.log(usuario);
    }, [usuario])

    // const handleChangeCheckbox = (event) => {
    //     setAceptarWhatsapp(event.target.checked);
    // };

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        })
        console.log([e.target.name]+" : "+ e.target.value)
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setUser(usuario)
    };

    const guardarCambios = async() => {
        console.log(user);
        if (!user || !user.nombre || !user.nombre.trim()) {
			enqueueSnackbar("Su nombre no puede quedar vacio.", { "variant": "error" });
			return;
		}

        if(await actualizarUsuario(user)){
            enqueueSnackbar("Usuario actualizado correctamente.", { "variant": "success" });
            setOpen(false)
        }else{
			enqueueSnackbar("Error actualizando el usuario.", { "variant": "error" });
        }
    }

    return (
        <div>
            <MenuItem onClick={handleClickOpen}>Editar Perfil</MenuItem>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Editar Perfil</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="nombre"
                        name="nombre"
                        defaultValue={user ? user.nombre : "Pepe Juarez"}
                        label="Nombre de Usuario"
                        type="text"
                        fullWidth
                        onChange={handleChange}
                    />

                    <Avatar
                        alt="Foto Perfil"
                        src={user ? user.foto : "https://www.minervastrategies.com/wp-content/uploads/2016/03/default-avatar.jpg"}
                        className={classes.avatar}
                    />

                    <TextField
                        autoFocus
                        margin="dense"
                        id="foto"
                        name="foto"
                        defaultValue={user ? user.foto : ""}
                        label="URL Foto"
                        type="text"
                        fullWidth
                        onChange={handleChange}
                    />

                    {/* <TextField
                        autoFocus
                        margin="dense"
                        id="cod-area"
                        name="codArea"
                        placeholder={11}
                        label="Códidgo de Area"
                        type="number"
                        helperText="Sin el 0"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="tel"
                        name="tel"
                        placeholder={22334455}
                        label="Teléfono"
                        type="number"
                        helperText="Sin el código de área"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={aceptarWhatsapp}
                                onChange={handleChangeCheckbox}
                                name="whatsapp"
                                color="primary"
                            />
                        }
                        label="Notificaciones por Whatsapp"
                    /> */}

                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        name="email"
                        value={user ? user.email : "email@ejemplo.com"}
                        label="Email"
                        type="email"
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="filled"
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={guardarCambios} color="primary" variant="contained">
                        Guardar Cambios
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}