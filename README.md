# Desafío Santander Tecnologia - Meetups-Birras

**Resumen:** _El proyecto consta de una applicación desarrollada con React para controlar las meetups y las birras necesarias para la misma, según la temperatura pronosticada._


## Tecnologias implementadas 📋

* React
* Firebase (Firestore y Authentication)

## Puntos desarrollados 📋

**Control de Birras:** Como administrador se puede saber cuantas cajas de birras son necesarias comprar para aprovisionar la meetup, segun clima e invitados.

**Clima:** Como admin y usuario se puede saber cual será la temperatura Min y Max del día de la Meet con una semana de anticipación.

**Notificaciones:** Tanto el admin como los usuarios serán notificados de invitaciones o sobre cambios en una meet invitada.

**Creación de Meets:** Como administrador se pueden generar meetups e invitar/quitar a cualquier usuario.

**Inscripciones:** Tanto el admin como los usuarios pueden inscribirse a las proximas Meets.

**Check-in:** Tanto el admin como los usuarios pueden hacer check-in a las Meets comenzadas o que ya finalizaron para indicar que fueron presenciadas por ellos.


### Configuraciones ⚙️

_Para poder ejecutar el proyeto se debe utilizar un archivo .env con las siguiente variables que se obtienen en un proyecto firebase:_

* REACT_APP_APIKEY
* REACT_APP_AUTHDOMAIN
* REACT_APP_PROJECTID
* REACT_APP_STORAGEBUCKET
* REACT_APP_MESSAGINGSENDERID
* REACT_APP_APPID
* REACT_APP_MEASUREMENTID

_Y la siguiente variable que se obtiene al crear un proyecto en openweathermap.org:_

* REACT_APP_APIKEYCLIMA

### Ejecutar el proyecto 🔩

_Para iniciar el proyecto se deben ejecutar los siguientes comandos:_


```
npm install
```
```
npm run start
```

### Demo del proyecto

https://challenge-birras-meetups.herokuapp.com/

_**Anotacion** heroku demora aproximadamente hasta 2 o 3 minutos en volver a dejar activa la aplicacion, ya que es un servidor gratuito._

**Administrador**

* Email: admin@meet.com
* Pass: administrador

## Autor ✒️

* **Fernando Campos** - fer_eze_jose@hotmail.com