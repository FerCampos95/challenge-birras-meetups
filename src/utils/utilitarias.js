
export const separarMeetups = (meets) => {
    let hoy = new Date();
    hoy.setHours(0, 0, 0, 0);//quito las horas solo para comparar fechas
    let fecha7dias = new Date();
    fecha7dias.setHours(0, 0, 0, 0);
    fecha7dias.setDate(hoy.getDate() + 7)//fecha de hoy mas 7 dias
    let topeHistorico = new Date();
    topeHistorico.setHours(0, 0, 0, 0);
    topeHistorico.setDate(hoy.getDate() - 30)//30 dias antes de hoy


    let meetupsHoy = [];
    let meetupsSemana = [];
    let meetupsHistorico = [];
    let meetupsProximas = [];

    meets.forEach(meet => {
        if (meet.fecha.getTime() === hoy.getTime()) {
            meetupsHoy.push(meet);
        } else if (meet.fecha.getTime() < hoy.getTime()) {
            if (meet.fecha.getTime() > topeHistorico.getTime()) { //si la fecha es hace mas de 30 dias no la muestro
                meetupsHistorico.push(meet);
            }
        } else if (meet.fecha.getTime() > hoy.getTime()) {
            if (meet.fecha.getTime() < fecha7dias.getTime()) {
                meetupsSemana.push(meet);
            } else {
                meetupsProximas.push(meet);
            }
        }
    });

    return {
        proximas: meetupsProximas,
        historico: meetupsHistorico,
        hoy: meetupsHoy,
        semana: meetupsSemana
    }
}

export const calculadoraDeBirras = (tempMax, cantInvitados) => {
    //1 caja -> 6 unidades
    //POR PERSONA
    // 20 - 24 grados -> 1 birra
    // <20 -> 0.75 birra
    // >20 -> 2 birras más (3 birras)

    tempMax = Math.ceil(tempMax);
    let birras;
    let cajas;

    if (tempMax > 24) {
        birras = cantInvitados * 3;
    } else if (tempMax < 20) {
        birras = Math.ceil(cantInvitados * 0.75);
    } else {
        birras = cantInvitados
    }

    cajas = Math.ceil(birras / 6);

    return {
        unidades: birras,
        cajas
    }
}

export const calcularMeetIniciada = (meet) => {
    let hoy = new Date();
    hoy.setHours(0, 0, 0, 0);//le quito las hora para comparar solo la fecha

    if (hoy.getTime() > meet.fecha.getTime()) {
        return true;
    }

    if (hoy.getTime() == meet.fecha.getTime()) {
        hoy = new Date()//reinicio la hora a la del momento
        let hora = hoy.getHours();
        let min = hoy.getMinutes();

        let horaMeet = meet.horaInicio.split(":");//la divido en hora y minutos

        if (hora >= horaMeet[0] && min >= horaMeet[1]) {
            return true;
        }
    }
    return false;
}

//calcula si la hora inicial es menor que la final
//llegan en formato string
export const horasCorrectas = (horaInicial, horaFinal) => {
    let inicial = horaInicial.split(":"); //separo horas y minutos
    let final = horaFinal.split(":");

    let hInicial = Number(inicial[0]); //cambio a numero las horas
    let hFinal = Number(final[0]);

    let mInicial = Number(inicial[1]); //cambio a numero los minutos
    let mFinal = Number(final[1]);

    if (hInicial >= hFinal && mInicial > mFinal) {
        return false;
    }

    return true;
}

//evaluo si la fecha es menor a hoy
export const fechaAceptada = (fecha) => {
    let hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    fecha.setHours(0, 0, 0, 0);

    return (hoy.getTime() <= fecha.getTime())
}

export const filtrarOrdenarNotis = (notificaciones) => {
    let semana = new Date();
    semana.setDate(semana.getDate() - 7); //hace 1 semana

    //filtro solo las notificaciones de hasta hace semana
    let notisSemana = notificaciones.filter(noti => (new Date(noti.timeStamp.seconds * 1000)).getTime() > semana.getTime())

    let sinVer = notificaciones.filter(noti => noti.vista == false)

    //ordeno por fecha
    notisSemana = notisSemana.sort((a, b) => {
        let a1 = new Date(a.timeStamp.seconds * 1000);
        let b1 = new Date(b.timeStamp.seconds * 1000);
        return (b1.getTime() - a1.getTime()) //mas nueva primero
    })

    return {
        notisSemana,
        notisNuevas: sinVer.length
    }
}

export const redirigirA = (ruta) => {
    let a = document.createElement("a");
    a.href = ruta;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}