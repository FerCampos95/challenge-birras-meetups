import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
    }
}));

export default function ListPersonas({ personas }) {
    const classes = useStyles();

    return (
        <List className={classes.root}>
            { personas.length === 0 ?
                <ListItem alignItems="flex-start">
                    <ListItemText
                        primary="No hay participantes en esta Reunión"
                    />
                </ListItem>
                :
                personas.map((invitado) => {
                    return (
                        <>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt={invitado.nombre} src={invitado.foto} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={invitado.nombre}
                                    secondary={invitado.email}
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </>
                    )
                })}
        </List>
    );
}