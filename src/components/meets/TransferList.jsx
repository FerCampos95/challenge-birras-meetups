import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
    },
    cardHeader: {
        padding: theme.spacing(1, 2),
    },
    list: {
        width: 300,
        height: 230,
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
        [theme.breakpoints.up('sm')]: {
            width: 200,
        },
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
    checkbox: {
        padding: theme.spacing(0),
    },
    textoLista: {
        padding: theme.spacing(0),
        margin: theme.spacing(0),
    }
}));

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

export default function TransferList({ usuarios, meet, setMeet }) {
    //console.log('usuarios', usuarios)
    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState(usuarios);
    const [right, setRight] = React.useState([]);

    useEffect(() => {
        // console.log('meet.invitados', meet.invitados)
        // console.log('usuarios', usuarios)

        if (meet.invitados.length > 0) {
            //let noInvitados = usuarios.slice();//voy a dejar a los no invitados
            let noInvitados = [...usuarios];//voy a dejar a los no invitados
            meet.invitados.forEach((invitado) => {

                noInvitados.forEach((usuario, index) => {
                    if (usuario.email === invitado.email) {
                        noInvitados.splice(index, 1);
                    }
                })
            })

            console.log('noInvitados', noInvitados)
            setRight(meet.invitados);
            setLeft(noInvitados);
        }
    }, [meet.invitados,usuarios])

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    useEffect(() => {
        //colocado por fer
        setMeet({
            ...meet,
            "invitados": right
        });
    }, [right])

    const customList = (title, items) => (
        <Card>
            <CardHeader
                className={classes.cardHeader}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                        disabled={items.length === 0}
                        inputProps={{ 'aria-label': 'all items selected' }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List className={classes.list} dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value}-label`;

                    return (
                        <>
                            <ListItem key={value.id} role="listitem" button onClick={handleToggle(value)} >
                                <ListItemIcon>
                                    <Checkbox
                                        checked={checked.indexOf(value) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                        className={classes.checkbox}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={`${value.email}`} className={classes.textoLista} />
                            </ListItem>
                            <Divider />
                        </>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );

    return (
        <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
            <Grid item>{customList('A invitar', left)}</Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        variant="outlined"
                        size="medium"
                        className={classes.button}
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                        color="primary"
                    >
                        Agregar &gt;
                    </Button>
                    <Button
                        variant="outlined"
                        size="medium"
                        className={classes.button}
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                        color="primary"
                    >
                        &lt; Quitar
                    </Button>
                </Grid>
            </Grid>
            <Grid item>{customList('Invitados', right)}</Grid>
        </Grid>
    );
}