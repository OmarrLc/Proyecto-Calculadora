var historial = []


var tipos = ["Diesel", "2 Tiempos", "4 Tiempos"]

var localStorage = window.localStorage;

if (localStorage.getItem('historial')==null){
    localStorage.setItem('historial',JSON.stringify(historial));
}
else{
    historial = JSON.parse(localStorage.getItem('historial'));
}
function actualizarHistorial(){
    document.getElementById("registros").innerHTML = ""
    for(let i=0; i<historial.length;i++){
        document.getElementById("registros").innerHTML += `
            <tr>
                <th scope="row">${historial[i].Fechas}</th>
                <td>${historial[i].Area}</td>
                <td>${historial[i].Tipo}</td>
                <td>${historial[i].Potencia}</td>
                <td>${historial[i].Tiempo}</td>
                <td>${historial[i].Consumo}</td>
                <td>${historial[i].Gasto}</td>
            </tr>
        `
    }
}

actualizarHistorial()

function calcular() {
    var hoy = new Date()
    var fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear();
    hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    const area = parseFloat(document.getElementById('txtTerreno').value)
    const tipoMotor = parseFloat(document.getElementById('txtTipoMotor').value)
    const potencia = parseFloat(document.getElementById('txtPotencia').value)
    const pc = parseFloat(document.getElementById('txtPrecio').value)

    //console.log(prueba)
    //  console.log(parseFloat(area))
    var litros;
    var cl; // consumo en litros 
    var ttm = area / 10; // tiempo total que trabajará el motor
    if (tipoMotor === 0) {
        litros = 0.23
        cl = ttm * potencia * 0.23
    }

    if (tipoMotor === 1) {
        litros = 0.31
        cl = ttm * potencia * 0.31
    }

    if (tipoMotor === 2) {
        litros = 0.43
        cl = ttm * potencia * 0.43
    }
    var gt = cl * pc // gasto total
    console.log('gasto', gt);
    console.log('consumo', cl)
    $("#txtConsumo").val(cl.toFixed(2));
    $("#txtGasto").val(gt.toFixed(2));

    console.log(ttm)
    var limitX = Math.ceil(ttm); // redondeando el valor de las horas totales
    console.log('x:', limitX);

    var arrayValores = []; // arreglo para los valores de la gráfica

    var chart = new CanvasJS.Chart("chartContainer", {
        height: 300,
        width: 400,
        axisY: {
            title: "Costo (Lps)",
        },
        axisX: {
            title: "Tiempo (hrs)",
        },
        title: {
            text: "Sistema de riego"
        },
        data: [{
            type: "line",
            dataPoints: [
                { x: 0, y: 0 } // mostrar valores antes de iniciar (se pueden quitar si queremos que cargue en blanco la gráfica)
            ]

        }]
    });
    chart.render(); // cargar el gráfico

    //llenar el arreglo con los valores a mostrar en la gráfica 
    for (let i = 0; i <= limitX; i++) {
        let valores = {
            x: i,
            y: Math.ceil((i * litros * potencia) * pc)
        }
        arrayValores.push(valores);
    }
    console.log(arrayValores)

    var count = 0; //contador para ir corriendo los datos del arreglo
    function updateChart() {
        chart.render();
        if (count < arrayValores.length) {
            chart.options.data[0].dataPoints.push({
                x: arrayValores[count].x,
                y: arrayValores[count].y
            })
            count = count + 1;
            console.log(count)
        }
    }


    // setInterval para ir ejecutanto uno por uno los valores de la gráfica 
    var flag = true;
    var interval;
    var updateInterval = 500;

    $('#playPause').click(function() {
        if (flag && count < arrayValores.length) {
            $(this).html('Pause');
            interval = setInterval(function() {
                updateChart()
            }, updateInterval);
        } else {
            $(this).html('Play');
            clearInterval(interval);
        }
        flag = !flag;
    });
    let temp = {
        "Fechas": fecha + ' ' + hora,
        "Area": area,
        "Tipo": tipos[tipoMotor],
        "Potencia": potencia,
        "Tiempo": ttm,
        "Consumo": cl.toFixed(2),
        "Gasto":gt.toFixed(2) 
        }
    historial.push(temp)
    localStorage.setItem('historial',JSON.stringify(historial));
    actualizarHistorial()
}


//console.log(Math.ceil(1.5)); // redondea al mayor