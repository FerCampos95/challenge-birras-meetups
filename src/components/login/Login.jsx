
import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { auth, googleAuthProvider, app } from '../../database/firebase'
import { registrarUsuario } from '../../database/users';
import Loader from '../Loader';
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
		width: '100%',
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	btnGoogle: {
		margin: theme.spacing(5, 0, 2),
	},
}));

const Login = () => {
	const classes = useStyles();

	const [cargando, setCargando] = useState(true);
	const [textoCarga, setTextoCarga] = useState("Cargando");
	const [email, setEmail] = useState("");
	const [pass, setPass] = useState("");
	const [mostrarPass, setmostrarPass] = useState(false);
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {

		auth.getRedirectResult()
			.then(async (result) => {

				setTextoCarga("Iniciando Sesión");
				// if (result.credential) {
				// 	// This gives you a Google Access Token. You can use it to access the Google API.
				// 	let token = result.credential.accessToken;
				// 	//localStorage.setItem("token", token);
				// }

				let user = result.user;

				if (user) {
					localStorage.setItem("sesion", user.uid);

					console.log('user', user);
					console.log('result', result);
					console.log('nuevo usuario?', result.additionalUserInfo.isNewUser);

					let usuario = {
						"nombre": user.displayName,
						"email": user.email,
						"foto": user.photoURL,
						"admin": false
					}

					if (result.additionalUserInfo.isNewUser) {
						await registrarUsuario(usuario);//guarda los datos en la collection usuarios
					}

					redirigirA('/home');

				} else {

					//reviso si ya habia una sesion previa iniciada
					auth.onAuthStateChanged(user => {
						console.log(user);
						let sesion = localStorage.getItem("sesion");
						if (user && user.uid == sesion) {
							redirigirA('/home');
						}
					})

					setCargando(false);
				}

			})
			.catch(err => {
				enqueueSnackbar("Error iniciando sesión.", { "variant": "error" });
				setCargando(false);
				console.log(err);
			})
	}, [])

	const handleClickShowPassword = () => {
		setmostrarPass(!mostrarPass)
	}

	const socialLogin = async (provider) => {
		await app
			.auth()
			.signInWithRedirect(provider)
			.then(result => {
				console.log(result);
				setCargando(true);
			})
			.catch(error => {
				console.log(error.message)
			});
	}

	const submit = async (e) => {
		e.preventDefault();

		if (!pass || !email) {
			console.log("Faltan datos");
			enqueueSnackbar("Ingrese Usuario y Contraseña.", { "variant": "error" });
			return;
		}

		setCargando(true);

		auth.signInWithEmailAndPassword(email, pass)
			.then((res) => {
				console.log("Sesion iniciada", res.user);
				localStorage.setItem("sesion", res.user.uid);

				redirigirA('/home');
			})
			.catch((err) => {
				console.log(err)
				switch (err.code) {
					case "auth/wrong-password":
						enqueueSnackbar("Usuario o contraseña erroneo.", { "variant": "error" });
						break;

					default:
						enqueueSnackbar(err.message, { "variant": "error" });
						break;
				}
				setCargando(false);
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
					<Typography component="h1" variant="h5">
						Iniciar Sesión
        			</Typography>
					<form className={classes.form} noValidate>
						<TextField
							variant="outlined"
							required
							margin="normal"
							autoFocus
							fullWidth
							id="email"
							label="Correo Electronico"
							name="email"
							autoComplete="email"
							onChange={(e) => setEmail(e.target.value)}
						/>

						<FormControl variant="outlined" fullWidth>
							<InputLabel htmlFor="pass">Contraseña *</InputLabel>
							<OutlinedInput
								id="pass"
								type={mostrarPass ? 'text' : 'password'}
								value={pass}
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

						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={submit}
						>
							Iniciar Sesión
          				</Button>
						<Grid container justify="center">
							<Grid item >
								<Link to="/singup" variant="body2">
									{"No tiene cuenta? Registrese."}
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>


				<Grid container justify="center" direction="column">

					<Button
						variant="contained"
						// color="primary"
						onClick={() => socialLogin(googleAuthProvider)}
						className={classes.btnGoogle}
					>
						<img
							alt="google-icon"
							src="/images/google-icon.svg"
							width={40}
							height={40}
							style={{ marginRight: 20 }}
						></img>
						Continuar con Google
        			</Button>

				</Grid>

			</Container>
	);
}

export default withRouter(Login)