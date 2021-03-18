export const consultarClimaSemanal = async() => {
    try {
        const apiKey = "e8ee57b1323fb8d5cfb67cafb70fff29"
        const latitud = "-34.610093"; //de caballito aprox
        const longitud = "-58.446355";
        const unidades = "metric"
        const lenguaje = "sp"//o sp para español
        const excluir = "minutely,hourly" //excluye clima por minuto y por hora

        const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitud}&lon=${longitud}&lang=${lenguaje}&units=${unidades}&exclude=${excluir}&appid=${apiKey}`, { method: "GET" })


        let clima = await res.json();
        if (clima) {
            let hoy = new Date();
            let dia = new Date()

            for (let i = 0; i < 8; i++) {
                dia.setDate(hoy.getDate() + i); //voy avanzando los dias para saber la fecha
                clima.daily[i].dia = dia.getDate();
            }

            return clima.daily;
        }

    } catch (error) {
        console.log(error);
        return [];
    }
}

export const consultarClimaSemanalMock = async() => {
    try {
        const clima = require('./templateClima.json')
        console.log('clima', clima)
        return clima.daily;
    } catch (error) {
        console.log(error);
        return [];
    }
}