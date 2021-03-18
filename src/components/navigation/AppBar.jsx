import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Avatar from '@material-ui/core/Avatar';

import ModalProfile from '../profile/ModalProfile'
import ListNotifications from './ListNotifications'
import { auth, db } from '../../database/firebase'
import { notificacionesVistas } from '../../database/notifications'
import { filtrarOrdenarNotis, redirigirA } from '../../utils/utilitarias';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    title: {
        display: 'block',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    sectionDesktop: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    avatar: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
}));

export default function PrimarySearchAppBar({ usuario }) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorNotis, setAnchorNotis] = React.useState(null);
    const [notificaciones, setNotificaciones] = React.useState([]);
    const [notisNuevas, setNotisNuevas] = React.useState();

    useEffect(() => {
        try {
            if (usuario) {
                const unsubscribe = db
                    .collection("notificaciones")
                    .where("email", "==", usuario.email)
                    // .orderBy("timeStamp","asc") //error en firebase
                    .onSnapshot((querySnapshot) => {

                        const data = querySnapshot.docs.map(doc => ({
                            ...doc.data(),
                            id: doc.id,
                        }))

                        let notis = filtrarOrdenarNotis(data);

                        setNotificaciones(notis.notisSemana);
                        setNotisNuevas(notis.notisNuevas);
                    })

                return unsubscribe;
            }

        } catch (error) {
            console.log('error', error);
        }
    }, [usuario])

    const isMenuOpen = Boolean(anchorEl);
    const isNotificationOpen = Boolean(anchorNotis);

    const ALTURA_NOTIS = 72;

    const abrirListaNotificaciones = async (event) => {
        setNotisNuevas(0);
        setAnchorNotis(event.currentTarget);
        await notificacionesVistas(notificaciones);
    }

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setAnchorNotis(null);
    };

    const cerrarSesion = () => {
        auth.signOut()
            .then((res) => {
                localStorage.clear();
                redirigirA("/login")
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <div className={classes.grow}>
            <AppBar position="static">
                <Toolbar>
                    <Typography className={classes.title} variant="h5" noWrap>
                        Meetups
                    </Typography>

                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <IconButton
                            // edge="end"
                            color="inherit"
                            aria-label="notification of current user"
                            aria-controls="menu-notificaciones"
                            aria-haspopup="true"
                            onClick={abrirListaNotificaciones}
                        >
                            <Badge badgeContent={notisNuevas ? notisNuevas : 0} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="primary-search-account-menu"
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <Avatar
                                alt="Foto Perfil"
                                src={usuario ? usuario.foto : ""}
                                className={classes.avatar}
                            />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                id="primary-search-account-menu"
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                <ModalProfile usuario={usuario}></ModalProfile>
                <MenuItem onClick={cerrarSesion}>Cerrar Sesión</MenuItem>
            </Menu>
            <Menu
                anchorEl={anchorNotis}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                id="menu-notificaciones"
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isNotificationOpen}
                onClose={handleMenuClose}
                PaperProps={{
                    style: {
                        maxHeight: ALTURA_NOTIS * 4.5,
                        width: '25ch',
                    },
                }}
            >
                <ListNotifications
                    notificaciones={notificaciones}
                ></ListNotifications>
            </Menu>
        </div>
    );
}
