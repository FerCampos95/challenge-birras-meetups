import React from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

const ListNotifications = ({ notificaciones = [] }) => {
    return (
        <List dense={true}>
            {
                notificaciones.length > 0 ?
                    notificaciones.map(noti => {
                        return (
                            <>
                                <ListItem>
                                    <ListItemText
                                        primary={noti.invitacion}
                                    />
                                </ListItem>
                                <Divider />
                            </>
                        )
                    })
                    :
                    <ListItem>
                        <ListItemText
                            primary="No tienes nuevas notificaciones."
                        />
                    </ListItem>
            }
        </List>
    )
}

export default ListNotifications;