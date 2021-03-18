import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Grid, Typography } from '@material-ui/core';

export default function CircularIndeterminate({texto}) {

    return (
        <Grid container justify="center" alignItems="center" direction="column">
            <Typography>
                {texto}
            </Typography>
            <CircularProgress />
        </Grid>
    );
}