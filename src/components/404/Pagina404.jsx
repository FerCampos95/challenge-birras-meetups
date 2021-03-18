import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom'


const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: `100%`,
    },
    paper: {
        backgroundColor: "white",
        margin: 0,
        height: `calc(100vh - 64px)`,
    },
    img: {
        margin: "auto",
        marginTop: theme.spacing(10),
        marginBottom: theme.spacing(5),
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
    botones: {
        marginBottom: theme.spacing(2),
    }
}))

const PageNotFound = () => {
    const classes = useStyles()

    return (
        <Paper className={classes.paper}>

            <Grid item>
                <img
                    className={classes.img}
                    alt="homero 404"
                    src="/images/error-404.png"
                />
            </Grid>
            <Grid container xs={12} sm={12} justify="center" direction="row" >
                <Grid container xs={6} sm={4} justify="space-around" direction="row">
                    <Grid item className={classes.botones}>
                        <Link
                            to='/login'
                            component={Button}
                            variant="contained"
                            color="primary"
                        >
                            Iniciar Sesión
                    </Link>
                    </Grid>
                    <Grid item className={classes.botones}>
                        <Link
                            to='/singup'
                            component={Button}
                            variant="contained"
                            color="primary"
                        >
                            Registrarse
                    </Link>
                    </Grid>
                    <Grid item className={classes.botones}>
                        <Link
                            to='/home'
                            component={Button}
                            variant="contained"
                            color="primary"
                        >
                            Ir al Inicio
                    </Link>
                    </Grid>

                </Grid>

            </Grid>
        </Paper>
    )
}

export default PageNotFound