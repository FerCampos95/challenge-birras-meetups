import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Grid, Typography } from '@material-ui/core';

import Meetup from './Meetup';
import Loader from '../Loader';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: "column",
        padding: theme.spacing(1),
    },
    paper: {
        marginBottom: theme.spacing(1),
    },
    titulo: {
        marginLeft: theme.spacing(2),
        marginBottom: theme.spacing(1),
    }
}));

export default function ListMeets({ cargando, titulo, meetups = [], clima = [], usuario, usuarios = [] }) {
    const classes = useStyles();

    return (
        <div >
            <Paper elevation={3} className={classes.root}>
                <Grid container justify="center" alignItems="center" direction="row">
                    <Grid container justify="space-around">
                        <Typography variant="h4" className={classes.titulo}>
                            {titulo}
                        </Typography>

                    </Grid>

                    {
                        cargando ?
                            <Grid item justify="center" xs={12} sm={9}>
                                <Loader texto={"Cargando Meetups"}></Loader>
                            </Grid>
                            :
                            <Grid item justify="center" xs={12} sm={9}>
                                {
                                    meetups.length > 0 ?
                                        meetups.map(meet => {
                                            return (
                                                <Paper elevation={3} className={classes.paper}>
                                                    <Meetup
                                                        key={meet.id}
                                                        meet={meet}
                                                        clima={clima}
                                                        usuario={usuario}
                                                        usuarios={usuarios}
                                                    />
                                                </Paper>
                                            )
                                        })
                                        :
                                        <Typography variant="h6" align="center">
                                            No hay meetups
                            </Typography>
                                }
                            </Grid>
                    }
                </Grid>
            </Paper>
        </div>
    );
}