import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import Loader from '../Loader'
import { auth } from '../../database/firebase'
import { registrarUsuario } from '../../database/users';
import { redirigirA } from '../../utils/utilitarias';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function SignUp() {
	const classes = useStyles();

	const [email, setEmail] = useState("");
	const [pass, setPass] = useState("");
	const [mostrarPass, setmostrarPass] = useState(false);
	const [nombre, setNombre] = useState("");
	const [apellido, setApellido] = useState("");

	const [cargando, setCargando] = useState(false);
	const textoCarga ="Registrando Usuario";

	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		//reviso si ya habia cuenta iniciada
		auth.onAuthStateChanged(user => {
			let sesion= localStorage.getItem("sesion");
			if (user && user.uid == sesion) {
				redirigirA('/home');
			}
		})
	}, [])

	const handleClickShowPassword = () => {
		setmostrarPass(!mostrarPass)
	}

	const submit = async (e) => {
		e.preventDefault();

		if (!nombre || !pass || !email || !apellido) {
			enqueueSnackbar("Todos los campos son obligatorios.", { "variant": "error" });
			return;
		}

		setCargando(true);

		auth.createUserWithEmailAndPassword(email, pass)
			.then(async (res) => {
				let usuario = {
					"nombre": nombre + " " + apellido,
					email,
					"foto": "https://www.minervastrategies.com/wp-content/uploads/2016/03/default-avatar.jpg",
					"admin": false
				}

				let resp = await registrarUsuario(usuario);//guarda los datos en la collection usuarios
				localStorage.setItem("sesion",res.user.uid);
				if (resp) {
					enqueueSnackbar("Usuario Registrado correctamente", { "variant": "success" });
					redirigirA('/home');
				} else {
					enqueueSnackbar("Error registrando usuario", { "variant": "error" });
				}
			})
			.catch((err) => {
				switch (err.code) {
					case "auth/email-already-in-use":
						enqueueSnackbar("El correo ya está en uso.", { "variant": "error" });
						break;
					case "auth/weak-password":
						enqueueSnackbar("La contraseña debe tener 6 o mas caracteres.", { "variant": "error" });
						break;
					case "auth/invalid-email":
						enqueueSnackbar("Formato de email inválido.", { "variant": "error" });
						break;
					default:
						enqueueSnackbar("Error registrando el usuario, " + err.message, { "variant": "error" });
						break;
				}
				setCargando(false);
				console.log(err)
			})

	}

	return (
		cargando ?
			<Loader texto={textoCarga}></Loader>
			:
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>

					<form className={classes.form} noValidate>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									autoComplete="nombre"
									name="nombre"
									variant="outlined"
									defaultValue={nombre}
									required
									fullWidth
									id="nombre"
									label="Nombre"
									autoFocus
									onChange={(e) => setNombre(e.target.value)}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									variant="outlined"
									defaultValue={apellido}
									required
									fullWidth
									id="apellido"
									label="Apellido"
									name="apellido"
									autoComplete="apellido"
									onChange={(e) => setApellido(e.target.value)}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="email"
									label="Correo Electronico"
									name="email"
									autoComplete="email"
									onChange={(e) => setEmail(e.target.value)}
								/>
							</Grid>
							<Grid item xs={12}>
								<FormControl variant="outlined" fullWidth>
									<InputLabel htmlFor="pass">Contraseña *</InputLabel>
									<OutlinedInput
										id="pass"
										type={mostrarPass ? 'text' : 'password'}
										value={pass}
										defaultValue={pass}
										onChange={(e) => setPass(e.target.value)}
										fullWidth
										variant="outlined"
										endAdornment={
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													onClick={handleClickShowPassword}
													// onMouseDown={handleMouseDownPassword}
													edge="end"
												>
													{mostrarPass ? <Visibility /> : <VisibilityOff />}
												</IconButton>
											</InputAdornment>
										}
										labelWidth={100}
									/>
								</FormControl>
							</Grid>

						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={submit}
						>
							Registrarse
          				</Button>
						<Grid container justify="center">
							<Grid item>
								<Link to="/login" variant="body2">
									Ya tienes una cuenta? Inicia Sesión
              					</Link>
							</Grid>
						</Grid>
					</form>
				</div>

				{/* <Grid container justify="center" direction="column">

        <Typography component="h1" variant="h5" align="center">
          Registrarse con:
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => socialLogin(googleAuthProvider)}
        >
          Google
        </Button>

        {/* <Button
          variant="contained"
          color="primary"
          onClick={() => socialLogin(facebookAuthProvider)}
        >
          Facebook
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => socialLogin(githubAuthProvider)}
        >
          GitHubs
        </Button> 
      </Grid>
      */}


			</Container>
	);
}