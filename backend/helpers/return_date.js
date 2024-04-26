const fechaHoraFormateada = ()=>{
    const fechaHoraActual = new Date();
    // Obtener los componentes de fecha y hora
    const year = fechaHoraActual.getFullYear();
    const month = String(fechaHoraActual.getMonth() + 1).padStart(2, '0'); // Añadir cero al mes si es necesario
    const day = String(fechaHoraActual.getDate()).padStart(2, '0'); // Añadir cero al día si es necesario
    const hour = String(fechaHoraActual.getHours()).padStart(2, '0'); // Añadir cero a la hora si es necesario
    const minute = String(fechaHoraActual.getMinutes()).padStart(2, '0'); // Añadir cero al minuto si es necesario
    const second = String(fechaHoraActual.getSeconds()).padStart(2, '0'); // Añadir cero al segundo si es necesario
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

module.exports = fechaHoraFormateada;
//console.log(fechaHoraFormateada); 
